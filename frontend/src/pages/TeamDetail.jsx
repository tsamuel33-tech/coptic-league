import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { teamAPI } from '../utils/api';

const TeamDetail = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, [id]);

  const fetchTeam = async () => {
    try {
      const response = await teamAPI.getOne(id);
      setTeam(response.data);
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading team details...</div>;
  if (!team) return <div className="card">Team not found</div>;

  return (
    <div>
      <h1>{team.name}</h1>

      <div className="grid grid-2" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h2 className="card-title">Team Information</h2>
          {team.league && <p><strong>League:</strong> {team.league.name}</p>}
          {team.league && <p><strong>Division:</strong> {team.league.division}</p>}
          <p><strong>Record:</strong> {team.wins}-{team.losses}</p>
          {team.homeVenue && <p><strong>Home Venue:</strong> {team.homeVenue}</p>}
        </div>

        <div className="card">
          <h2 className="card-title">Coaching Staff</h2>
          {team.coach && (
            <p><strong>Head Coach:</strong> {team.coach.firstName} {team.coach.lastName}</p>
          )}
          {team.assistantCoaches && team.assistantCoaches.length > 0 && (
            <>
              <p><strong>Assistant Coaches:</strong></p>
              <ul>
                {team.assistantCoaches.map((coach) => (
                  <li key={coach._id}>{coach.firstName} {coach.lastName}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {team.players && team.players.length > 0 && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2 className="card-title">Roster ({team.players.length}/{team.maxPlayers})</h2>
          <table className="table" style={{ marginTop: '1rem' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Position</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {team.players.map((player) => (
                <tr key={player._id}>
                  <td>{player.jerseyNumber || '-'}</td>
                  <td>{player.player?.firstName} {player.player?.lastName}</td>
                  <td>{player.position || '-'}</td>
                  <td>
                    <span className={\`badge badge-\${player.status === 'active' ? 'success' : 'warning'}\`}>
                      {player.status}
                    </span>
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

export default TeamDetail;
