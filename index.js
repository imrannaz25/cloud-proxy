const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing URL');

  try {
    const response = await fetch(url);
    if (!response.ok) return res.status(500).send('Error fetching URL');

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return res.status(415).send('Only HTML content allowed');
    }

    const body = await response.text();
    res.setHeader('Content-Type', 'text/html');
    res.send(body);
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).send('Error fetching URL');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
