import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>My Profile</h1>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="card-title">Personal Information</h2>
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
          <p><strong>Role:</strong> <span className="badge badge-primary">{user?.role}</span></p>
          {user?.notifications && (
            <>
              <p><strong>Email Notifications:</strong> {user.notifications.email ? 'Enabled' : 'Disabled'}</p>
              <p><strong>SMS Notifications:</strong> {user.notifications.sms ? 'Enabled' : 'Disabled'}</p>
            </>
          )}
        </div>
      </div>

      {user?.playerProfile && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2 className="card-title">Player Profile</h2>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            <p><strong>Jersey Number:</strong> {user.playerProfile.jerseyNumber || 'Not set'}</p>
            <p><strong>Position:</strong> {user.playerProfile.position || 'Not set'}</p>
            <p><strong>Height:</strong> {user.playerProfile.height || 'Not set'}</p>
            <p><strong>Weight:</strong> {user.playerProfile.weight ? \`\${user.playerProfile.weight} lbs\` : 'Not set'}</p>
          </div>
        </div>
      )}

      {user?.emergencyContact && user.emergencyContact.name && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2 className="card-title">Emergency Contact</h2>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            <p><strong>Name:</strong> {user.emergencyContact.name}</p>
            <p><strong>Phone:</strong> {user.emergencyContact.phone}</p>
            <p><strong>Relationship:</strong> {user.emergencyContact.relationship}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
