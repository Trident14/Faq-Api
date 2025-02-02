import mongoose from "mongoose";

// Define FAQ schema
const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    translations: {
        type: Map,
        of: String,  // Stores translations dynamically
        default: {}   // Initially empty
    }
});

faqSchema.methods.getTranslation = function (lang) {
  const translation = this.translations.get(lang);
  if (translation) {
      const [translatedQuestion, translatedAnswer] = translation.split('$$');
      return { question: translatedQuestion, answer: translatedAnswer };
  }
  return { question: this.question, answer: this.answer }; // Fallback to original
};
const FAQ = mongoose.model("FAQ", faqSchema);
export default FAQ;
