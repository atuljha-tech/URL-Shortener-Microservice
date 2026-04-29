require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dns = require('dns');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use('/public', express.static(__dirname + '/public'));

// Home route
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// MongoDB setup
const MONGO_URI = process.env.MONGO_URI;
let urlsCollection;

async function getCollection() {
  if (urlsCollection) return urlsCollection;
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  urlsCollection = client.db('url').collection('testurl');
  return urlsCollection;
}

// POST /api/shorturl
app.post('/api/shorturl', async function(req, res) {
  const inputUrl = req.body.url;

  // Validate URL format using regex (same approach as working reference)
  const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/;
  if (!urlRegex.test(inputUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // DNS lookup to verify domain exists
  const hostname = new URL(inputUrl).hostname;
  dns.lookup(hostname, async function(err) {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    try {
      const collection = await getCollection();

      // Check if URL already exists
      const existing = await collection.findOne({ original_url: inputUrl });
      if (existing) {
        return res.json({ original_url: existing.original_url, short_url: existing.short_url });
      }

      // Get the highest short_url and increment
      const last = await collection.find({}).sort({ short_url: -1 }).limit(1).toArray();
      const shortUrl = last.length > 0 ? last[0].short_url + 1 : 1;

      await collection.insertOne({ original_url: inputUrl, short_url: shortUrl });

      return res.json({ original_url: inputUrl, short_url: shortUrl });
    } catch (dbErr) {
      console.error(dbErr);
      return res.json({ error: 'server error' });
    }
  });
});

// GET /api/shorturl/:short_url
app.get('/api/shorturl/:short_url', async function(req, res) {
  const shortUrl = parseInt(req.params.short_url);

  if (isNaN(shortUrl)) {
    return res.json({ error: 'invalid url' });
  }

  try {
    const collection = await getCollection();
    const found = await collection.findOne({ short_url: shortUrl });

    if (!found) {
      return res.json({ error: 'No short URL found for the given input' });
    }

    // Disable caching so Vercel doesn't cache the redirect
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.redirect(found.original_url);
  } catch (err) {
    console.error(err);
    return res.json({ error: 'server error' });
  }
});

app.listen(port, function() {
  console.log('Listening on port ' + port);
});

module.exports = app;
