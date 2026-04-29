# URL Shortener Microservice

A full-stack URL shortener microservice built with Node.js, Express, and MongoDB.

## Features

- ✅ Shorten any valid URL
- ✅ Redirect to original URL using short URL
- ✅ URL validation with DNS lookup
- ✅ MongoDB storage with in-memory fallback
- ✅ RESTful API
- ✅ Clean and responsive UI

## API Endpoints

### POST /api/shorturl
Create a shortened URL.

**Request Body:**
```json
{
  "url": "https://www.example.com"
}
```

**Response:**
```json
{
  "original_url": "https://www.example.com",
  "short_url": 1
}
```

**Error Response:**
```json
{
  "error": "invalid url"
}
```

### GET /api/shorturl/:short_url
Redirect to the original URL.

**Example:**
```
GET /api/shorturl/1
```
Redirects to the original URL.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/atuljha-tech/URL-Shortener-Microservice.git
cd URL-Shortener-Microservice
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

**Note:** This project uses MongoDB Atlas. Make sure to:
- Create a database named `url`
- Create a collection named `testurl`
- Replace `your_mongodb_connection_string` with your actual MongoDB URI

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## MongoDB Setup

### Option 1: Local MongoDB
Install MongoDB locally and it will connect automatically.

### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Update `MONGO_URI` in `.env` file

### Option 3: In-Memory Storage
If MongoDB is not available, the app automatically falls back to in-memory storage (data will be lost on restart).

## Testing

Test the API using curl:

```bash
# Create a short URL
curl -X POST http://localhost:3000/api/shorturl \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.freecodecamp.org"}'

# Access the short URL (replace 1 with the returned short_url)
curl -L http://localhost:3000/api/shorturl/1
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **DNS Module** - URL validation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## Project Structure

```
.
├── server.js           # Main application file
├── package.json        # Dependencies and scripts
├── .env               # Environment variables
├── README.md          # Documentation
├── views/
│   └── index.html     # Frontend HTML
└── public/
    └── style.css      # Styles
```

## Requirements Met

✅ You should provide your own project, not the example URL  
✅ You can POST a URL to `/api/shorturl` and get a JSON response with `original_url` and `short_url` properties  
✅ When you visit `/api/shorturl/<short_url>`, you will be redirected to the original URL  
✅ If you pass an invalid URL that doesn't follow the valid `http://www.example.com` format, the JSON response will contain `{ error: 'invalid url' }`

## License

MIT

## Author

Built as part of the freeCodeCamp Back End Development and APIs certification.
