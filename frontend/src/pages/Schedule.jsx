import { useState, useEffect } from 'react';
import { gameAPI, teamAPI, leagueAPI } from '../utils/api';
import { format } from 'date-fns';

const Schedule = () => {
  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showStandings, setShowStandings] = useState(true);

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
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredGames = () => {
    if (selectedLeague === 'all') return games;
    return games.filter(game => game.league?._id === selectedLeague);
  };

  const getFilteredTeams = () => {
    if (selectedLeague === 'all') return teams;
    return teams.filter(team => team.league?._id === selectedLeague);
  };

  const calculateStandings = () => {
    const filteredTeams = getFilteredTeams();

    // Sort by wins (descending), then by losses (ascending), then by name
    return [...filteredTeams].sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (a.losses !== b.losses) return a.losses - b.losses;
      return (a.name || '').localeCompare(b.name || '');
    });
  };

  const filteredGames = getFilteredGames();
  const standings = calculateStandings();

  if (loading) return <div className="loading">Loading schedule...</div>;

  return (
    <div>
      <h1>Schedule & Standings</h1>

      {/* League Filter */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontWeight: '600' }}>Filter by League:</label>
          <select
            className="form-select"
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
            style={{ maxWidth: '300px' }}
          >
            <option value="all">All Leagues</option>
            {leagues.map(league => (
              <option key={league._id} value={league._id}>
                {league.name} - {league.season}
              </option>
            ))}
          </select>

          <button
            className="btn btn-secondary"
            style={{ marginLeft: 'auto', padding: '0.5rem 1rem' }}
            onClick={() => setShowStandings(!showStandings)}
          >
            {showStandings ? 'Hide' : 'Show'} Standings
          </button>
        </div>
      </div>

      {/* Standings */}
      {showStandings && standings.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 className="card-title">
            🏆 Standings
            {selectedLeague !== 'all' && ` - ${leagues.find(l => l._id === selectedLeague)?.name}`}
          </h2>
          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>#</th>
                  <th>Team</th>
                  <th style={{ textAlign: 'center' }}>W</th>
                  <th style={{ textAlign: 'center' }}>L</th>
                  <th style={{ textAlign: 'center' }}>Win %</th>
                  <th style={{ textAlign: 'center' }}>Games</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team, index) => {
                  const totalGames = team.wins + team.losses;
                  const winPercentage = totalGames > 0 ? ((team.wins / totalGames) * 100).toFixed(1) : '0.0';

                  return (
                    <tr key={team._id} style={index < 3 ? { background: 'var(--bg-secondary)' } : {}}>
                      <td style={{ textAlign: 'center', fontWeight: '700', fontSize: '1.1rem' }}>
                        {index + 1}
                        {index === 0 && ' 🥇'}
                        {index === 1 && ' 🥈'}
                        {index === 2 && ' 🥉'}
                      </td>
                      <td>
                        <strong style={{ fontSize: '1.05rem' }}>{team.name}</strong>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '700', color: 'var(--success-color)', fontSize: '1.1rem' }}>
                        {team.wins || 0}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '700', color: 'var(--danger-color)', fontSize: '1.1rem' }}>
                        {team.losses || 0}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '600' }}>
                        {winPercentage}%
                      </td>
                      <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                        {totalGames}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Games Schedule */}
      <div className="card">
        <h2 className="card-title">
          📅 Game Schedule ({filteredGames.length} games)
        </h2>

        {filteredGames.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
            No games scheduled at this time.
          </p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Home Team</th>
                  <th>Record</th>
                  <th>Away Team</th>
                  <th>Record</th>
                  <th>Score</th>
                  <th>Venue</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredGames.map((game) => (
                  <tr key={game._id}>
                    <td>{format(new Date(game.scheduledDate), 'MMM dd, yyyy')}</td>
                    <td>{game.scheduledTime}</td>
                    <td>
                      <strong>{game.homeTeam?.name || 'TBD'}</strong>
                    </td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {game.homeTeam ? `${game.homeTeam.wins || 0}-${game.homeTeam.losses || 0}` : '-'}
                    </td>
                    <td>
                      <strong>{game.awayTeam?.name || 'TBD'}</strong>
                    </td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {game.awayTeam ? `${game.awayTeam.wins || 0}-${game.awayTeam.losses || 0}` : '-'}
                    </td>
                    <td>
                      {game.status === 'completed' ? (
                        <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                          {game.homeScore} - {game.awayScore}
                        </span>
                      ) : game.status === 'in-progress' ? (
                        <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--warning-color)' }}>
                          {game.homeScore} - {game.awayScore}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)' }}>-</span>
                      )}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
