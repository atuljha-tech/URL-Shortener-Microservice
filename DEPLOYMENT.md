# Deployment Guide

## Deploy to Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to [Vercel](https://vercel.com) and sign in**

2. **Import your GitHub repository:**
   - Click "Add New..." → "Project"
   - Import your repository: `atuljha-tech/URL-Shortener-Microservice`

3. **Configure Environment Variables:**
   - Before deploying, click on "Environment Variables"
   - Add the following variable:
     - **Name:** `MONGO_URI`
     - **Value:** `mongodb+srv://atuljh275:atul277777@cluster0.blbtk8l.mongodb.net/?appName=Cluster0`
   - Click "Add"

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-project-name.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel
```

4. **Add Environment Variable:**
```bash
vercel env add MONGO_URI
```
When prompted, paste your MongoDB URI:
```
mongodb+srv://atuljh275:atul277777@cluster0.blbtk8l.mongodb.net/?appName=Cluster0
```

5. **Redeploy with environment variables:**
```bash
vercel --prod
```

### Important Notes for Vercel:
- Environment variables are added through the Vercel dashboard or CLI, NOT in `vercel.json`
- Make sure to add the `MONGO_URI` variable before or immediately after deployment
- If you forget to add it, go to Project Settings → Environment Variables → Add

## Deploy to Heroku

1. **Install Heroku CLI**:
```bash
brew install heroku/brew/heroku  # macOS
```

2. **Login to Heroku**:
```bash
heroku login
```

3. **Create Heroku app**:
```bash
heroku create your-app-name
```

4. **Set environment variables**:
```bash
heroku config:set MONGO_URI=your_mongodb_connection_string
```

5. **Deploy**:
```bash
git push heroku main
```

6. **Open your app**:
```bash
heroku open
```

## Deploy to Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Add environment variable: `MONGO_URI`
6. Deploy!

## Deploy to Render

1. Go to [Render](https://render.com)
2. Click "New +"
3. Select "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variable: `MONGO_URI`
7. Deploy!

## Local Development

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
Create a `.env` file:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/urlshortener
```

3. **Start MongoDB locally** (optional):
```bash
mongod
```

4. **Run the server**:
```bash
npm start
```

5. **For development with auto-reload**:
```bash
npm run dev
```

## Testing

Run the test script:
```bash
./test-api.sh
```

Or test manually:
```bash
# Create short URL
curl -X POST http://localhost:3000/api/shorturl \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.freecodecamp.org"}'

# Access short URL
curl -L http://localhost:3000/api/shorturl/1
```

## Troubleshooting

### MongoDB Connection Issues
- Make sure your MongoDB URI is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Verify network connectivity

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```
