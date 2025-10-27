import Registration from '../models/Registration.js';
import League from '../models/League.js';

// @desc    Get all registrations
// @route   GET /api/registrations
// @access  Private (Admin)
export const getRegistrations = async (req, res) => {
  try {
    const { league, status, user } = req.query;
    const filter = {};

    if (league) filter.league = league;
    if (status) filter.status = status;
    if (user) filter.user = user;

    const registrations = await Registration.find(filter)
      .populate('user', 'firstName lastName email phone')
      .populate('league', 'name division season')
      .populate('team', 'name')
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single registration
// @route   GET /api/registrations/:id
// @access  Private
export const getRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('league', 'name division season registrationFee')
      .populate('team', 'name coach');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if user owns this registration or is admin
    if (registration.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this registration' });
    }

    res.json(registration);
  } catch (error) {
    console.error('Get registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new registration
// @route   POST /api/registrations
// @access  Private
export const createRegistration = async (req, res) => {
  try {
    const {
      league,
      registrationType,
      shirtSize,
      emergencyWaiver,
      medicalInfo,
      notes
    } = req.body;

    // Verify league exists
    const leagueDoc = await League.findById(league);
    if (!leagueDoc) {
      return res.status(404).json({ message: 'League not found' });
    }

    // Check if registration deadline has passed
    if (new Date() > new Date(leagueDoc.registrationDeadline)) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }

    // Check if user already registered
    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      league
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this league' });
    }

    const registration = await Registration.create({
      user: req.user._id,
      league,
      registrationType,
      amountDue: leagueDoc.registrationFee,
      shirtSize,
      emergencyWaiver,
      medicalInfo,
      notes
    });

    const populatedRegistration = await Registration.findById(registration._id)
      .populate('user', 'firstName lastName email')
      .populate('league', 'name division season');

    res.status(201).json(populatedRegistration);
  } catch (error) {
    console.error('Create registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update registration
// @route   PUT /api/registrations/:id
// @access  Private
export const updateRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check authorization
    if (registration.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this registration' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        registration[key] = req.body[key];
      }
    });

    await registration.save();

    const updatedRegistration = await Registration.findById(registration._id)
      .populate('user', 'firstName lastName email')
      .populate('league', 'name division season')
      .populate('team', 'name');

    res.json(updatedRegistration);
  } catch (error) {
    console.error('Update registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update payment status
// @route   PUT /api/registrations/:id/payment
// @access  Private (Admin)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { amountPaid, paymentMethod, transactionId, paymentStatus } = req.body;
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (amountPaid !== undefined) registration.amountPaid = amountPaid;
    if (paymentMethod) registration.paymentMethod = paymentMethod;
    if (transactionId) registration.transactionId = transactionId;
    if (paymentStatus) registration.paymentStatus = paymentStatus;

    await registration.save();

    res.json(registration);
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete registration
// @route   DELETE /api/registrations/:id
// @access  Private (Admin)
export const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    await registration.deleteOne();
    res.json({ message: 'Registration removed' });
  } catch (error) {
    console.error('Delete registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
