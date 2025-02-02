import translate from 'translate-google-api';


// Example function to translate text
async function translateText(text, targetLanguage = 'en') {
  try {
    const translatedText = await translate(text, { to: targetLanguage });
    console.log(translatedText);
    return translatedText;
  } catch (error) {
    console.error('Error during translation:', error);
    return text;  
  }
}


export default translateText;