const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🔍 DEBUG: Log the env variable at startup
console.log("✅ ENV TEST: API Key is", process.env.GOOGLE_TRANSLATE_API_KEY);
if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
  console.error("❌ GOOGLE_TRANSLATE_API_KEY is missing!");
}

app.post('/translate', async (req, res) => {
  const { text, to } = req.body;
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Google Translate API key' });
  }

  if (!text || !to) {
    return res.status(400).json({ error: 'Missing "text" or "to" parameter' });
  }

  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        q: text,
        target: to,
        format: 'text',
      }
    );

    const translatedText = response.data.data.translations[0].translatedText;
    res.json({ translatedText });
  } catch (error) {
    console.error("❌ Error during translation request:", error?.response?.data || error.message);
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
