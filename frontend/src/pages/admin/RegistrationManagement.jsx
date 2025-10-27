import { useState, useEffect } from 'react';
import { registrationAPI } from '../../utils/api';

const RegistrationManagement = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await registrationAPI.getAll();
      setRegistrations(response.data);
    } catch (err) {
      setError('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentUpdate = async (id, status) => {
    try {
      await registrationAPI.updatePayment(id, { paymentStatus: status });
      fetchRegistrations();
    } catch (err) {
      setError('Failed to update payment status');
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    if (filter === 'all') return true;
    return reg.paymentStatus === filter;
  });

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h1>Registration Management</h1>

      {error && <div className="error-message" style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--danger-color)', color: 'white', borderRadius: '8px' }}>{error}</div>}

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontWeight: '600' }}>Filter by Status:</label>
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ maxWidth: '200px' }}
          >
            <option value="all">All Registrations</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Registrations ({filteredRegistrations.length})</h2>

        {filteredRegistrations.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
            No registrations found.
          </p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>League</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Team</th>
                  <th>Amount</th>
                  <th>Payment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                  <tr key={reg._id}>
                    <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
                    <td>{reg.league?.name || 'N/A'}</td>
                    <td>{reg.user?.firstName} {reg.user?.lastName}</td>
                    <td>{reg.contactInfo?.email || reg.user?.email}</td>
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
                    <td>
                      {reg.paymentStatus === 'pending' && (
                        <button
                          className="btn btn-success"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                          onClick={() => handlePaymentUpdate(reg._id, 'paid')}
                        >
                          Mark as Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '2rem', background: 'var(--bg-secondary)' }}>
        <h3 className="card-title">📊 Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Registrations</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{registrations.length}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Pending Payment</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--warning-color)' }}>
              {registrations.filter(r => r.paymentStatus === 'pending').length}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Paid</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success-color)' }}>
              {registrations.filter(r => r.paymentStatus === 'paid').length}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Revenue</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-color)' }}>
              ${registrations.filter(r => r.paymentStatus === 'paid').reduce((sum, r) => sum + r.paymentAmount, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationManagement;
