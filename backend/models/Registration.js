import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  registrationType: {
    type: String,
    enum: ['player', 'coach', 'volunteer'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  amountDue: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'cash', 'check', 'online'],
    default: 'online'
  },
  transactionId: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['submitted', 'approved', 'rejected', 'waitlist'],
    default: 'submitted'
  },
  emergencyWaiver: {
    signed: { type: Boolean, default: false },
    signedDate: Date,
    signerName: String
  },
  medicalInfo: {
    allergies: String,
    medications: String,
    conditions: String,
    insuranceProvider: String,
    policyNumber: String
  },
  shirtSize: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient querying
registrationSchema.index({ user: 1, league: 1 });
registrationSchema.index({ league: 1, status: 1 });

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
