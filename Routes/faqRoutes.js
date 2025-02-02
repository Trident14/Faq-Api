import express from 'express';
import { getFAQs, createFAQ } from '../controllers/faqController.js';

const router = express.Router();


// Route to fetch FAQs
router.get('/faqs', getFAQs);

// Route to create a new FAQ
router.post('/faqs', createFAQ);

export default router;