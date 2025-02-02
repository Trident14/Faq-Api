import FAQ from "../models/Faq.js"; 
import redisClient from "../config/redisClient.js"; 
import translate from "../services/translateService.js"; 

export const getFAQs = async (req, res) => {
  try {
    const lang = req.query.lang || "en"; // Default to English if no language is provided

    // Check Redis cache first
    const cachedData = await redisClient.get(`faqs_${lang}`);
    if (cachedData) {
      // If cached data exists, parse and send it
      console.log('Data fetched from cache');
      return res.json(JSON.parse(cachedData));
    }

    // If no cached data, fetch from the database
    let faqs = await FAQ.find().select('question answer translations'); // Limit fields returned

    // Translate FAQs if necessary and cache the results
    if (lang !== "en") {
      // Translate each FAQ individually
      const translatePromises = faqs.map(async (faq) => {
        if (!faq.translations.has(lang)) {
          // Translate question and answer individually
          const translatedQuestion = await translate(faq.question, lang);
          const translatedAnswer = await translate(faq.answer, lang);

          // Combine question and answer with $$ separator and store in translations map
          const combinedTranslation = `${translatedQuestion}$$${translatedAnswer}`;
          faq.translations.set(lang, combinedTranslation);

          await faq.save(); // Update MongoDB with new translations
        }
      });

      // Wait for all translation promises to complete
      await Promise.all(translatePromises);
    }

    // Format response with the translated question and answer
    const response = faqs.map(faq => {
      const translation = faq.translations.get(lang);
      if (translation) {
        // Split the combined translation into question and answer
        const [translatedQuestion, translatedAnswer] = translation.split('$$');
        return {
          _id: faq._id,
          question: translatedQuestion,
          answer: translatedAnswer
        };
      } else {
        // Fallback to original question and answer
        return {
          _id: faq._id,
          question: faq.question,
          answer: faq.answer
        };
      }
    });

    // Cache the result for future use (e.g., 1 hour expiry)
    await redisClient.setEx(`faqs_${lang}`, 3600, JSON.stringify(response)); // Expire in 1 hour

    console.log('Data fetched from database');
    res.json(response); // Send the response
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create a new FAQ (initially empty translations)
export const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    const newFAQ = new FAQ({
      question,
      answer,
      translations: {}  // Empty initially
    });

    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (err) {
    console.error("Error creating FAQ:", err);
    res.status(500).json({ message: "Error creating FAQ" });
  }
};
