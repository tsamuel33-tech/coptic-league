# Deployment Guide

## ⚠️ Important: PythonAnywhere Limitation

**PythonAnywhere only supports Python applications, not Node.js**. Your backend is built with Node.js/Express, so it cannot be deployed to PythonAnywhere.

However, you have several excellent **FREE** alternatives that support Node.js!

---

## Recommended Free Hosting Options

### 🏆 Option 1: Render (RECOMMENDED - Easiest)

**Why Render?**
- ✅ FREE tier for both backend and frontend
- ✅ Automatic deployments from GitHub
- ✅ Built-in PostgreSQL/MongoDB support
- ✅ HTTPS by default
- ✅ Zero configuration needed

**Steps:**

1. **Sign up**: Go to https://render.com and sign up (free)

2. **Deploy Backend:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo or upload code
   - Settings:
     - Name: `coptic-league-api`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Add Environment Variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_secret_key
     NODE_ENV=production
     ```
   - Click "Create Web Service"
   - Copy the URL (e.g., `https://coptic-league-api.onrender.com`)

3. **Deploy Frontend:**
   - Click "New +" → "Static Site"
   - Connect your GitHub repo
   - Settings:
     - Name: `coptic-league`
     - Build Command: `cd frontend && npm install && npm run build`
     - Publish Directory: `frontend/dist`
   - Update `frontend/src/utils/api.js`:
     ```javascript
     const API_BASE_URL = 'https://coptic-league-api.onrender.com/api';
     ```
   - Click "Create Static Site"

4. **Your app is LIVE!** 🎉

---

### 🚀 Option 2: Railway (Great Alternative)

**Why Railway?**
- ✅ $5 FREE credit per month
- ✅ Automatic deployments
- ✅ One-click MongoDB setup
- ✅ Fast deployment

**Steps:**

1. **Sign up**: https://railway.app
2. **New Project** → "Deploy from GitHub"
3. Add MongoDB plugin
4. Add environment variables
5. Deploy!

Documentation: https://docs.railway.app/deploy/deployments

---

### 🌐 Option 3: Vercel (Frontend) + Render (Backend)

**Best for:** Separate frontend/backend deployment

**Frontend on Vercel:**
```bash
npm install -g vercel
cd frontend
vercel
```

**Backend on Render** (see Option 1)

---

### 💰 Option 4: Heroku (Has Free Tier)

**Note:** Heroku ended free tier but offers eco dynos ($5/month)

**Steps:**
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
cd backend
heroku create coptic-league-api

# Add MongoDB Atlas
heroku config:set MONGODB_URI=your_connection_string
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

---

## Step-by-Step: Deploy to Render (RECOMMENDED)

### Prerequisites

1. ✅ MongoDB Atlas account (free)
2. ✅ GitHub account
3. ✅ Your code pushed to GitHub

### Step 1: Prepare Your Code

```bash
cd "coptic league"

# Create .gitignore if not exists
cat > .gitignore << EOF
node_modules/
.env
.DS_Store
*.log
dist/
build/
EOF

# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
# (Follow GitHub's instructions)
git remote add origin https://github.com/yourusername/coptic-league.git
git branch -M main
git push -u origin main
```

### Step 2: Update Backend for Production

Update `backend/server.js` to handle production:

```javascript
// Add this at the top
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add this before the routes (for serving frontend in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}
```

### Step 3: Update Frontend API URL

Create `frontend/src/config.js`:

```javascript
export const API_URL = import.meta.env.PROD
  ? 'https://your-render-url.onrender.com/api'
  : '/api';
```

Update `frontend/src/utils/api.js`:

```javascript
import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL,
  // ... rest of config
});
```

### Step 4: Deploy to Render

1. Go to https://render.com/
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Select your repository
5. Configure:
   ```
   Name: coptic-league
   Environment: Node
   Build Command: npm install && cd frontend && npm install && npm run build
   Start Command: cd backend && npm start
   ```
6. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_secret_key
   NODE_ENV=production
   PORT=10000
   ```
7. Click "Create Web Service"
8. Wait 5-10 minutes for deployment

### Step 5: Test Your Deployed App

Your app will be available at:
```
https://coptic-league.onrender.com
```

Test the API:
```
https://coptic-league.onrender.com/api/health
https://coptic-league.onrender.com/api/leagues
```

---

## For iPhone App Access

Since you want an iPhone app to access your backend:

### Option A: Build Native iOS App (Swift)

**Requirements:**
- Mac computer
- Xcode
- Apple Developer Account ($99/year for App Store)

**Quick Setup:**
```swift
// In your iOS app, configure API base URL
let baseURL = "https://coptic-league.onrender.com/api"

// Make API calls
URLSession.shared.dataTask(with: url) { data, response, error in
    // Handle response
}
```

### Option B: Build Cross-Platform App (React Native)

**Recommended!** Use React Native to build iOS + Android apps from one codebase.

Create a new React Native project:

```bash
npx react-native init CopticLeagueApp
cd CopticLeagueApp

# Install dependencies
npm install axios @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context

# Configure API
# Create src/config/api.js
```

**Reuse your existing React components!** Most of your frontend code can be adapted for mobile.

### Option C: Progressive Web App (PWA) - EASIEST!

Convert your React app to a PWA - works on iPhone without App Store!

**Benefits:**
- ✅ No App Store approval needed
- ✅ Works on any device
- ✅ Can be "installed" on home screen
- ✅ Works offline
- ✅ Push notifications

**Steps:**

1. **Install PWA plugin:**
   ```bash
   cd frontend
   npm install vite-plugin-pwa -D
   ```

2. **Update `vite.config.js`:**
   ```javascript
   import { VitePWA } from 'vite-plugin-pwa';

   export default defineConfig({
     plugins: [
       react(),
       VitePWA({
         registerType: 'autoUpdate',
         manifest: {
           name: 'The Coptic League',
           short_name: 'Coptic League',
           description: 'Basketball League Management',
           theme_color: '#2c5282',
           icons: [
             {
               src: 'icon-192.png',
               sizes: '192x192',
               type: 'image/png'
             },
             {
               src: 'icon-512.png',
               sizes: '512x512',
               type: 'image/png'
             }
           ]
         }
       })
     ]
   })
   ```

3. **Users can install on iPhone:**
   - Open in Safari
   - Tap Share button
   - "Add to Home Screen"
   - App icon appears on home screen!

---

## Mobile App Quick Start (React Native)

I can create a React Native version of your app that works on iPhone and Android!

**Would you like me to:**
1. Create a React Native mobile app version?
2. Convert your React app to a PWA?
3. Provide iOS Swift code to connect to your API?

Let me know and I'll build it for you!

---

## Database Access from Mobile

Your iPhone app will access data through the API:

```
iOS App → HTTPS → Your Render Backend → MongoDB Atlas
```

**Example API calls from iPhone app:**

```javascript
// Login
POST https://coptic-league.onrender.com/api/auth/login
Body: { email: "user@email.com", password: "pass123" }

// Get Leagues
GET https://coptic-league.onrender.com/api/leagues

// Get Schedule
GET https://coptic-league.onrender.com/api/games

// Register for League
POST https://coptic-league.onrender.com/api/registrations
Headers: Authorization: Bearer <jwt_token>
Body: { league: "league_id", ... }
```

---

## Cost Summary

**FREE Options:**
- MongoDB Atlas: FREE (512MB)
- Render: FREE (with limitations)
- Railway: $5/month credit FREE
- GitHub: FREE
- **Total: $0/month** 🎉

**If You Need More:**
- Render Starter: $7/month (no sleep, more resources)
- MongoDB Atlas: $9/month (2GB)
- Apple Developer: $99/year (only if publishing to App Store)

---

## Recommended Setup

For your use case, I recommend:

1. **Database**: MongoDB Atlas (FREE)
2. **Backend + Frontend**: Render (FREE)
3. **Mobile**: PWA or React Native
4. **Domain** (Optional): $12/year from Namecheap

**Total Cost: $0-12/year** depending on custom domain.

---

## Next Steps

1. ✅ Set up MongoDB Atlas (see MONGODB_SETUP.md)
2. ✅ Push code to GitHub
3. ✅ Deploy to Render (5 minutes)
4. ✅ Test your live app
5. ✅ Build mobile app (PWA or React Native)

Need help with any step? Let me know!
