import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>

      <div className="grid grid-2" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h2 className="card-title">My Profile</h2>
          <p>View and edit your personal information</p>
          <Link to="/profile" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            View Profile
          </Link>
        </div>

        <div className="card">
          <h2 className="card-title">Register for League</h2>
          <p>Sign up for upcoming leagues and tournaments</p>
          <Link to="/registration" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Register Now
          </Link>
        </div>

        <div className="card">
          <h2 className="card-title">View Schedule</h2>
          <p>Check game schedules and team standings</p>
          <Link to="/schedule" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            View Schedule
          </Link>
        </div>

        <div className="card">
          <h2 className="card-title">Browse Teams</h2>
          <p>Explore all teams in the league</p>
          <Link to="/teams" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            View Teams
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
