import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('myProfile');
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [familyProfiles, setFamilyProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [alerts, setAlerts] = useState({
    profile: '',
    family: '',
    modal: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    birthPlace: ''
  });

  // Modal form state
  const [modalData, setModalData] = useState({
    name: '',
    dob: '',
    tim: '',
    place: ''
  });

  const API_BASE = 'http://localhost:4000';

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    
    const loadData = async () => {
      try {
        await Promise.all([loadUserProfile(), loadFamilyProfiles()]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const showAlert = (type, message, alertType) => {
    setAlerts(prev => ({
      ...prev,
      [type]: { message, type: alertType }
    }));
    setTimeout(() => {
      setAlerts(prev => ({
        ...prev,
        [type]: ''
      }));
    }, 5000);
  };

  const loadUserProfile = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
        setProfileData({
          name: data.user.name || '',
          email: data.user.email || '',
          dateOfBirth: data.user.date_of_birth || '',
          gender: data.user.gender || '',
          birthPlace: data.user.birth_place || ''
        });
      } else {
        const errorData = await response.json();
        showAlert('profile', errorData.error || 'Failed to load profile', 'error');
      }
    } catch (error) {
      console.error('Load profile error:', error);
      showAlert('profile', 'Network error occurred', 'error');
    }
  };

  const loadFamilyProfiles = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/profiles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setFamilyProfiles(data.profiles);
      } else {
        const errorData = await response.json();
        showAlert('family', errorData.error || 'Failed to load profiles', 'error');
      }
    } catch (error) {
      console.error('Load family profiles error:', error);
      showAlert('family', 'Network error occurred', 'error');
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      loadUserProfile();
    }
  };

  const saveProfile = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileData.name,
          dateOfBirth: profileData.dateOfBirth,
          birthPlace: profileData.birthPlace,
          gender: profileData.gender
        })
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        showAlert('profile', 'Profile updated successfully!', 'success');
        setIsEditing(false);
        setCurrentUser(prev => ({ ...prev, name: profileData.name }));
        loadUserProfile();
      } else {
        showAlert('profile', data.error || 'Update failed', 'error');
      }
    } catch (error) {
      console.error('Save profile error:', error);
      showAlert('profile', 'Network error occurred', 'error');
    }
  };

  const openAddModal = () => {
    setEditingProfileId(null);
    setModalData({
      name: '',
      dob: '',
      tim: '',
      place: ''
    });
    setShowModal(true);
  };

  const editProfile = (profile) => {
    setEditingProfileId(profile.id);
    setModalData({
      name: profile.name,
      dob: profile.dob,
      tim: profile.tim,
      place: profile.place
    });
    setShowModal(true);
  };

  const saveModalProfile = async () => {
    const { name, dob, tim, place } = modalData;
    
    if (!name || !dob || !tim || !place) {
      showAlert('modal', 'All fields are required', 'error');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const url = editingProfileId 
        ? `${API_BASE}/profiles/${editingProfileId}`
        : `${API_BASE}/profiles`;
      const method = editingProfileId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, dob, tim, place })
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        const message = editingProfileId 
          ? 'Profile updated successfully!' 
          : 'Profile added successfully!';
        showAlert('family', message, 'success');
        setShowModal(false);
        loadFamilyProfiles();
      } else {
        showAlert('modal', data.error || 'Operation failed', 'error');
      }
    } catch (error) {
      console.error('Save profile error:', error);
      showAlert('modal', 'Network error occurred', 'error');
    }
  };

  const deleteProfile = async (id) => {
    if (!window.confirm('Are you sure you want to delete this profile?')) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/profiles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        showAlert('family', 'Profile deleted successfully!', 'success');
        loadFamilyProfiles();
      } else {
        showAlert('family', data.error || 'Delete failed', 'error');
      }
    } catch (error) {
      console.error('Delete profile error:', error);
      showAlert('family', 'Network error occurred', 'error');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const Alert = ({ alert }) => {
    if (!alert) return null;
    return (
      <div className={`alert alert-${alert.type}`}>
        {alert.message}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="user-profile">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-links">
          {/* Add your navigation links here if needed */}
        </div>
        <div className="user-section">
          <span className="user-name">
            Welcome, {currentUser?.name || 'User'}
          </span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <h1>🔮 UserProfile Management</h1>
          <p>Manage your personal profile and family members</p>
        </div>

        {/* Profile Container */}
        <div className="profile-container">
          {/* Profile Tabs */}
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'myProfile' ? 'active' : ''}`}
              onClick={() => setActiveTab('myProfile')}
            >
              👤 My Profile
            </button>
            <button 
              className={`tab-btn ${activeTab === 'familyFriends' ? 'active' : ''}`}
              onClick={() => setActiveTab('familyFriends')}
            >
              👥 Family & Friends ({familyProfiles.length})
            </button>
          </div>

          {/* My Profile Tab */}
          {activeTab === 'myProfile' && (
            <div className="tab-content active">
              <div className="profile-section">
                <h2>
                  Personal Information
                  <button className="edit-btn" onClick={toggleEdit}>
                    {isEditing ? 'Cancel' : '✏️ Edit Profile'}
                  </button>
                </h2>
                
                <Alert alert={alerts.profile} />
                
                <form className="profile-form">
                  <div className="form-fields">
                    <div className="form-group">
                      <label>👤 Name</label>
                      <input 
                        type="text" 
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>📧 Email</label>
                      <input 
                        type="email" 
                        value={profileData.email}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label>📅 Date of Birth</label>
                      <input 
                        type="date" 
                        value={profileData.dateOfBirth}
                        onChange={(e) => setProfileData(prev => ({...prev, dateOfBirth: e.target.value}))}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>⚧ Gender</label>
                      <select 
                        value={profileData.gender}
                        onChange={(e) => setProfileData(prev => ({...prev, gender: e.target.value}))}
                        disabled={!isEditing}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>📍 Birth Place</label>
                      <input 
                        type="text" 
                        value={profileData.birthPlace}
                        onChange={(e) => setProfileData(prev => ({...prev, birthPlace: e.target.value}))}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="profile-actions">
                      <button type="button" className="btn-save" onClick={saveProfile}>
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* Family & Friends Tab */}
          {activeTab === 'familyFriends' && (
            <div className="tab-content active">
              <div className="profile-section">
                <h2>Family & Friends Profiles</h2>
                <button className="add-profile-btn" onClick={openAddModal}>
                  ➕ Add New Profile
                </button>
                
                <Alert alert={alerts.family} />
                
                <div className="profiles-grid">
                  {familyProfiles.length === 0 ? (
                    <p style={{textAlign: 'center', opacity: 0.7, gridColumn: '1/-1'}}>
                      No family or friend profiles added yet.
                    </p>
                  ) : (
                    familyProfiles.map(profile => (
                      <div key={profile.id} className="profile-card">
                        <h3>{profile.name}</h3>
                        <div className="profile-info">
                          <span>📅 DOB: {new Date(profile.dob).toLocaleDateString()}</span>
                          <span>🕐 Time: {profile.tim}</span>
                          <span>📍 Place: {profile.place}</span>
                        </div>
                        <div className="profile-actions">
                          <button 
                            className="btn-edit" 
                            onClick={() => editProfile(profile)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn-delete" 
                            onClick={() => deleteProfile(profile.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Profile Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingProfileId ? 'Edit Profile' : 'Add New Profile'}</h3>
            
            <Alert alert={alerts.modal} />
            
            <div>
              <div className="form-group">
                <label>👤 Name</label>
                <input 
                  type="text" 
                  value={modalData.name}
                  onChange={(e) => setModalData(prev => ({...prev, name: e.target.value}))}
                  required 
                />
              </div>
              <div className="form-group">
                <label>📅 Date of Birth</label>
                <input 
                  type="date" 
                  value={modalData.dob}
                  onChange={(e) => setModalData(prev => ({...prev, dob: e.target.value}))}
                  required 
                />
              </div>
              <div className="form-group">
                <label>🕐 Time of Birth</label>
                <input 
                  type="time" 
                  value={modalData.tim}
                  onChange={(e) => setModalData(prev => ({...prev, tim: e.target.value}))}
                  required 
                />
              </div>
              <div className="form-group">
                <label>📍 Birth Place</label>
                <input 
                  type="text" 
                  value={modalData.place}
                  onChange={(e) => setModalData(prev => ({...prev, place: e.target.value}))}
                  required 
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-save" onClick={saveModalProfile}>
                  Save
                </button>
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
