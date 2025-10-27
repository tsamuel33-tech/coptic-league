import { useState, useEffect } from 'react';
import { registrationAPI, leagueAPI } from '../../utils/api';

const Reports = () => {
  const [registrations, setRegistrations] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [regRes, leaguesRes] = await Promise.all([
        registrationAPI.getAll(),
        leagueAPI.getAll()
      ]);
      setRegistrations(regRes.data);
      setLeagues(leaguesRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRegistrations = () => {
    if (selectedLeague === 'all') return registrations;
    return registrations.filter(reg => reg.league?._id === selectedLeague);
  };

  const downloadCSV = () => {
    const filtered = getFilteredRegistrations();

    // CSV Headers
    const headers = [
      'Date',
      'League',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Team',
      'Amount',
      'Payment Status'
    ];

    // CSV Rows
    const rows = filtered.map(reg => [
      new Date(reg.createdAt).toLocaleDateString(),
      reg.league?.name || 'N/A',
      reg.user?.firstName || reg.contactInfo?.firstName || '',
      reg.user?.lastName || reg.contactInfo?.lastName || '',
      reg.contactInfo?.email || reg.user?.email || '',
      reg.contactInfo?.phone || reg.user?.phone || '',
      reg.team?.name || 'Individual',
      reg.paymentAmount,
      reg.paymentStatus
    ]);

    // Convert to CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${selectedLeague === 'all' ? 'all' : leagues.find(l => l._id === selectedLeague)?.name || 'export'}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const filtered = getFilteredRegistrations();
    const data = filtered.map(reg => ({
      date: new Date(reg.createdAt).toISOString(),
      league: reg.league?.name || 'N/A',
      firstName: reg.user?.firstName || reg.contactInfo?.firstName || '',
      lastName: reg.user?.lastName || reg.contactInfo?.lastName || '',
      email: reg.contactInfo?.email || reg.user?.email || '',
      phone: reg.contactInfo?.phone || reg.user?.phone || '',
      team: reg.team?.name || 'Individual',
      amount: reg.paymentAmount,
      paymentStatus: reg.paymentStatus
    }));

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${selectedLeague === 'all' ? 'all' : leagues.find(l => l._id === selectedLeague)?.name || 'export'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filtered = getFilteredRegistrations();
  const totalRevenue = filtered.filter(r => r.paymentStatus === 'paid').reduce((sum, r) => sum + r.paymentAmount, 0);
  const pendingRevenue = filtered.filter(r => r.paymentStatus === 'pending').reduce((sum, r) => sum + r.paymentAmount, 0);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h1>Reports & Data Export</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Download registration data for analysis and record-keeping
      </p>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="card-title">Filter & Export</h2>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <label className="form-label">Filter by League:</label>
            <select
              className="form-select"
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              style={{ minWidth: '250px' }}
            >
              <option value="all">All Leagues</option>
              {leagues.map(league => (
                <option key={league._id} value={league._id}>
                  {league.name} - {league.season}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
            <button className="btn btn-primary" onClick={downloadCSV}>
              📊 Download CSV
            </button>
            <button className="btn btn-secondary" onClick={downloadJSON}>
              📄 Download JSON
            </button>
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <strong>Showing:</strong> {filtered.length} registrations
            {selectedLeague !== 'all' && ` for ${leagues.find(l => l._id === selectedLeague)?.name}`}
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="card-title">Summary Statistics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Registrations</p>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-color)' }}>
              {filtered.length}
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Paid</p>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success-color)' }}>
              {filtered.filter(r => r.paymentStatus === 'paid').length}
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Pending</p>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--warning-color)' }}>
              {filtered.filter(r => r.paymentStatus === 'pending').length}
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Revenue (Paid)</p>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success-color)' }}>
              ${totalRevenue.toFixed(2)}
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Expected (Pending)</p>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--warning-color)' }}>
              ${pendingRevenue.toFixed(2)}
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Potential</p>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-color)' }}>
              ${(totalRevenue + pendingRevenue).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Registration Preview</h2>
        {filtered.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
            No registrations found for the selected filter.
          </p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>League</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Team</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 50).map((reg) => (
                  <tr key={reg._id}>
                    <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
                    <td>{reg.league?.name}</td>
                    <td>{reg.user?.firstName} {reg.user?.lastName}</td>
                    <td style={{ fontSize: '0.875rem' }}>{reg.contactInfo?.email || reg.user?.email}</td>
                    <td>{reg.contactInfo?.phone || reg.user?.phone}</td>
                    <td>{reg.team?.name || 'Individual'}</td>
                    <td>${reg.paymentAmount}</td>
                    <td>
                      <span className={`badge badge-${
                        reg.paymentStatus === 'paid' ? 'success' :
                        reg.paymentStatus === 'pending' ? 'warning' :
                        'danger'
                      }`}>
                        {reg.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 50 && (
              <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                Showing first 50 of {filtered.length} registrations. Download CSV/JSON for full data.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '2rem', background: 'var(--bg-secondary)' }}>
        <h2 className="card-title">💡 Tips</h2>
        <ul style={{ marginTop: '1rem', marginLeft: '1.5rem', lineHeight: '1.8' }}>
          <li><strong>CSV format</strong> is best for Excel and spreadsheet analysis</li>
          <li><strong>JSON format</strong> is best for data processing and integration with other systems</li>
          <li>Downloaded files include timestamps in the filename for easy organization</li>
          <li>Use the league filter to generate reports for specific seasons or divisions</li>
        </ul>
      </div>
    </div>
  );
};

export default Reports;
