import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          The Coptic League
        </Link>

        <ul className="navbar-menu">
          <li><Link to="/leagues">Leagues</Link></li>
          <li><Link to="/teams">Teams</Link></li>
          <li><Link to="/schedule">Schedule</Link></li>

          {isAuthenticated ? (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              {user?.role === 'admin' && (
                <li><Link to="/admin">Admin</Link></li>
              )}
              <li><Link to="/profile">{user?.firstName}</Link></li>
              <li>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="btn btn-primary">Login</Link></li>
              <li><Link to="/register" className="btn btn-secondary">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
