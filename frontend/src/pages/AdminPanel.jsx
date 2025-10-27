import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminPanel = () => {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return (
      <div className="card">
        <h1>Access Denied</h1>
        <p>You do not have permission to access the admin panel.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Welcome, {user?.firstName}! Manage your Coptic League from here.
      </p>

      <div className="grid grid-2" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h2 className="card-title">🏆 Manage Leagues</h2>
          <p>Create, edit, and manage leagues and divisions</p>
          <Link to="/admin/leagues" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Manage Leagues
          </Link>
        </div>

        <div className="card">
          <h2 className="card-title">👥 Manage Teams</h2>
          <p>Create teams and assign players</p>
          <Link to="/admin/teams" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Manage Teams
          </Link>
        </div>

        <div className="card">
          <h2 className="card-title">📅 Schedule Games</h2>
          <p>Create and update game schedules</p>
          <Link to="/admin/games" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Schedule Games
          </Link>
        </div>

        <div className="card">
          <h2 className="card-title">📋 View Registrations</h2>
          <p>Review and approve league registrations</p>
          <Link to="/admin/registrations" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            View Registrations
          </Link>
        </div>

        <div className="card">
          <h2 className="card-title">📊 Reports & Data Export</h2>
          <p>Download registration data and view analytics</p>
          <Link to="/admin/reports" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            View Reports
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem', background: 'var(--bg-secondary)' }}>
        <h2 className="card-title">💡 Quick Tips</h2>
        <ul style={{ marginTop: '1rem', marginLeft: '1.5rem', lineHeight: '1.8' }}>
          <li>Create leagues first before teams can register</li>
          <li>Teams must be created before scheduling games</li>
          <li>You can import schedules from Excel (see backend/scripts/README.md)</li>
          <li>Monitor registrations to track league participation</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
