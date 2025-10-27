# 🎯 START HERE - Your Complete Setup Guide

## What You Asked For

1. ✅ **MongoDB Installation** - See below
2. ✅ **Deployment** - Important note about PythonAnywhere
3. ✅ **iPhone App Connection** - API integration guide

---

## 📱 Important Update About PythonAnywhere

**PythonAnywhere only supports Python applications**. Your backend is built with Node.js, so it **cannot** be deployed to PythonAnywhere.

**Good News:** I've provided FREE alternatives that work even better:
- **Render.com** - FREE, easy, recommended ⭐
- **Railway.app** - $5/month free credit
- **Vercel** - FREE for frontend + Render for backend

All include HTTPS, automatic deployments, and work perfectly with your iPhone app!

---

## 🚀 Three Simple Steps

### Step 1: Install MongoDB (15 minutes)

**Recommended: MongoDB Atlas (Cloud - FREE)**

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create FREE account
3. Create FREE cluster (M0 tier)
4. Add database user with username/password
5. Whitelist IP: `0.0.0.0/0` (allow from anywhere)
6. Get connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/coptic-league
   ```
7. Save this connection string - you'll need it!

**📖 Detailed guide:** [MONGODB_SETUP.md](MONGODB_SETUP.md)

---

### Step 2: Deploy Your Backend (15 minutes)

**Using Render (Recommended):**

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/coptic-league.git
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Sign up at https://render.com (free)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     ```
     Name: coptic-league
     Build Command: npm install && cd frontend && npm install && npm run build
     Start Command: cd backend && npm start
     ```
   - Add Environment Variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string_here
     JWT_SECRET=your_secret_key_make_this_random
     NODE_ENV=production
     ```
   - Click "Create Web Service"

3. **Wait 5-10 minutes** - Your app will be live at:
   ```
   https://coptic-league-xxxx.onrender.com
   ```

**📖 Detailed guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

### Step 3: Connect Your iPhone App (5 minutes)

**In your iPhone app, update the API base URL:**

```swift
// Change from:
let API_BASE_URL = "http://localhost:5000/api"

// To your deployed URL:
let API_BASE_URL = "https://coptic-league-xxxx.onrender.com/api"
```

**That's it!** Your iPhone app can now:
- Register users
- Login
- View leagues and divisions
- View teams and rosters
- View game schedules
- View standings
- Register for leagues

**📖 Complete API guide:** [API_INTEGRATION_FOR_IPHONE.md](API_INTEGRATION_FOR_IPHONE.md)

---

## 📊 Your Backend API Endpoints

All endpoints your iPhone app can use:

### Authentication (No token needed)
```
POST /api/auth/register    - Create new user
POST /api/auth/login       - Login and get token
```

### User Profile (Token required)
```
GET  /api/auth/me          - Get current user
PUT  /api/auth/profile     - Update profile
```

### Leagues (Public)
```
GET  /api/leagues          - Get all leagues
GET  /api/leagues/:id      - Get league details
GET  /api/leagues/:id/standings - Get standings
```

### Teams (Public)
```
GET  /api/teams            - Get all teams
GET  /api/teams/:id        - Get team details with roster
```

### Games (Public)
```
GET  /api/games            - Get all games (schedule)
GET  /api/games/:id        - Get game details
```

### Registration (Token required)
```
POST /api/registrations    - Register for a league
GET  /api/registrations    - Get user's registrations
```

---

## 🧪 Testing Your Setup

### 1. Test Backend Locally

```bash
cd backend
npm install
npm run dev
```

Visit: http://localhost:5000/api/health

Should see: `{"status":"OK","message":"Server is running"}`

### 2. Test with curl

```bash
# Get leagues
curl https://your-app.onrender.com/api/leagues

# Should return [] or league data
```

### 3. Test from iPhone

In your iPhone app:
```swift
func testConnection() async {
    let url = URL(string: "https://your-app.onrender.com/api/health")!
    let (data, _) = try await URLSession.shared.data(from: url)
    let json = try JSONDecoder().decode([String: String].self, from: data)
    print(json) // Should print: ["status": "OK", "message": "Server is running"]
}
```

---

## 💡 Quick Example: Login from iPhone

