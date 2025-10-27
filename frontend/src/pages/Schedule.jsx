import { useState, useEffect } from 'react';
import { gameAPI } from '../utils/api';
import { format } from 'date-fns';

const Schedule = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await gameAPI.getAll();
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading schedule...</div>;

  return (
    <div>
      <h1>Game Schedule</h1>

      {games.length === 0 ? (
        <div className="card">
          <p>No games scheduled at this time.</p>
        </div>
      ) : (
        <div className="card" style={{ marginTop: '2rem' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Home Team</th>
                <th>Away Team</th>
                <th>Venue</th>
                <th>Status</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game._id}>
                  <td>{format(new Date(game.scheduledDate), 'MMM dd, yyyy')}</td>
                  <td>{game.scheduledTime}</td>
                  <td>{game.homeTeam?.name || 'TBD'}</td>
                  <td>{game.awayTeam?.name || 'TBD'}</td>
                  <td>{game.venue}</td>
                  <td>
                    <span className={`badge badge-${game.status === 'completed' ? 'success' : game.status === 'in-progress' ? 'warning' : 'primary'}`}>
                      {game.status}
                    </span>
                  </td>
                  <td>
                    {game.status === 'completed' || game.status === 'in-progress'
                      ? `${game.homeScore} - ${game.awayScore}`
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Schedule;
