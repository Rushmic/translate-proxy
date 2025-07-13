const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

app.use(express.json());

app.post('/translate', async (req, res) => {
  const { text, to } = req.body;

  if (!GOOGLE_TRANSLATE_API_KEY) {
    return res.status(500).json({ error: 'Missing Google Translate API key' });
  }

  if (!text || !to) {
    return res.status(400).json({ error: 'Missing text or target language' });
  }

  try {
    const response = await axios.post(`https://translation.googleapis.com/language/translate/v2`, null, {
      params: {
        q: text,
        target: to,
        key: GOOGLE_TRANSLATE_API_KEY,
      },
    });

    const translatedText = response.data.data.translations[0].translatedText;
    res.json({ translatedText });
  } catch (err) {
    console.error('Translation error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.get('/', (req, res) => {
  res.send('Translate Proxy is running.');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
