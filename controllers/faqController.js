import FAQ from "../models/Faq.js"; 
import redisClient from "../config/redisClient.js"; 
import translate from "../services/translateService.js"; 
export const getFAQs = async (req, res) => {
  try {
    const lang = req.query.lang || "en"; // Default to English if no language is provided

    // Check Redis cache first
    const cachedData = await redisClient.get(`faqs_${lang}`);
    if (cachedData) {
      // Parse cached data
      const cachedFAQs = JSON.parse(cachedData);

      // Fetch FAQs from MongoDB
      let faqs = await FAQ.find().select('question answer translations');

      // Check if the number of cached FAQs matches the MongoDB FAQ size
      if (cachedFAQs.length === faqs.length) {
        // Check if all FAQs have the requested language translation
        const allTranslated = faqs.every(faq => faq.translations[lang]);
        
        if (allTranslated) {
          // If all FAQs are fully translated, return cached data
          console.log('All translations available, data fetched from cache');
          return res.json(cachedFAQs);
        } else {
          // If some translations are missing, fetch the missing translations, update the cache, and return the updated response
          const translatePromises = faqs.map(async (faq) => {
            if (!faq.translations[lang]) {
              const translatedQuestion = await translate(faq.question, lang);
              const translatedAnswer = await translate(faq.answer, lang);

              faq.translations[lang] = {
                question: translatedQuestion,
                answer: translatedAnswer
              };

              await faq.save(); // Update MongoDB with new translations
            }
          });

          // Wait for all translation promises to complete
          await Promise.all(translatePromises);

          // Format the updated response
          const updatedResponse = faqs.map(faq => ({
            _id: faq._id,
            question: faq.translations[lang].question,
            answer: faq.translations[lang].answer
          }));

          // Cache the updated FAQs
          await redisClient.setEx(`faqs_${lang}`, 3600, JSON.stringify(updatedResponse));

          console.log('Some translations were missing, data updated and fetched from database');
          return res.json(updatedResponse); // Send the updated response
        }
      }
    }

    // If no cache or mismatch in size, fetch from the database
    let faqs = await FAQ.find().select('question answer translations');
    
    // Translate FAQs if necessary
    const translatePromises = faqs.map(async (faq) => {
      if (!faq.translations[lang]) {
        const translatedQuestion = await translate(faq.question, lang);
        const translatedAnswer = await translate(faq.answer, lang);

        faq.translations[lang] = {
          question: translatedQuestion,
          answer: translatedAnswer
        };

        await faq.save(); // Update MongoDB with new translations
      }
    });

    // Wait for all translation promises to complete
    await Promise.all(translatePromises);

    // Format response with the translated question and answer
    const response = faqs.map(faq => ({
      _id: faq._id,
      question: faq.translations[lang].question,
      answer: faq.translations[lang].answer
    }));

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
