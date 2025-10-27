# Quick Start Guide

## Get Up and Running in 5 Minutes

### Step 1: Start MongoDB
```bash
# If you have MongoDB installed locally:
mongod

# Or use MongoDB Atlas (cloud):
# Update MONGODB_URI in backend/.env with your Atlas connection string
```

### Step 2: Start the Backend
```bash
cd backend
npm run dev
```
✅ Backend running on http://localhost:5000

### Step 3: Start the Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend running on http://localhost:3000

### Step 4: Create Your First Admin Account
1. Open http://localhost:3000 in your browser
2. Click "Register"
3. Fill out the form and select "Coach" or "Player" as role
4. Note: To make an admin, you'll need to manually update the user's role in MongoDB to "admin"

### Step 5: Explore the App
- **Home**: View the landing page with league information
- **Leagues**: Browse available leagues
- **Teams**: View all teams
- **Schedule**: See game schedules
- **Dashboard**: Your personal dashboard (after login)
- **Admin Panel**: Administrative controls (admin users only)

## Common Tasks

### Create a League (Admin)
```javascript
// Use API endpoint or admin panel:
POST /api/leagues
{
  "name": "Summer 2025 Basketball League",
  "division": "Mens",
  "season": "Summer 2025",
  "startDate": "2025-06-01",
  "endDate": "2025-08-31",
  "registrationDeadline": "2025-05-15",
  "maxTeams": 12,
  "registrationFee": 150
}
```

### Create a Team (Coach/Admin)
```javascript
POST /api/teams
{
  "name": "Warriors",
  "league": "league_id_here",
  "coach": "user_id_here",
  "homeVenue": "Main Gym",
  "maxPlayers": 15
}
```

### Schedule a Game (Admin)
```javascript
POST /api/games
{
  "league": "league_id_here",
  "homeTeam": "team1_id_here",
  "awayTeam": "team2_id_here",
  "scheduledDate": "2025-07-15",
  "scheduledTime": "7:00 PM",
  "venue": "Main Gym",
  "venueAddress": "123 Main St"
}
```

## Testing the API

Use curl, Postman, or any HTTP client:

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "player"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get all leagues
curl http://localhost:5000/api/leagues

# Get all teams
curl http://localhost:5000/api/teams

# Get all games
curl http://localhost:5000/api/games
```

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod`
- Check the MONGODB_URI in backend/.env
- Verify MongoDB is accessible on port 27017

### Port Already in Use
```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### CORS Issues
- Ensure frontend is running on http://localhost:3000
- Backend CORS is configured to accept requests from frontend

### JWT Token Issues
- Clear browser localStorage
- Re-login to get a new token
- Check JWT_SECRET is set in backend/.env

## Next Steps

1. **Customize Styling**: Update App.css and component CSS files
2. **Add Payment Integration**: Integrate Stripe or PayPal
3. **Email Notifications**: Set up email service (SendGrid, Mailgun)
4. **Deploy**: Host on Heroku, AWS, or Vercel
5. **Add Tests**: Write unit and integration tests

## Need Help?

Check the full README.md for comprehensive documentation!
