// Google Translate API integration
// Note: For production, you'll need to set up Google Cloud Translation API
// and add your API key to environment variables

const GOOGLE_TRANSLATE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;

export const translateText = async (text, targetLanguage, sourceLanguage = 'auto') => {
  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.warn('Google Translate API key not found. Using fallback translations.');
    return text; // Return original text if no API key
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text'
        })
      }
    );

    if (!response.ok) {
      throw new Error('Translation request failed');
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
};

export const translateBatch = async (texts, targetLanguage, sourceLanguage = 'auto') => {
  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.warn('Google Translate API key not found. Using fallback translations.');
    return texts; // Return original texts if no API key
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: texts,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text'
        })
      }
    );

    if (!response.ok) {
      throw new Error('Translation request failed');
    }

    const data = await response.json();
    return data.data.translations.map(translation => translation.translatedText);
  } catch (error) {
    console.error('Translation error:', error);
    return texts; // Return original texts on error
  }
};

// Language detection
export const detectLanguage = async (text) => {
  if (!GOOGLE_TRANSLATE_API_KEY) {
    return 'en'; // Default to English if no API key
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2/detect?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text
        })
      }
    );

    if (!response.ok) {
      throw new Error('Language detection request failed');
    }

    const data = await response.json();
    return data.data.detections[0][0].language;
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en'; // Default to English on error
  }
};

// Supported languages
export const supportedLanguages = {
  'en': 'English',
  'zh': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  'ms': 'Malay',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'ja': 'Japanese',
  'ko': 'Korean',
  'th': 'Thai',
  'vi': 'Vietnamese',
  'id': 'Indonesian',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'ru': 'Russian',
  'pt': 'Portuguese',
  'it': 'Italian',
  'nl': 'Dutch'
};