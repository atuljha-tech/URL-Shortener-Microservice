require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns').promises;
const { URL } = require('url');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017/urlshortener');
let db;
let urlsCollection;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    db = client.db('urlshortener');
    urlsCollection = db.collection('urls');
    console.log('Connected to MongoDB');
    
    // Create index for faster lookups
    await urlsCollection.createIndex({ short_url: 1 });
    await urlsCollection.createIndex({ original_url: 1 });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Use in-memory storage as fallback
    console.log('Using in-memory storage as fallback');
  }
}

// In-memory storage fallback
let urlDatabase = [];
let urlCounter = 1;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/public', express.static(`${process.cwd()}/public`));

// Home route
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Validate URL format
function isValidUrl(urlString) {
  try {
    const urlObj = new URL(urlString);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

// Verify DNS (check if domain exists)
async function verifyDNS(hostname) {
  try {
    await dns.lookup(hostname);
    return true;
  } catch (err) {
    return false;
  }
}

// POST /api/shorturl - Create short URL
app.post('/api/shorturl', async (req, res) => {
  const originalUrl = req.body.url;

  // Validate URL format
  if (!isValidUrl(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  try {
    const urlObj = new URL(originalUrl);
    
    // Verify DNS
    const isValidDomain = await verifyDNS(urlObj.hostname);
    if (!isValidDomain) {
      return res.json({ error: 'invalid url' });
    }

    // Check if URL already exists
    if (urlsCollection) {
      // MongoDB storage
      let existingUrl = await urlsCollection.findOne({ original_url: originalUrl });
      
      if (existingUrl) {
        return res.json({
          original_url: existingUrl.original_url,
          short_url: existingUrl.short_url
        });
      }

      // Get next short_url number
      const count = await urlsCollection.countDocuments();
      const shortUrl = count + 1;

      // Insert new URL
      const newUrl = {
        original_url: originalUrl,
        short_url: shortUrl
      };

      await urlsCollection.insertOne(newUrl);

      return res.json({
        original_url: newUrl.original_url,
        short_url: newUrl.short_url
      });
    } else {
      // In-memory storage fallback
      let existingUrl = urlDatabase.find(item => item.original_url === originalUrl);
      
      if (existingUrl) {
        return res.json({
          original_url: existingUrl.original_url,
          short_url: existingUrl.short_url
        });
      }

      const newUrl = {
        original_url: originalUrl,
        short_url: urlCounter++
      };

      urlDatabase.push(newUrl);

      return res.json({
        original_url: newUrl.original_url,
        short_url: newUrl.short_url
      });
    }
  } catch (error) {
    console.error('Error creating short URL:', error);
    return res.json({ error: 'invalid url' });
  }
});

// GET /api/shorturl/:short_url - Redirect to original URL
app.get('/api/shorturl/:short_url', async (req, res) => {
  const shortUrl = parseInt(req.params.short_url);

  if (isNaN(shortUrl)) {
    return res.json({ error: 'invalid url' });
  }

  try {
    if (urlsCollection) {
      // MongoDB storage
      const urlDoc = await urlsCollection.findOne({ short_url: shortUrl });
      
      if (urlDoc) {
        return res.redirect(urlDoc.original_url);
      } else {
        return res.json({ error: 'No short URL found for the given input' });
      }
    } else {
      // In-memory storage fallback
      const urlDoc = urlDatabase.find(item => item.short_url === shortUrl);
      
      if (urlDoc) {
        return res.redirect(urlDoc.original_url);
      } else {
        return res.json({ error: 'No short URL found for the given input' });
      }
    }
  } catch (error) {
    console.error('Error retrieving URL:', error);
    return res.json({ error: 'Server error' });
  }
});

// Start server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
