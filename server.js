const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config(); // optional but harmless if present

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

app.post('/translate', async (req, res) => {
  const { text, target } = req.body;

  const apiKey = process.env.GOOGLE_TRANSLATE_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Google Translate API key' });
  }

  if (!text || !target) {
    return res.status(400).json({ error: 'Missing required fields: text or target' });
  }

  try {
    const response = await axios.post(
      'https://translation.googleapis.com/language/translate/v2',
      {
        q: text,
        target: target,
        format: 'text',
      },
      {
        params: {
          key: apiKey,
        },
      }
    );

    const translatedText = response.data.data.translations[0].translatedText;
    res.json({ translatedText });
  } catch (err) {
    console.error('Translation failed:', err.response?.data || err.message);
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.listen(port, () => {
  console.log(`✅ Translate Proxy running on port ${port}`);
});
