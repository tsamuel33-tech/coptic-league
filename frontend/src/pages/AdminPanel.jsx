const AdminPanel = () => {
  return (
    <div>
      <h1>Admin Panel</h1>

      <div className="grid grid-2" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h2 className="card-title">Manage Leagues</h2>
          <p>Create, edit, and manage leagues and divisions</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Manage Leagues
          </button>
        </div>

        <div className="card">
          <h2 className="card-title">Manage Teams</h2>
          <p>Create teams and assign players</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Manage Teams
          </button>
        </div>

        <div className="card">
          <h2 className="card-title">Schedule Games</h2>
          <p>Create and update game schedules</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Schedule Games
          </button>
        </div>

        <div className="card">
          <h2 className="card-title">View Registrations</h2>
          <p>Review and approve league registrations</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
            View Registrations
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="card-title">Admin Note</h2>
        <p>
          This is a simplified admin panel. Full administrative features would include
          creating/editing leagues, teams, games, managing registrations, payment processing,
          and generating reports.
        </p>
      </div>
    </div>
  );
};

export default AdminPanel;