```swift
func login(email: String, password: String) async throws -> User {
    let url = URL(string: "https://your-app.onrender.com/api/auth/login")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")

    let body = ["email": email, "password": password]
    request.httpBody = try JSONSerialization.data(withJSONObject: body)

    let (data, _) = try await URLSession.shared.data(for: request)
    let response = try JSONDecoder().decode(AuthResponse.self, from: data)

    // Save token for authenticated requests
    UserDefaults.standard.set(response.token, forKey: "authToken")

    return response
}

struct AuthResponse: Codable {
    let _id: String
    let firstName: String
    let lastName: String
    let email: String
    let role: String
    let token: String  // Use this for authenticated requests
}
```

---

## 💰 Cost Breakdown

**FREE Option (Everything you need):**
- MongoDB Atlas: **FREE** (512MB storage)
- Render Hosting: **FREE** (web service + static site)
- GitHub: **FREE**
- **Total: $0/month** 🎉

**Optional Upgrades (Only if you need more):**
- Render Starter: $7/month (no sleep, 500hrs)
- MongoDB M10: $9/month (2GB, backups)
- Custom domain: $12/year

---

## 📚 All Documentation Files

| File | What It's For |
|------|---------------|
| **START_HERE.md** | This file - quick overview |
| **API_INTEGRATION_FOR_IPHONE.md** | ⭐ Connect your iPhone app |
| **MONGODB_SETUP.md** | MongoDB installation (local & cloud) |
| **DEPLOYMENT_GUIDE.md** | Deploy to Render/Railway/etc |
| **GETTING_STARTED.md** | Complete checklist |
| **README.md** | Full project documentation |
| **QUICKSTART.md** | 5-minute local setup |

---

## 🆘 Troubleshooting

### "Can't connect to MongoDB"
- Check your MongoDB Atlas IP whitelist (use 0.0.0.0/0)
- Verify connection string has correct password
- Make sure MongoDB Atlas cluster is active

### "iPhone app can't reach API"
- Make sure you deployed to Render
- Check the URL in your iPhone app matches Render URL
- Test with curl first to verify API works

### "Getting 401 Unauthorized"
- Make sure you're including the JWT token in headers
- Format: `Authorization: Bearer <token>`
- Token is returned from login/register endpoints

### "Backend won't start on Render"
- Check build logs in Render dashboard
- Verify environment variables are set
- Make sure MongoDB connection string is correct

---

## ✅ Your Action Checklist

- [ ] Set up MongoDB Atlas account
- [ ] Get MongoDB connection string
- [ ] Push code to GitHub
- [ ] Deploy to Render
- [ ] Add environment variables in Render
- [ ] Wait for deployment (5-10 min)
- [ ] Test API with curl
- [ ] Update iPhone app base URL
- [ ] Test connection from iPhone
- [ ] Create first user account
- [ ] Test all endpoints

---

## 🎯 Next Steps After Setup

1. **Create test data:**
   - Register as admin user
   - Create a league
   - Create teams
   - Schedule games
   - Test registration flow

2. **Customize:**
   - Update colors and branding
   - Add your league logo
   - Customize divisions
   - Set registration fees

3. **Go live:**
   - Share URL with users
   - Test with real devices
   - Monitor usage in MongoDB Atlas
   - Check logs in Render dashboard

---

## 💬 Need Help?

If you get stuck on:

1. **MongoDB setup** → See [MONGODB_SETUP.md](MONGODB_SETUP.md)
2. **Deployment** → See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
3. **iPhone integration** → See [API_INTEGRATION_FOR_IPHONE.md](API_INTEGRATION_FOR_IPHONE.md)
4. **General setup** → See [GETTING_STARTED.md](GETTING_STARTED.md)

Or just ask me! I can:
- Help debug specific errors
- Provide more Swift code examples
- Add custom features you need
- Help with deployment issues
- Explain any part of the code

---

## 🎉 You're Ready!

Your complete sports league management system includes:

✅ RESTful API backend
✅ MongoDB database
✅ User authentication with JWT
✅ League management
✅ Team & roster management
✅ Game scheduling
✅ Registration system
✅ Standings calculation
✅ Web interface
✅ iPhone app integration
✅ FREE hosting options
✅ Complete documentation

**Total setup time: ~30-45 minutes**

Let's get started! 🚀
