require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// ── MongoDB with connection caching ──────────────────────────────────────────
let cachedDb = null;

async function getCollection() {
  if (cachedDb) return cachedDb;
  const client = new MongoClient(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });
  await client.connect();
  cachedDb = client.db('url').collection('testurl');
  return cachedDb;
}

// ── POST /api/shorturl ────────────────────────────────────────────────────────
app.post('/api/shorturl', function(req, res) {
  const inputUrl = req.body.url;

  // Validate with regex first
  const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;
  if (!urlRegex.test(inputUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Extract hostname for DNS check
  let hostname;
  try {
    hostname = new URL(inputUrl).hostname;
  } catch (e) {
    return res.json({ error: 'invalid url' });
  }

  // DNS lookup
  dns.lookup(hostname, function(err) {
    if (err) return res.json({ error: 'invalid url' });

    getCollection()
      .then(function(col) {
        // Check duplicate
        return col.findOne({ original_url: inputUrl }).then(function(existing) {
          if (existing) {
            return res.json({ original_url: existing.original_url, short_url: existing.short_url });
          }
          // Get next counter
          return col.find({}).sort({ short_url: -1 }).limit(1).toArray().then(function(docs) {
            const shortUrl = docs.length > 0 ? docs[0].short_url + 1 : 1;
            return col.insertOne({ original_url: inputUrl, short_url: shortUrl }).then(function() {
              return res.json({ original_url: inputUrl, short_url: shortUrl });
            });
          });
        });
      })
      .catch(function(e) {
        console.error(e);
        return res.json({ error: 'server error' });
      });
  });
});

// ── GET /api/shorturl/:id ─────────────────────────────────────────────────────
app.get('/api/shorturl/:id', function(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.json({ error: 'invalid url' });

  getCollection()
    .then(function(col) {
      return col.findOne({ short_url: id }).then(function(doc) {
        if (!doc) return res.json({ error: 'No short URL found for the given input' });
        return res.redirect(doc.original_url);
      });
    })
    .catch(function(e) {
      console.error(e);
      return res.json({ error: 'server error' });
    });
});

app.listen(port, function() {
  console.log('Listening on port ' + port);
});

module.exports = app;
