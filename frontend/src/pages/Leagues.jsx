import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leagueAPI } from '../utils/api';

const Leagues = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      const response = await leagueAPI.getAll();
      setLeagues(response.data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading leagues...</div>;

  return (
    <div>
      <h1>Leagues</h1>

      {leagues.length === 0 ? (
        <div className="card">
          <p>No leagues available at this time.</p>
        </div>
      ) : (
        <div className="grid grid-3" style={{ marginTop: '2rem' }}>
          {leagues.map((league) => (
            <div key={league._id} className="card">
              <h3>{league.name}</h3>
              <p><strong>Division:</strong> {league.division}</p>
              <p><strong>Season:</strong> {league.season}</p>
              <p><strong>Status:</strong> <span className={\`badge badge-\${league.status === 'open' ? 'success' : 'primary'}\`}>
                {league.status}
              </span></p>
              <Link to={\`/leagues/\${league._id}\`} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leagues;
