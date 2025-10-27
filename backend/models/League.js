import mongoose from 'mongoose';

const leagueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  division: {
    type: String,
    required: true,
    enum: [
      'High School Boys',
      'High School Girls',
      'Junior High',
      'Mens',
      'Womens',
      'Geezers (35+)'
    ]
  },
  season: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  maxTeams: {
    type: Number,
    default: 12
  },
  registrationFee: {
    type: Number,
    required: true
  },
  rules: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'open', 'in-progress', 'completed'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const League = mongoose.model('League', leagueSchema);

export default League;
