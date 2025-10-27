import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: true
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assistantCoaches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  players: [{
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    jerseyNumber: Number,
    position: String,
    status: {
      type: String,
      enum: ['active', 'injured', 'suspended', 'inactive'],
      default: 'active'
    }
  }],
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  logo: {
    type: String,
    default: ''
  },
  colors: {
    primary: String,
    secondary: String
  },
  homeVenue: {
    type: String,
    trim: true
  },
  maxPlayers: {
    type: Number,
    default: 15
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for win percentage
teamSchema.virtual('winPercentage').get(function() {
  const totalGames = this.wins + this.losses;
  return totalGames > 0 ? (this.wins / totalGames * 100).toFixed(1) : 0;
});

const Team = mongoose.model('Team', teamSchema);

export default Team;
