import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teamAPI } from '../utils/api';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getAll();
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading teams...</div>;

  return (
    <div>
      <h1>Teams</h1>

      {teams.length === 0 ? (
        <div className="card">
          <p>No teams available at this time.</p>
        </div>
      ) : (
        <div className="grid grid-3" style={{ marginTop: '2rem' }}>
          {teams.map((team) => (
            <div key={team._id} className="card">
              <h3>{team.name}</h3>
              {team.league && <p><strong>League:</strong> {team.league.name}</p>}
              {team.coach && <p><strong>Coach:</strong> {team.coach.firstName} {team.coach.lastName}</p>}
              <p><strong>Record:</strong> {team.wins}-{team.losses}</p>
              <p><strong>Players:</strong> {team.players?.length || 0}/{team.maxPlayers}</p>
              <Link to={\`/teams/\${team._id}\`} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                View Team
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;
