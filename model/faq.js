const mongoose = require('mongoose');
const { Schema } = mongoose;

// FAQ Model
const faqSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  translations: {
    hi: { type: String },
    bn: { type: String },
  },
});

const FAQ = mongoose.model('FAQ', faqSchema);
module.exports = FAQ;
