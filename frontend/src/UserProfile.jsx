import React, { useState, useEffect } from 'react';
import './UserProfile2.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (retryCount < 3) { // Limit retries
      fetchUserProfile();
    } else {
      console.error('Max retries reached');
      setError('Failed to load profile after multiple attempts');
      setLoading(false);
    }
  }, [retryCount]);

  const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
      // Basic JWT structure check
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // Check if token is expired (if it's a JWT)
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        console.log('Token is expired');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Token sent to backend:", token);
      
      // Comprehensive token debugging
      console.log('=== FRONTEND TOKEN DEBUG ===');
      console.log('Token exists:', !!token);
      console.log('Token type:', typeof token);
      console.log('Token length:', token ? token.length : 0);
      console.log('Token preview:', token ? token.substring(0, 50) + '...' : 'No token');
      
      // Check localStorage contents
      console.log('All localStorage keys:', Object.keys(localStorage));
      console.log('localStorage contents:');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`${key}: ${value ? value.substring(0, 20) + '...' : 'null'}`);
      }
      
      if (!token || !isTokenValid(token)) {
        console.error('❌ No valid token found - redirecting to login');
        localStorage.removeItem('token'); // Clean up invalid token
        window.location.href = '/login';
        return;
      }

      // Test token format
      try {
        const tokenParts = token.split('.');
        console.log('Token parts count:', tokenParts.length);
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Token payload:', payload);
          console.log('Token expires:', new Date(payload.exp * 1000));
          console.log('Token still valid:', payload.exp > Date.now() / 1000);
        }
      } catch (e) {
        console.log('Token parsing error:', e.message);
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      console.log('Request headers being sent:', headers);
      console.log('Making request to: http://localhost:4000/profile');
      
      const response = await fetch('http://localhost:4000/profile', {
        method: 'GET',
        headers: headers
      });

      console.log('Response received:');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Profile data received:', data);
        setUser(data.user);
        setFormData(data.user);
        setError(null);
      } else {
        console.error('❌ Profile fetch failed');
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        // Try to parse as JSON
        try {
          const errorJson = JSON.parse(errorText);
          console.error('Parsed error:', errorJson);
          setError(errorJson.error || 'Failed to fetch profile');
        } catch (e) {
          console.error('Could not parse error as JSON');
          setError('Failed to fetch profile');
        }
        
        // If unauthorized, clear token and redirect
        if (response.status === 403 || response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          // For other errors, increment retry count
          setTimeout(() => setRetryCount(prev => prev + 1), 2000);
        }
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setError('Network error occurred');
      setTimeout(() => setRetryCount(prev => prev + 1), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return;

    const formDataImg = new FormData();
    formDataImg.append('profileImage', imageFile);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/profile/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataImg
      });

      if (response.ok) {
        const data = await response.json();
        setUser(prev => ({
          ...prev,
          profileImage: data.imageUrl
        }));
        setImageFile(null);
        alert('Profile image updated successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await fetch('http://localhost:4000/profile', {
  //       method: 'PUT',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(formData)
  //     });

  //     if (response.ok) {
  //       setUser(formData);
  //       setEditing(false);
  //       alert('Profile updated successfully!');
        
  //       // Upload image if selected
  //       if (imageFile) {
  //         await uploadImage();
  //       }
  //     } else {
  //       const errorData = await response.json();
  //       alert(errorData.error || 'Failed to update profile');
  //     }
  //   } catch (error) {
  //     console.error('Error updating profile:', error);
  //     alert('Error updating profile');
  //   }
  // };

const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');

  try {
    const response = await fetch('http://localhost:4000/profile/save', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      setUser(formData);
      setEditing(false);
      alert('Profile saved to database!');

      // Optional: upload profile image too
      if (imageFile) {
        await uploadImage();
      }

    } else {
      const error = await response.json();
      alert(error.error || 'Failed to save profile');
    }

  } catch (err) {
    console.error('Profile save error:', err);
    alert('Something went wrong');
  }
};


  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/profile/change-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        alert('Password changed successfully!');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const downloadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/profile/export', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user-data.json';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading data:', error);
    }
  };

  const deleteAccount = async () => {
    const password = window.prompt('Please enter your password to confirm account deletion:');
    if (!password) return;

    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/profile/delete-account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        alert('Account deleted successfully');
        localStorage.removeItem('token');
        window.location.href = '/';
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account');
    }
  };

  // Token validation test function
  const testTokenValidation = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/validate-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      console.log('Token validation result:', result);
      alert(`Token validation: ${result.valid ? 'VALID' : 'INVALID'}`);
    } catch (error) {
      console.error('Token validation error:', error);
      alert('Token validation failed');
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">
          <div>Loading profile...</div>
          {retryCount > 0 && <div>Retry attempt: {retryCount}/3</div>}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error">
          <h3>Error: {error}</h3>
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => {
              setError(null);
              setRetryCount(0);
              setLoading(true);
            }} className="retry-btn">
              Try Again
            </button>
            {/* <button onClick={testTokenValidation} className="test-btn" style={{ marginLeft: '10px' }}>
              Test Token
            </button> */}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error">
          <div>Failed to load profile</div>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-title">
          <div className="user-icon">👤</div>
          <h1>User Profile</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* <button onClick={testTokenValidation} className="test-btn" style={{ fontSize: '12px', padding: '5px 10px' }}>
            🔧 Test Token
          </button> */}
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Profile Banner */}
      <div className="profile-banner">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">👤</div>
            )}
          </div>
          <div className="profile-basic-info">
            <h2>{user.name}</h2>
            <p className="email">@{user.email}</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="profile-section">
        <div className="section-header">
          <h3>Personal Information</h3>
          <button 
            className="edit-btn"
            onClick={() => setEditing(!editing)}
          >
            ✏️ {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-grid">
            <div className="form-group">
              <label>👤 Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                disabled={!editing}
                required
              />
            </div>

            <div className="form-group">
              <label>📧 Email Address</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="disabled-field"
              />
            </div>

            <div className="form-group">
              <label>📱 Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                disabled={!editing}
                placeholder="+91 xxx-xxx-xxxx"
              />
            </div>

            <div className="form-group">
              <label>📅 Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>🏠 Address</label>
              <textarea
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                disabled={!editing}
                rows="3"
                placeholder="Your address"
              />
            </div>

            <div className="form-group">
              <label>💼 Occupation</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation || ''}
                onChange={handleInputChange}
                disabled={!editing}
                placeholder="Your occupation"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>📝 Bio</label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleInputChange}
              disabled={!editing}
              rows="4"
              placeholder="Tell us about yourself"
            />
          </div>

          {editing && (
            <div className="form-group full-width">
              <label>📷 Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              {imageFile && (
                <p className="file-selected">Selected: {imageFile.name}</p>
              )}
            </div>
          )}

          {editing && (
            <div className="form-actions">
              <button type="submit" className="save-btn">
                💾 Save Changes
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Account Actions */}
      <div className="profile-section">
        <h3>Account Actions</h3>
        <div className="action-buttons">
          <button 
            className="action-btn change-password"
            onClick={() => setShowPasswordModal(true)}
          >
            🔒 Change Password
          </button>
          <button className="action-btn privacy-settings">
            🛡️ Privacy Settings
          </button>
          <button 
            className="action-btn download-data"
            onClick={downloadData}
          >
            📥 Download Data
          </button>
          <button 
            className="action-btn delete-account"
            onClick={deleteAccount}
          >
            🗑️ Delete Account
          </button>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button 
                className="close-btn"
                onClick={() => setShowPasswordModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    newPassword: e.target.value
                  }))}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))}
                  required
                  minLength="6"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Change Password
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;