import express from "express";
import dotenv from "dotenv";
import connectMongoDB from './config/mongo.js';
import faqRoutes from './routes/faqRoutes.js'; 
import cors from "cors";
import swaggerSetup from "./config/swaggerConfig.js";
dotenv.config();

const app = express();

// Use CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json()); // 👈 This must be before routes

// Connect to MongoDB
connectMongoDB();

swaggerSetup(app);
// Register the FAQ routes
app.use('/api', faqRoutes); // 👈 Routes are now properly set

// Default route
app.get("/", (req, res) => {
  res.send("FAQ API is running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
