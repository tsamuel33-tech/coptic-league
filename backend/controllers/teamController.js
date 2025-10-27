import Team from '../models/Team.js';
import User from '../models/User.js';
import League from '../models/League.js';

// @desc    Get all teams
// @route   GET /api/teams
// @access  Public
export const getTeams = async (req, res) => {
  try {
    const { league } = req.query;
    const filter = league ? { league } : {};

    const teams = await Team.find(filter)
      .populate('coach', 'firstName lastName email')
      .populate('assistantCoaches', 'firstName lastName email')
      .populate('players.player', 'firstName lastName email playerProfile')
      .populate('league', 'name division season');

    res.json(teams);
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Public
export const getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('coach', 'firstName lastName email phone')
      .populate('assistantCoaches', 'firstName lastName email phone')
      .populate('players.player', 'firstName lastName email playerProfile')
      .populate('league', 'name division season');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new team
// @route   POST /api/teams
// @access  Private (Coach, Admin)
export const createTeam = async (req, res) => {
  try {
    const { name, league, coach, homeVenue, colors, maxPlayers } = req.body;

    // Verify league exists
    const leagueExists = await League.findById(league);
    if (!leagueExists) {
      return res.status(404).json({ message: 'League not found' });
    }

    // Verify coach exists
    const coachExists = await User.findById(coach);
    if (!coachExists) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    const team = await Team.create({
      name,
      league,
      coach,
      homeVenue,
      colors,
      maxPlayers
    });

    const populatedTeam = await Team.findById(team._id)
      .populate('coach', 'firstName lastName email')
      .populate('league', 'name division season');

    res.status(201).json(populatedTeam);
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private (Coach, Admin)
export const updateTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        team[key] = req.body[key];
      }
    });

    await team.save();

    const updatedTeam = await Team.findById(team._id)
      .populate('coach', 'firstName lastName email')
      .populate('assistantCoaches', 'firstName lastName email')
      .populate('players.player', 'firstName lastName email playerProfile')
      .populate('league', 'name division season');

    res.json(updatedTeam);
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add player to team
// @route   POST /api/teams/:id/players
// @access  Private (Coach, Admin)
export const addPlayerToTeam = async (req, res) => {
  try {
    const { playerId, jerseyNumber, position } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if player exists
    const player = await User.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Check if team is full
    if (team.players.length >= team.maxPlayers) {
      return res.status(400).json({ message: 'Team is full' });
    }

    // Check if player already on team
    const playerExists = team.players.find(p => p.player.toString() === playerId);
    if (playerExists) {
      return res.status(400).json({ message: 'Player already on this team' });
    }

    team.players.push({
      player: playerId,
      jerseyNumber,
      position,
      status: 'active'
    });

    await team.save();

    const updatedTeam = await Team.findById(team._id)
      .populate('players.player', 'firstName lastName email playerProfile');

    res.json(updatedTeam);
  } catch (error) {
    console.error('Add player error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove player from team
// @route   DELETE /api/teams/:id/players/:playerId
// @access  Private (Coach, Admin)
export const removePlayerFromTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    team.players = team.players.filter(
      p => p.player.toString() !== req.params.playerId
    );

    await team.save();

    res.json({ message: 'Player removed from team' });
  } catch (error) {
    console.error('Remove player error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private (Admin)
export const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    await team.deleteOne();
    res.json({ message: 'Team removed' });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
