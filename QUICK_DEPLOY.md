# 🚀 Quick Deploy to Vercel - Copy & Paste Guide

## Step 1: Go to Vercel
👉 https://vercel.com

## Step 2: Import Repository
1. Click **"Add New..."** → **"Project"**
2. Select: `atuljha-tech/URL-Shortener-Microservice`
3. Click **"Import"**

## Step 3: Add Environment Variable
**BEFORE clicking Deploy**, add this:

### Variable Name:
```
MONGO_URI
```

### Variable Value (copy this exactly):
```
mongodb+srv://atuljh275:atul277777@cluster0.blbtk8l.mongodb.net/?appName=Cluster0
```

### Environment:
✅ Production  
✅ Preview  
✅ Development  

## Step 4: Deploy
Click **"Deploy"** and wait 1-2 minutes

## Step 5: Test
Once deployed, test your app:

### Test 1: Visit homepage
```
https://your-app-name.vercel.app
```

### Test 2: Create short URL
```bash
curl -X POST https://your-app-name.vercel.app/api/shorturl \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.freecodecamp.org"}'
```

Expected response:
```json
{"original_url":"https://www.freecodecamp.org","short_url":1}
```

### Test 3: Test redirect
Visit in browser:
```
https://your-app-name.vercel.app/api/shorturl/1
```

Should redirect to: `https://www.freecodecamp.org`

---

## ✅ Done!
Your URL Shortener is now live and ready for freeCodeCamp submission!

---

## 🆘 Troubleshooting

### If you forgot to add MONGO_URI:
1. Go to Project → **Settings** → **Environment Variables**
2. Add `MONGO_URI` with the value above
3. Go to **Deployments** → Click ⋯ → **Redeploy**

### If deployment fails:
1. Check **Function Logs** in Vercel dashboard
2. Verify MongoDB Atlas allows connections from `0.0.0.0/0`
3. Make sure database `url` and collection `testurl` exist

---

## 📋 MongoDB Details
- **Database:** `url`
- **Collection:** `testurl`
- **Connection:** Already configured in MONGO_URI above
