require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dns = require('dns');
const { MongoClient } = require('mongodb');

const app = express();

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

// MongoDB - create ONE client and reuse it (critical for serverless)
const mongoClient = new MongoClient(process.env.MONGO_URI);
let isConnected = false;

async function connectDB() {
  if (!isConnected) {
    await mongoClient.connect();
    isConnected = true;
  }
  return mongoClient.db('url').collection('testurl');
}

// POST /api/shorturl
app.post('/api/shorturl', function(req, res) {
  const inputUrl = req.body.url;

  // Step 1: Validate format with regex
  const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/;
  if (!urlRegex.test(inputUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Step 2: DNS lookup to verify domain
  let hostname;
  try {
    hostname = new URL(inputUrl).hostname;
  } catch(e) {
    return res.json({ error: 'invalid url' });
  }

  dns.lookup(hostname, function(err) {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    // Step 3: Save to DB
    connectDB().then(function(collection) {
      // Check if already exists
      return collection.findOne({ original_url: inputUrl }).then(function(existing) {
        if (existing) {
          return res.json({ original_url: existing.original_url, short_url: existing.short_url });
        }

        // Get highest short_url and increment
        return collection.find({}).sort({ short_url: -1 }).limit(1).toArray().then(function(docs) {
          const shortUrl = docs.length > 0 ? docs[0].short_url + 1 : 1;
          return collection.insertOne({ original_url: inputUrl, short_url: shortUrl }).then(function() {
            return res.json({ original_url: inputUrl, short_url: shortUrl });
          });
        });
      });
    }).catch(function(dbErr) {
      console.error('DB error:', dbErr);
      return res.json({ error: 'server error' });
    });
  });
});

// GET /api/shorturl/:short_url
app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = parseInt(req.params.short_url);

  if (isNaN(shortUrl)) {
    return res.json({ error: 'invalid url' });
  }

  connectDB().then(function(collection) {
    return collection.findOne({ short_url: shortUrl }).then(function(found) {
      if (!found) {
        return res.json({ error: 'No short URL found for the given input' });
      }
      // No-cache headers so Vercel doesn't cache the redirect
      res.set('Cache-Control', 'no-store');
      return res.redirect(found.original_url);
    });
  }).catch(function(err) {
    console.error('DB error:', err);
    return res.json({ error: 'server error' });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on port ' + port);
});

module.exports = app;
