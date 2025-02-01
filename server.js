import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import redis from "redis";
import axios from "axios";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("FAQ API is running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
