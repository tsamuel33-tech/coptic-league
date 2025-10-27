# The Coptic League - Sports League Management Platform

A comprehensive sports league management system inspired by TeamSideline, built specifically for The Coptic League basketball organization. This full-stack application provides features for league management, team organization, game scheduling, player registration, and more.

## Features

### Core Functionality
- **User Authentication**: Secure registration and login with JWT tokens
- **Multiple User Roles**: Player, Coach, Parent, and Admin roles with different permissions
- **League Management**: Create and manage multiple leagues across different divisions
  - High School Boys/Girls
  - Junior High
  - Men's
  - Women's
  - Geezers (35+)
- **Team Management**: Create teams, manage rosters, and track performance
- **Game Scheduling**: Schedule games, track scores, and view standings
- **Online Registration**: Complete registration forms with payment tracking
- **Player Profiles**: Manage personal information, emergency contacts, and medical info

### Admin Features
- Create and manage leagues
- Assign teams to leagues
- Schedule games and update scores
- Review and approve registrations
- Manage user accounts

## Tech Stack

### Backend
- **Node.js** with **Express.js**: RESTful API server
- **MongoDB** with **Mongoose**: Database and ODM
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation

### Frontend
- **React 19**: UI framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Vite**: Build tool and dev server
- **date-fns**: Date formatting

## Project Structure

```
coptic-league/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── gameController.js    # Game management
│   │   ├── leagueController.js  # League management
│   │   ├── teamController.js    # Team management
│   │   └── registrationController.js
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── League.js            # League schema
│   │   ├── Team.js              # Team schema
│   │   ├── Game.js              # Game schema
│   │   └── Registration.js      # Registration schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── gameRoutes.js
│   │   ├── leagueRoutes.js
│   │   ├── teamRoutes.js
│   │   └── registrationRoutes.js
│   ├── .env                     # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigation component
│   │   │   └── Navbar.css
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx  # Authentication state
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Login.jsx        # Login form
│   │   │   ├── Register.jsx     # Registration form
│   │   │   ├── Dashboard.jsx    # User dashboard
│   │   │   ├── Leagues.jsx      # League listing
│   │   │   ├── LeagueDetail.jsx # League details
│   │   │   ├── Teams.jsx        # Team listing
│   │   │   ├── TeamDetail.jsx   # Team roster
│   │   │   ├── Schedule.jsx     # Game schedule
│   │   │   ├── RegistrationForm.jsx
│   │   │   ├── Profile.jsx      # User profile
│   │   │   └── AdminPanel.jsx   # Admin dashboard
│   │   ├── utils/
│   │   │   └── api.js           # API client
│   │   ├── App.jsx              # Main app component
│   │   ├── App.css              # Global styles
│   │   └── main.jsx             # React entry point
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### 1. Clone the Repository
```bash
cd "/mnt/c/Users/19098/Documents/Python Scripts/coptic league"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your settings:
# - PORT=5000
# - MONGODB_URI=mongodb://localhost:27017/coptic-league
# - JWT_SECRET=your_secret_key
# - NODE_ENV=development

# Start MongoDB (if running locally)
# mongod

# Start the backend server
npm run dev
```

The backend API will run on http://localhost:5000

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Leagues
- `GET /api/leagues` - Get all leagues
- `GET /api/leagues/:id` - Get league by ID
- `POST /api/leagues` - Create league (admin)
- `PUT /api/leagues/:id` - Update league (admin)
- `DELETE /api/leagues/:id` - Delete league (admin)
- `GET /api/leagues/:id/standings` - Get league standings

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create team (coach/admin)
- `PUT /api/teams/:id` - Update team (coach/admin)
- `DELETE /api/teams/:id` - Delete team (admin)
- `POST /api/teams/:id/players` - Add player to team
- `DELETE /api/teams/:id/players/:playerId` - Remove player from team

### Games
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get game by ID
- `POST /api/games` - Create game (admin)
- `PUT /api/games/:id` - Update game (admin)
- `DELETE /api/games/:id` - Delete game (admin)

### Registrations
- `GET /api/registrations` - Get all registrations (admin)
- `GET /api/registrations/:id` - Get registration by ID
- `POST /api/registrations` - Create registration (protected)
- `PUT /api/registrations/:id` - Update registration
- `PUT /api/registrations/:id/payment` - Update payment status (admin)
- `DELETE /api/registrations/:id` - Delete registration (admin)

## Usage Guide

### For Players

1. **Register**: Create an account at `/register`
2. **Complete Profile**: Add personal information and emergency contacts
3. **Register for League**: Choose a league and complete registration form
4. **View Schedule**: Check upcoming games and team information
5. **Track Progress**: View team standings and game results

### For Coaches

1. **Register**: Create an account with "Coach" role
2. **Create Team**: Set up your team in the admin panel
3. **Manage Roster**: Add/remove players from your team
4. **View Schedule**: See your team's upcoming games
5. **Update Game Info**: Coordinate with admins for game updates

### For Admins

1. **Login**: Use admin credentials
2. **Create Leagues**: Set up new leagues with divisions and rules
3. **Manage Teams**: Approve team registrations and assignments
4. **Schedule Games**: Create game schedules for leagues
5. **Process Registrations**: Review and approve player registrations
6. **Update Scores**: Record game results and standings

## Default Admin Account

For initial setup, you'll need to create an admin account directly in the database or use the registration endpoint with role set to "admin".

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/coptic-league
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts server with nodemon (auto-reload)
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server with HMR
```

### Build for Production

#### Backend
```bash
cd backend
npm start  # Runs production server
```

#### Frontend
```bash
cd frontend
npm run build  # Creates optimized production build in dist/
npm run preview  # Preview production build
```

## Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email/SMS notifications
- [ ] Mobile app (React Native)
- [ ] Live score updates
- [ ] Statistics tracking and analytics
- [ ] Photo gallery and document uploads
- [ ] Social features (comments, likes)
- [ ] Advanced reporting and exports
- [ ] Multi-sport support
- [ ] Tournament bracket system
- [ ] Referee assignment system
- [ ] Facility booking system

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens expire after 30 days
- Protected routes require authentication
- Role-based access control for sensitive operations
- Input validation on all forms
- SQL injection protection via Mongoose
- CORS configuration for API security

## Contributing

This is a custom project for The Coptic League. For contributions or modifications:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit for review

## License

This project is proprietary software developed for The Coptic League.

## Support

For issues or questions, please contact the development team or create an issue in the project repository.

---

Built with ❤️ for The Coptic League Community
