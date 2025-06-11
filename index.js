import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('Missing URL param');

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'ngrok-skip-browser-warning': 'true'
      }
    });
    const content = await response.text();

    res.setHeader('ngrok-skip-browser-warning', 'true');
    res.send(content);
  } catch (err) {
    res.status(500).send('Error fetching target URL');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy running on port ${PORT}`);
});
