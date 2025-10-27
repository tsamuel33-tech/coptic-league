import { useState, useEffect } from 'react';
import { leagueAPI } from '../../utils/api';

const LeagueManagement = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLeague, setEditingLeague] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    division: '',
    season: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    registrationFee: '',
    maxTeams: '',
    status: 'open',
    description: ''
  });

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      const response = await leagueAPI.getAll();
      setLeagues(response.data);
    } catch (err) {
      setError('Failed to load leagues');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingLeague) {
        await leagueAPI.update(editingLeague._id, formData);
        setSuccess('League updated successfully!');
      } else {
        await leagueAPI.create(formData);
        setSuccess('League created successfully!');
      }

      resetForm();
      fetchLeagues();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save league');
    }
  };

  const handleEdit = (league) => {
    setEditingLeague(league);
    setFormData({
      name: league.name,
      division: league.division,
      season: league.season,
      startDate: league.startDate?.split('T')[0] || '',
      endDate: league.endDate?.split('T')[0] || '',
      registrationDeadline: league.registrationDeadline?.split('T')[0] || '',
      registrationFee: league.registrationFee,
      maxTeams: league.maxTeams,
      status: league.status,
      description: league.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this league?')) return;

    try {
      await leagueAPI.delete(id);
      setSuccess('League deleted successfully!');
      fetchLeagues();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete league');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      division: '',
      season: '',
      startDate: '',
      endDate: '',
      registrationDeadline: '',
      registrationFee: '',
      maxTeams: '',
      status: 'open',
      description: ''
    });
    setEditingLeague(null);
    setShowForm(false);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>League Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Create New League'}
        </button>
      </div>

      {error && <div className="error-message" style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--danger-color)', color: 'white', borderRadius: '8px' }}>{error}</div>}
      {success && <div className="success-message" style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--success-color)', color: 'white', borderRadius: '8px' }}>{success}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 className="card-title">{editingLeague ? 'Edit League' : 'Create New League'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">League Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Winter Basketball League"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Division *</label>
                <select
                  name="division"
                  className="form-select"
                  value={formData.division}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Division</option>
                  <option value="Youth">Youth</option>
                  <option value="Adult">Adult</option>
                  <option value="Senior">Senior</option>
                  <option value="Open">Open</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Season *</label>
                <input
                  type="text"
                  name="season"
                  className="form-input"
                  value={formData.season}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Winter 2025"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status *</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="open">Open for Registration</option>
                  <option value="closed">Closed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-input"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  className="form-input"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Registration Deadline *</label>
                <input
                  type="date"
                  name="registrationDeadline"
                  className="form-input"
                  value={formData.registrationDeadline}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Registration Fee ($) *</label>
                <input
                  type="number"
                  name="registrationFee"
                  className="form-input"
                  value={formData.registrationFee}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max Teams *</label>
                <input
                  type="number"
                  name="maxTeams"
                  className="form-input"
                  value={formData.maxTeams}
                  onChange={handleInputChange}
                  required
                  min="2"
                  placeholder="e.g., 8"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="League description, rules, requirements, etc."
                rows="4"
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary">
                {editingLeague ? 'Update League' : 'Create League'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">Existing Leagues ({leagues.length})</h2>

        {leagues.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
            No leagues created yet. Click "Create New League" to get started.
          </p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Division</th>
                  <th>Season</th>
                  <th>Status</th>
                  <th>Teams</th>
                  <th>Fee</th>
                  <th>Start Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leagues.map((league) => (
                  <tr key={league._id}>
                    <td><strong>{league.name}</strong></td>
                    <td>{league.division}</td>
                    <td>{league.season}</td>
                    <td>
                      <span className={`badge badge-${league.status === 'open' ? 'success' : league.status === 'in-progress' ? 'warning' : 'primary'}`}>
                        {league.status}
                      </span>
                    </td>
                    <td>{league.teams?.length || 0}/{league.maxTeams}</td>
                    <td>${league.registrationFee}</td>
                    <td>{new Date(league.startDate).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                          onClick={() => handleEdit(league)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                          onClick={() => handleDelete(league._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeagueManagement;
