import League from '../models/League.js';
import Team from '../models/Team.js';

// @desc    Get all leagues
// @route   GET /api/leagues
// @access  Public
export const getLeagues = async (req, res) => {
  try {
    const { division, season, status } = req.query;
    const filter = {};

    if (division) filter.division = division;
    if (season) filter.season = season;
    if (status) filter.status = status;

    const leagues = await League.find(filter).sort({ startDate: -1 });
    res.json(leagues);
  } catch (error) {
    console.error('Get leagues error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single league
// @route   GET /api/leagues/:id
// @access  Public
export const getLeague = async (req, res) => {
  try {
    const league = await League.findById(req.params.id);

    if (!league) {
      return res.status(404).json({ message: 'League not found' });
    }

    // Get teams in this league
    const teams = await Team.find({ league: league._id })
      .populate('coach', 'firstName lastName')
      .select('name wins losses players');

    res.json({
      ...league.toObject(),
      teams
    });
  } catch (error) {
    console.error('Get league error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new league
// @route   POST /api/leagues
// @access  Private (Admin)
export const createLeague = async (req, res) => {
  try {
    const {
      name,
      division,
      season,
      startDate,
      endDate,
      registrationDeadline,
      maxTeams,
      registrationFee,
      rules
    } = req.body;

    const league = await League.create({
      name,
      division,
      season,
      startDate,
      endDate,
      registrationDeadline,
      maxTeams,
      registrationFee,
      rules
    });

    res.status(201).json(league);
  } catch (error) {
    console.error('Create league error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update league
// @route   PUT /api/leagues/:id
// @access  Private (Admin)
export const updateLeague = async (req, res) => {
  try {
    const league = await League.findById(req.params.id);

    if (!league) {
      return res.status(404).json({ message: 'League not found' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        league[key] = req.body[key];
      }
    });

    await league.save();
    res.json(league);
  } catch (error) {
    console.error('Update league error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete league
// @route   DELETE /api/leagues/:id
// @access  Private (Admin)
export const deleteLeague = async (req, res) => {
  try {
    const league = await League.findById(req.params.id);

    if (!league) {
      return res.status(404).json({ message: 'League not found' });
    }

    await league.deleteOne();
    res.json({ message: 'League removed' });
  } catch (error) {
    console.error('Delete league error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get league standings
// @route   GET /api/leagues/:id/standings
// @access  Public
export const getLeagueStandings = async (req, res) => {
  try {
    const teams = await Team.find({ league: req.params.id })
      .populate('coach', 'firstName lastName')
      .select('name wins losses players')
      .sort({ wins: -1, losses: 1 });

    const standings = teams.map((team, index) => ({
      rank: index + 1,
      team: team.name,
      wins: team.wins,
      losses: team.losses,
      winPercentage: team.winPercentage,
      gamesPlayed: team.wins + team.losses
    }));

    res.json(standings);
  } catch (error) {
    console.error('Get standings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
