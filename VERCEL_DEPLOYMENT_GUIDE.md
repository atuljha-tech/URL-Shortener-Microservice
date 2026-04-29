# Vercel Deployment Guide - Step by Step

## 🚀 Quick Deployment Steps

### Step 1: Go to Vercel
1. Visit [https://vercel.com](https://vercel.com)
2. Sign in with your GitHub account

### Step 2: Import Your Repository
1. Click **"Add New..."** button (top right)
2. Select **"Project"**
3. Find and select your repository: `atuljha-tech/URL-Shortener-Microservice`
4. Click **"Import"**

### Step 3: Configure Project
1. **Framework Preset:** Vercel should auto-detect it as "Other"
2. **Root Directory:** Leave as `./` (default)
3. **Build Command:** Leave empty or use `npm install`
4. **Output Directory:** Leave empty
5. **Install Command:** `npm install`

### Step 4: Add Environment Variable (IMPORTANT!)
Before clicking "Deploy", you MUST add the environment variable:

1. Scroll down to **"Environment Variables"** section
2. Click to expand it
3. Add the following:
   - **Name:** `MONGO_URI`
   - **Value:** `mongodb+srv://atuljh275:atul277777@cluster0.blbtk8l.mongodb.net/?appName=Cluster0`
   - **Environment:** Select all (Production, Preview, Development)
4. Click **"Add"**

### Step 5: Deploy
1. Click **"Deploy"** button
2. Wait 1-2 minutes for deployment to complete
3. Once done, you'll see "Congratulations!" message
4. Click **"Visit"** to see your live app

### Step 6: Test Your Deployment
Visit your app URL (e.g., `https://your-project-name.vercel.app`) and test:

1. **Test the homepage:** Should show the URL shortener interface
2. **Test creating a short URL:**
   ```bash
   curl -X POST https://your-project-name.vercel.app/api/shorturl \
     -H "Content-Type: application/json" \
     -d '{"url":"https://www.freecodecamp.org"}'
   ```
3. **Test redirect:** Visit `https://your-project-name.vercel.app/api/shorturl/1`

---

## 🔧 If You Forgot to Add Environment Variable

If you deployed without adding `MONGO_URI`, don't worry:

1. Go to your project dashboard on Vercel
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in the left sidebar
4. Add the variable:
   - **Name:** `MONGO_URI`
   - **Value:** `mongodb+srv://atuljh275:atul277777@cluster0.blbtk8l.mongodb.net/?appName=Cluster0`
5. Click **"Save"**
6. Go to **"Deployments"** tab
7. Click the three dots (...) on the latest deployment
8. Click **"Redeploy"**

---

## 📝 Your MongoDB Connection Details

- **Database Name:** `url`
- **Collection Name:** `testurl`
- **Connection String:** Already configured in the environment variable above

---

## ✅ Verification Checklist

After deployment, verify:
- [ ] Homepage loads correctly
- [ ] Can create short URLs via POST request
- [ ] Short URLs redirect to original URLs
- [ ] Invalid URLs return error messages
- [ ] MongoDB connection is working (check Vercel logs if issues)

---

## 🐛 Troubleshooting

### Error: "Cannot connect to MongoDB"
- Check that `MONGO_URI` environment variable is set correctly
- Verify MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
- Check MongoDB Atlas cluster is running

### Error: "Application Error"
- Check Vercel deployment logs
- Go to your project → Deployments → Click on deployment → View Function Logs

### How to View Logs
1. Go to your project on Vercel
2. Click **"Deployments"** tab
3. Click on the latest deployment
4. Click **"View Function Logs"**
5. Look for any error messages

---

## 🎉 Success!

Once deployed, your URL shortener will be live at:
`https://your-project-name.vercel.app`

You can now submit this URL to freeCodeCamp!

---

## 📌 Important Notes

- Vercel automatically redeploys when you push to GitHub
- Environment variables are encrypted and secure
- Free tier includes:
  - Unlimited deployments
  - 100GB bandwidth per month
  - Automatic HTTPS
  - Custom domains (optional)

---

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas](https://cloud.mongodb.com)
