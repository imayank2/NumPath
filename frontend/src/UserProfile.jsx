
import React, { useState } from 'react';
import { User, Edit, Save, X, LogOut, Mail, Phone, Calendar, MapPin, Camera } from 'lucide-react';
import './UserProfile.css';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '@example.com',
    phone: '+91 xxx-xxxx-xxxx',
    dateOfBirth: '1990-01-01',
    address: '',
    bio: '',
    profileImage: null
  });
  
  const [editedInfo, setEditedInfo] = useState({ ...userInfo });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo({ ...userInfo });
  };

  const handleSave = () => {
    setUserInfo({ ...editedInfo });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInfo({ ...userInfo });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      alert('Logged out successfully!');
      // Here you would typically redirect to login page or clear auth tokens
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('profileImage', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="user-profile-container">
      <div className="user-profile-wrapper">
        {/* Header */}
        <div className="user-profile-header">
          <div className="header-content">
            <h1 className="header-title">
              <User className="header-icon" size={32} />
              User Profile
            </h1>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-header-content">
              <div className="profile-image-container">
                <div className="profile-image-wrapper">
                  {(isEditing ? editedInfo.profileImage : userInfo.profileImage) ? (
                    <img
                      src={isEditing ? editedInfo.profileImage : userInfo.profileImage}
                      alt="Profile"
                      className="profile-image"
                    />
                  ) : (
                    <div className="profile-image-placeholder">
                      <User size={48} className="placeholder-icon" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="camera-btn">
                    <Camera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              <div className="profile-info">
                <h2 className="profile-name">
                  {isEditing ? editedInfo.name : userInfo.name}
                </h2>
                <p className="profile-email">
                  {isEditing ? editedInfo.email : userInfo.email}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="profile-details">
            <div className="details-header">
              <h3 className="details-title">Personal Information</h3>
              {!isEditing ? (
                <button onClick={handleEdit} className="edit-btn">
                  <Edit size={18} />
                  Edit Profile
                </button>
              ) : (
                <div className="action-buttons">
                  <button onClick={handleSave} className="save-btn">
                    <Save size={18} />
                    Save
                  </button>
                  <button onClick={handleCancel} className="cancel-btn">
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="form-grid">
              {/* Name */}
              <div className="form-field">
                <label className="field-label">
                  <User size={16} />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="field-input"
                  />
                ) : (
                  <p className="field-display">{userInfo.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="form-field">
                <label className="field-label">
                  <Mail size={16} />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="field-input"
                  />
                ) : (
                  <p className="field-display">{userInfo.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="form-field">
                <label className="field-label">
                  <Phone size={16} />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="field-input"
                  />
                ) : (
                  <p className="field-display">{userInfo.phone}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="form-field">
                <label className="field-label">
                  <Calendar size={16} />
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedInfo.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="field-input"
                  />
                ) : (
                  <p className="field-display">
                    {new Date(userInfo.dateOfBirth).toLocaleDateString('en-IN')}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="form-field form-field-full">
                <label className="field-label">
                  <MapPin size={16} />
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="field-input"
                  />
                ) : (
                  <p className="field-display">{userInfo.address}</p>
                )}
              </div>

              {/* Bio */}
              <div className="form-field form-field-full">
                <label className="field-label">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={editedInfo.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={3}
                    className="field-textarea"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="field-display">{userInfo.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="account-actions">
          <h3 className="actions-title">Account Actions</h3>
          <div className="actions-buttons">
            <button className="action-btn action-btn-blue">
              Change Password
            </button>
            <button className="action-btn action-btn-purple">
              Privacy Settings
            </button>
            <button className="action-btn action-btn-orange">
              Download Data
            </button>
            <button className="action-btn action-btn-red">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;