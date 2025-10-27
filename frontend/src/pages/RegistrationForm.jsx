import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrationAPI, leagueAPI } from '../utils/api';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState([]);
  const [formData, setFormData] = useState({
    league: '',
    registrationType: 'player',
    shirtSize: 'M',
    emergencyWaiver: {
      signed: false,
      signerName: '',
    },
    medicalInfo: {
      allergies: '',
      medications: '',
      conditions: '',
    },
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      const response = await leagueAPI.getAll({ status: 'open' });
      setLeagues(response.data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await registrationAPI.create(formData);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card">
        <h2 className="success-message" style={{ fontSize: '1.5rem', textAlign: 'center' }}>
          Registration Successful!
        </h2>
        <p style={{ textAlign: 'center' }}>Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Register for League</h1>

      {error && <div className="card error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="card" style={{ marginTop: '2rem' }}>
        <div className="form-group">
          <label className="form-label">Select League *</label>
          <select
            name="league"
            className="form-select"
            value={formData.league}
            onChange={handleChange}
            required
          >
            <option value="">Choose a league...</option>
            {leagues.map((league) => (
              <option key={league._id} value={league._id}>
                {league.name} - {league.division} (${league.registrationFee})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Registration Type *</label>
          <select
            name="registrationType"
            className="form-select"
            value={formData.registrationType}
            onChange={handleChange}
            required
          >
            <option value="player">Player</option>
            <option value="coach">Coach</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Shirt Size *</label>
          <select
            name="shirtSize"
            className="form-select"
            value={formData.shirtSize}
            onChange={handleChange}
            required
          >
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Medical Information</label>
          <input
            type="text"
            name="medicalInfo.allergies"
            className="form-input"
            placeholder="Allergies"
            value={formData.medicalInfo.allergies}
            onChange={handleChange}
          />
          <input
            type="text"
            name="medicalInfo.medications"
            className="form-input"
            placeholder="Medications"
            value={formData.medicalInfo.medications}
            onChange={handleChange}
            style={{ marginTop: '0.5rem' }}
          />
          <input
            type="text"
            name="medicalInfo.conditions"
            className="form-input"
            placeholder="Medical Conditions"
            value={formData.medicalInfo.conditions}
            onChange={handleChange}
            style={{ marginTop: '0.5rem' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Emergency Waiver</label>
          <input
            type="text"
            name="emergencyWaiver.signerName"
            className="form-input"
            placeholder="Signer Name"
            value={formData.emergencyWaiver.signerName}
            onChange={handleChange}
            required
          />
          <label style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              name="emergencyWaiver.signed"
              checked={formData.emergencyWaiver.signed}
              onChange={handleChange}
              required
              style={{ marginRight: '0.5rem' }}
            />
            I agree to the terms and conditions
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">Additional Notes</label>
          <textarea
            name="notes"
            className="form-textarea"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional information..."
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Submitting...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
