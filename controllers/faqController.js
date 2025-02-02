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
        if (!faq.translations[lang]) {
          // Translate question and answer individually
          const translatedQuestion = await translate(faq.question, lang);
          const translatedAnswer = await translate(faq.answer, lang);

          // Add translated question and answer to translations object
          faq.translations[lang] = {
            question: translatedQuestion,
            answer: translatedAnswer
          };

          await faq.save(); // Update MongoDB with new translations
        }
      });

      // Wait for all translation promises to complete
      await Promise.all(translatePromises);
    }

    // Format response with the translated question and answer
    const response = faqs.map(faq => {
      const translation = faq.translations[lang];
      if (translation) {
        // If translation exists, return the translated question and answer
        return {
          _id: faq._id,
          question: translation.question,
          answer: translation.answer
        };
      } else {
        // Fallback to original question and answer if no translation is available
        return {
          _id: faq._id,
          question: faq.question,
          answer: faq.answer
        };
      }
    });

    // Cache the entire list of FAQs for the given language
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

    // Check if an FAQ with the same question already exists
    const existingFAQ = await FAQ.findOne({ question }).select('question answer');

    if (existingFAQ) {
      return res.status(400).json({ message: "FAQ already exists" });
    }

    // Create a new FAQ if it doesn't exist
    const newFAQ = new FAQ({
      question,
      answer,
      translations: {} 
    });

    await newFAQ.save();

    res.status(201).json({ message: "FAQ added successfully" });
  } catch (err) {
    console.error("Error creating FAQ:", err);
    res.status(500).json({ message: "Error creating FAQ" });
  }
};
