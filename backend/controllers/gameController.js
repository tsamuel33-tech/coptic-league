import Game from '../models/Game.js';
import Team from '../models/Team.js';

// @desc    Get all games
// @route   GET /api/games
// @access  Public
export const getGames = async (req, res) => {
  try {
    const { league, team, status, startDate, endDate } = req.query;
    const filter = {};

    if (league) filter.league = league;
    if (status) filter.status = status;
    if (team) {
      filter.$or = [{ homeTeam: team }, { awayTeam: team }];
    }
    if (startDate || endDate) {
      filter.scheduledDate = {};
      if (startDate) filter.scheduledDate.$gte = new Date(startDate);
      if (endDate) filter.scheduledDate.$lte = new Date(endDate);
    }

    const games = await Game.find(filter)
      .populate('league', 'name division season')
      .populate('homeTeam', 'name logo wins losses')
      .populate('awayTeam', 'name logo wins losses')
      .sort({ scheduledDate: 1 });

    res.json(games);
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single game
// @route   GET /api/games/:id
// @access  Public
export const getGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('league', 'name division season')
      .populate({
        path: 'homeTeam',
        populate: { path: 'coach players.player', select: 'firstName lastName' }
      })
      .populate({
        path: 'awayTeam',
        populate: { path: 'coach players.player', select: 'firstName lastName' }
      });

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new game
// @route   POST /api/games
// @access  Private (Admin)
export const createGame = async (req, res) => {
  try {
    const {
      league,
      homeTeam,
      awayTeam,
      scheduledDate,
      scheduledTime,
      venue,
      venueAddress
    } = req.body;

    // Verify teams exist and are in the same league
    const homeTeamDoc = await Team.findById(homeTeam);
    const awayTeamDoc = await Team.findById(awayTeam);

    if (!homeTeamDoc || !awayTeamDoc) {
      return res.status(404).json({ message: 'One or both teams not found' });
    }

    if (homeTeamDoc.league.toString() !== league || awayTeamDoc.league.toString() !== league) {
      return res.status(400).json({ message: 'Teams must be in the same league' });
    }

    if (homeTeam === awayTeam) {
      return res.status(400).json({ message: 'Teams cannot play against themselves' });
    }

    const game = await Game.create({
      league,
      homeTeam,
      awayTeam,
      scheduledDate,
      scheduledTime,
      venue,
      venueAddress
    });

    const populatedGame = await Game.findById(game._id)
      .populate('league', 'name division')
      .populate('homeTeam', 'name logo')
      .populate('awayTeam', 'name logo');

    res.status(201).json(populatedGame);
  } catch (error) {
    console.error('Create game error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update game
// @route   PUT /api/games/:id
// @access  Private (Admin)
export const updateGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const wasCompleted = game.status === 'completed';
    const oldHomeScore = game.homeScore;
    const oldAwayScore = game.awayScore;

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        game[key] = req.body[key];
      }
    });

    await game.save();

    // Update team records if game status changed to completed or scores changed
    const nowCompleted = game.status === 'completed';
    const scoresChanged = (oldHomeScore !== game.homeScore || oldAwayScore !== game.awayScore);

    if (nowCompleted && game.homeScore !== undefined && game.awayScore !== undefined) {
      const homeTeam = await Team.findById(game.homeTeam);
      const awayTeam = await Team.findById(game.awayTeam);

      // If was already completed, reverse old result
      if (wasCompleted && scoresChanged && oldHomeScore !== undefined && oldAwayScore !== undefined) {
        if (oldHomeScore > oldAwayScore) {
          homeTeam.wins = Math.max(0, homeTeam.wins - 1);
          awayTeam.losses = Math.max(0, awayTeam.losses - 1);
        } else if (oldAwayScore > oldHomeScore) {
          awayTeam.wins = Math.max(0, awayTeam.wins - 1);
          homeTeam.losses = Math.max(0, homeTeam.losses - 1);
        }
      }

      // Apply new result
      if (!wasCompleted || scoresChanged) {
        if (game.homeScore > game.awayScore) {
          homeTeam.wins += 1;
          awayTeam.losses += 1;
        } else if (game.awayScore > game.homeScore) {
          awayTeam.wins += 1;
          homeTeam.losses += 1;
        }
      }

      await homeTeam.save();
      await awayTeam.save();
    }

    const updatedGame = await Game.findById(game._id)
      .populate('league', 'name division')
      .populate('homeTeam', 'name logo wins losses')
      .populate('awayTeam', 'name logo wins losses');

    res.json(updatedGame);
  } catch (error) {
    console.error('Update game error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete game
// @route   DELETE /api/games/:id
// @access  Private (Admin)
export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    await game.deleteOne();
    res.json({ message: 'Game removed' });
  } catch (error) {
    console.error('Delete game error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
