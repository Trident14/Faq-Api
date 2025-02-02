
// routes/faqRoutes.js
import express from "express";
import { getFAQs, createFAQ } from "../controllers/faqController.js";

const router = express.Router();

/**
 * @swagger
 * /api/faqs:
 *   get:
 *     summary: Get a list of FAQs
 *     description: Retrieve all FAQs with support for multi-language translation.
 *     parameters:
 *       - in: query
 *         name: lang
 *         required: false
 *         schema:
 *           type: string
 *           default: en
 *         description: Language code for translation (e.g., 'en', 'hi').
 *     responses:
 *       200:
 *         description: A list of FAQs with translations (if available)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   question:
 *                     type: string
 *                   answer:
 *                     type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/faqs", getFAQs);

/**
 * @swagger
 * /api/faqs:
 *   post:
 *     summary: Create a new FAQ
 *     description: Add a new FAQ to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: "What is Node.js?"
 *               answer:
 *                 type: string
 *                 example: "Node.js is a runtime built on Chrome's V8 JavaScript engine."
 *             required:
 *               - question
 *               - answer
 *     responses:
 *       201:
 *         description: FAQ created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 question:
 *                   type: string
 *                 answer:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post("/faqs", createFAQ);

export default router;
