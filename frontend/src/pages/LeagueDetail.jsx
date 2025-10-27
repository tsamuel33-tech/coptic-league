import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { leagueAPI } from '../utils/api';
import { format } from 'date-fns';

const LeagueDetail = () => {
  const { id } = useParams();
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeague();
  }, [id]);

  const fetchLeague = async () => {
    try {
      const response = await leagueAPI.getOne(id);
      setLeague(response.data);
    } catch (error) {
      console.error('Error fetching league:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading league details...</div>;
  if (!league) return <div className="card">League not found</div>;

  return (
    <div>
      <h1>{league.name}</h1>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="card-title">League Information</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <p><strong>Division:</strong> {league.division}</p>
          <p><strong>Season:</strong> {league.season}</p>
          <p><strong>Start Date:</strong> {format(new Date(league.startDate), 'MMM dd, yyyy')}</p>
          <p><strong>End Date:</strong> {format(new Date(league.endDate), 'MMM dd, yyyy')}</p>
          <p><strong>Registration Deadline:</strong> {format(new Date(league.registrationDeadline), 'MMM dd, yyyy')}</p>
          <p><strong>Registration Fee:</strong> ${league.registrationFee}</p>
          <p><strong>Max Teams:</strong> {league.maxTeams}</p>
          <p><strong>Status:</strong> <span className={\`badge badge-\${league.status === 'open' ? 'success' : 'primary'}\`}>
            {league.status}
          </span></p>
        </div>
      </div>

      {league.teams && league.teams.length > 0 && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2 className="card-title">Teams ({league.teams.length})</h2>
          <div className="grid grid-3" style={{ marginTop: '1rem' }}>
            {league.teams.map((team) => (
              <div key={team._id} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                <h3>{team.name}</h3>
                <p>Record: {team.wins}-{team.losses}</p>
                <Link to={\`/teams/\${team._id}\`} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  View Team
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {league.status === 'open' && (
        <Link to="/registration" className="btn btn-success btn-large" style={{ marginTop: '2rem' }}>
          Register for this League
        </Link>
      )}
    </div>
  );
};

export default LeagueDetail;
