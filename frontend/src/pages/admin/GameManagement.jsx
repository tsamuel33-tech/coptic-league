const GameManagement = () => {
  return (
    <div>
      <h1>Game Scheduling</h1>
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="card-title">Import Schedule from Excel</h2>
        <p>You can bulk import your game schedule using the backend script.</p>
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
          <p><strong>Steps:</strong></p>
          <ol style={{ marginLeft: '1.5rem', marginTop: '0.5rem', lineHeight: '1.8' }}>
            <li>Prepare your Excel file with columns: Date, Time, Home Team, Away Team, Venue, League</li>
            <li>Make sure all teams exist in the database first</li>
            <li>Run: <code style={{ background: 'var(--bg-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>npm run import:schedule your-file.xlsx</code></li>
          </ol>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            See backend/scripts/README.md for detailed instructions
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="card-title">Manual Game Creation</h2>
        <p>Web-based game scheduling interface coming soon!</p>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
          For now, use the Excel import method above or create games through the API.
        </p>
      </div>
    </div>
  );
};

export default GameManagement;
