import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: true
  },
  homeTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  awayTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  venueAddress: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'postponed', 'cancelled'],
    default: 'scheduled'
  },
  homeScore: {
    type: Number,
    default: 0
  },
  awayScore: {
    type: Number,
    default: 0
  },
  quarter: {
    type: Number,
    default: 1
  },
  notes: {
    type: String,
    default: ''
  },
  officials: [{
    name: String,
    role: {
      type: String,
      enum: ['referee', 'umpire', 'scorekeeper', 'timekeeper']
    }
  }],
  attendance: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
gameSchema.index({ league: 1, scheduledDate: 1 });
gameSchema.index({ homeTeam: 1 });
gameSchema.index({ awayTeam: 1 });

const Game = mongoose.model('Game', gameSchema);

export default Game;
