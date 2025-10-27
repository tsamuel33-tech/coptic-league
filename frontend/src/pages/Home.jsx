import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to The Coptic League</h1>
          <p className="hero-subtitle">
            Premier basketball league management for all ages and skill levels
          </p>
          <div className="hero-buttons">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  Go to Dashboard
                </Link>
                <Link to="/leagues" className="btn btn-secondary btn-large">
                  View Leagues
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-large">
                  Register Now
                </Link>
                <Link to="/leagues" className="btn btn-secondary btn-large">
                  Browse Leagues
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="grid grid-3">
          <div className="feature-card">
            <h3>Multiple Divisions</h3>
            <p>
              Leagues for High School Boys/Girls, Junior High, Men's, Women's, and 35+ divisions
            </p>
          </div>
          <div className="feature-card">
            <h3>Easy Registration</h3>
            <p>
              Online registration with secure payment processing and team assignment
            </p>
          </div>
          <div className="feature-card">
            <h3>Live Schedules</h3>
            <p>
              View game schedules, team standings, and get real-time updates
            </p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Join?</h2>
        <p>Sign up today and be part of our basketball community</p>
        {!isAuthenticated && (
          <Link to="/register" className="btn btn-primary btn-large">
            Create Account
          </Link>
        )}
      </section>
    </div>
  );
};

export default Home;
