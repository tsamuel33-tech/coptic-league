import { useState, useEffect } from 'react';
import { gameAPI, teamAPI, leagueAPI } from '../../utils/api';

const GameManagement = () => {
  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [scoringGame, setScoringGame] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    league: '',
    homeTeam: '',
    awayTeam: '',
    scheduledDate: '',
    scheduledTime: '',
    venue: '',
    status: 'scheduled'
  });

  const [scoreData, setScoreData] = useState({
    homeScore: '',
    awayScore: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gamesRes, teamsRes, leaguesRes] = await Promise.all([
        gameAPI.getAll(),
        teamAPI.getAll(),
        leagueAPI.getAll()
      ]);
      setGames(gamesRes.data);
      setTeams(teamsRes.data);
      setLeagues(leaguesRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleScoreChange = (e) => {
    setScoreData({
      ...scoreData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.homeTeam === formData.awayTeam) {
      setError('Home and away teams must be different');
      return;
    }

    try {
      if (editingGame) {
        await gameAPI.update(editingGame._id, formData);
        setSuccess('Game updated successfully!');
      } else {
        await gameAPI.create(formData);
        setSuccess('Game created successfully!');
      }

      resetForm();
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save game');
    }
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await gameAPI.update(scoringGame._id, {
        homeScore: parseInt(scoreData.homeScore),
        awayScore: parseInt(scoreData.awayScore),
        status: 'completed'
      });
      setSuccess('Score updated! Team records have been updated.');
      setShowScoreModal(false);
      setScoringGame(null);
      setScoreData({ homeScore: '', awayScore: '' });
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update score');
    }
  };

  const handleEdit = (game) => {
    setEditingGame(game);
    setFormData({
      league: game.league?._id || '',
      homeTeam: game.homeTeam?._id || '',
      awayTeam: game.awayTeam?._id || '',
      scheduledDate: game.scheduledDate?.split('T')[0] || '',
      scheduledTime: game.scheduledTime || '',
      venue: game.venue || '',
      status: game.status || 'scheduled'
    });
    setShowForm(true);
  };

  const handleEnterScore = (game) => {
    setScoringGame(game);
    setScoreData({
      homeScore: game.homeScore || '',
      awayScore: game.awayScore || ''
    });
    setShowScoreModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;

    try {
      await gameAPI.delete(id);
      setSuccess('Game deleted successfully!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete game');
    }
  };

  const resetForm = () => {
    setFormData({
      league: '',
      homeTeam: '',
      awayTeam: '',
      scheduledDate: '',
      scheduledTime: '',
      venue: '',
      status: 'scheduled'
    });
    setEditingGame(null);
    setShowForm(false);
  };

  const getTeamsForLeague = () => {
    if (!formData.league) return teams;
    return teams.filter(team => team.league?._id === formData.league);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Game Scheduling</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Schedule New Game'}
        </button>
      </div>

      {error && <div className="error-message" style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--danger-color)', color: 'white', borderRadius: '8px' }}>{error}</div>}
      {success && <div className="success-message" style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--success-color)', color: 'white', borderRadius: '8px' }}>{success}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 className="card-title">{editingGame ? 'Edit Game' : 'Schedule New Game'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">League *</label>
                <select
                  name="league"
                  className="form-select"
                  value={formData.league}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select League</option>
                  {leagues.map(league => (
                    <option key={league._id} value={league._id}>
                      {league.name} - {league.season}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status *</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="postponed">Postponed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Home Team *</label>
                <select
                  name="homeTeam"
                  className="form-select"
                  value={formData.homeTeam}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.league}
                >
                  <option value="">Select Home Team</option>
                  {getTeamsForLeague().map(team => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Away Team *</label>
                <select
                  name="awayTeam"
                  className="form-select"
                  value={formData.awayTeam}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.league}
                >
                  <option value="">Select Away Team</option>
                  {getTeamsForLeague().filter(team => team._id !== formData.homeTeam).map(team => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  name="scheduledDate"
                  className="form-input"
                  value={formData.scheduledDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time *</label>
                <input
                  type="time"
                  name="scheduledTime"
                  className="form-input"
                  value={formData.scheduledTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Venue *</label>
                <input
                  type="text"
                  name="venue"
                  className="form-input"
                  value={formData.venue}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Main Court, Gym 1"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary">
                {editingGame ? 'Update Game' : 'Schedule Game'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showScoreModal && scoringGame && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ minWidth: '500px', maxWidth: '600px' }}>
            <h2 className="card-title">Enter Final Score</h2>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
              {scoringGame.homeTeam?.name} vs {scoringGame.awayTeam?.name}
            </p>

            <form onSubmit={handleScoreSubmit}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">{scoringGame.homeTeam?.name} Score *</label>
                  <input
                    type="number"
                    name="homeScore"
                    className="form-input"
                    value={scoreData.homeScore}
                    onChange={handleScoreChange}
                    required
                    min="0"
                    placeholder="0"
                    style={{ fontSize: '1.5rem', textAlign: 'center' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{scoringGame.awayTeam?.name} Score *</label>
                  <input
                    type="number"
                    name="awayScore"
                    className="form-input"
                    value={scoreData.awayScore}
                    onChange={handleScoreChange}
                    required
                    min="0"
                    placeholder="0"
                    style={{ fontSize: '1.5rem', textAlign: 'center' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  ⚠️ <strong>Note:</strong> Entering the score will automatically update team records (wins/losses).
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary">
                  Save Score
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowScoreModal(false);
                    setScoringGame(null);
                    setScoreData({ homeScore: '', awayScore: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">All Games ({games.length})</h2>

        {games.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
            No games scheduled yet. Click "Schedule New Game" to get started.
          </p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>League</th>
                  <th>Home Team</th>
                  <th>Away Team</th>
                  <th>Score</th>
                  <th>Venue</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <tr key={game._id}>
                    <td>{new Date(game.scheduledDate).toLocaleDateString()}</td>
                    <td>{game.scheduledTime}</td>
                    <td>{game.league?.name}</td>
                    <td><strong>{game.homeTeam?.name}</strong></td>
                    <td><strong>{game.awayTeam?.name}</strong></td>
                    <td>
                      {game.status === 'completed' ? (
                        <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                          {game.homeScore} - {game.awayScore}
                        </span>
                      ) : '-'}
                    </td>
                    <td>{game.venue}</td>
                    <td>
                      <span className={`badge badge-${
                        game.status === 'completed' ? 'success' :
                        game.status === 'in-progress' ? 'warning' :
                        game.status === 'cancelled' ? 'danger' :
                        'primary'
                      }`}>
                        {game.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {game.status !== 'completed' && (
                          <button
                            className="btn btn-success"
                            style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                            onClick={() => handleEnterScore(game)}
                          >
                            Enter Score
                          </button>
                        )}
                        {game.status === 'completed' && (
                          <button
                            className="btn btn-warning"
                            style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                            onClick={() => handleEnterScore(game)}
                          >
                            Edit Score
                          </button>
                        )}
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                          onClick={() => handleEdit(game)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                          onClick={() => handleDelete(game._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '2rem', background: 'var(--bg-secondary)' }}>
        <h2 className="card-title">💡 Bulk Import</h2>
        <p>You can bulk import your game schedule using Excel!</p>
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
          <p><strong>Steps:</strong></p>
          <ol style={{ marginLeft: '1.5rem', marginTop: '0.5rem', lineHeight: '1.8' }}>
            <li>Prepare your Excel file with columns: Date, Time, Home Team, Away Team, Venue, League</li>
            <li>Make sure all teams exist in the database first</li>
            <li>Run: <code style={{ background: 'var(--bg-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>npm run import:schedule your-file.xlsx</code></li>
          </ol>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            See backend/scripts/README.md for detailed instructions
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameManagement;
