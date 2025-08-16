import React, { useState } from 'react';
import { Heart, Sparkles, User, Calendar, Hash } from 'lucide-react';
import ResultPage from './ResultPage';
import './MatchMaking.css';

export default function SoulMateApp() {
  const [malePartner, setMalePartner] = useState({
    fullName: '',
    birthMonth: '',
    day: '',
    year: ''
  });

  const [femalePartner, setFemalePartner] = useState({
    fullName: '',
    birthMonth: '',
    day: '',
    year: ''
  });

  const [showResult, setShowResult] = useState(false);

  const months = [
    'Select Month',
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleMaleChange = (field, value) => {
    setMalePartner(prev => ({ ...prev, [field]: value }));
  };

  const handleFemaleChange = (field, value) => {
    setFemalePartner(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return malePartner.fullName && malePartner.birthMonth && malePartner.day && malePartner.year &&
          femalePartner.fullName && femalePartner.birthMonth && femalePartner.day && femalePartner.year &&
          malePartner.birthMonth !== 'Select Month' && femalePartner.birthMonth !== 'Select Month';
  };

  const handleCalculate = () => {
    if (isFormValid()) {
      setShowResult(true);
    }
  };

  const resetForm = () => {
    setMalePartner({ fullName: '', birthMonth: '', day: '', year: '' });
    setFemalePartner({ fullName: '', birthMonth: '', day: '', year: '' });
    setShowResult(false);
  };

  // If showing result, render Result Page
  if (showResult) {
    return (
      <ResultPage 
        malePartner={malePartner}
        femalePartner={femalePartner}
        onReset={resetForm}
      />
    );
  }

  // Main Form Page
  return (
    <div className="main-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      <div className="content-wrapper">
        {/* Header */}
        <div className="header">
          <div className="header-title">
            <Heart className="heart-icon" />
            <h1 className="main-title">
              SoulMate: Mystic Compatibility Portal
            </h1>
          </div>
          <p className="header-subtitle">
            Discover your cosmic connection - Find your perfect match
          </p>
        </div>

        {/* Form Container */}
        <div className="form-container">
          <div className="form-header">
            <Sparkles className="sparkles-icon" />
            <h2 className="form-title">Get Your Complete Compatibility Report</h2>
            <p className="form-subtitle">Enter both partners' details below for cosmic analysis</p>
          </div>

          <div className="partners-grid">
            {/* Male Partner Section */}
            <div className="partner-section male-section">
              <div className="partner-header">
                <User className="user-icon male-icon" />
                <h3 className="partner-title male-title">♂ Partner Details</h3>
              </div>
              
              <div className="form-fields">
                <div className="field-group">
                  <label className="field-label" htmlFor="male-name">Full Name</label>
                  <div className="input-with-icon">
                    <User className="input-icon" />
                    <input
                      id="male-name"
                      type="text"
                      className="input-field male-input with-icon"
                      placeholder="Enter full name"
                      value={malePartner.fullName}
                      onChange={(e) => handleMaleChange('fullName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="male-month">Birth Month</label>
                  <div className="input-with-icon">
                    <Calendar className="input-icon" />
                    <select
                      id="male-month"
                      className="select-field male-input with-icon"
                      value={malePartner.birthMonth}
                      onChange={(e) => handleMaleChange('birthMonth', e.target.value)}
                    >
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="male-day">Day</label>
                  <div className="input-with-icon">
                    <Hash className="input-icon" />
                    <input
                      id="male-day"
                      type="number"
                      min="1"
                      max="31"
                      className="input-field male-input with-icon"
                      placeholder="DD"
                      value={malePartner.day}
                      onChange={(e) => handleMaleChange('day', e.target.value)}
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="male-year">Year</label>
                  <div className="input-with-icon">
                    <Calendar className="input-icon" />
                    <input
                      id="male-year"
                      type="number"
                      min="1900"
                      max="2025"
                      className="input-field male-input with-icon"
                      placeholder="YYYY"
                      value={malePartner.year}
                      onChange={(e) => handleMaleChange('year', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Female Partner Section */}
            <div className="partner-section female-section">
              <div className="partner-header">
                <User className="user-icon female-icon" />
                <h3 className="partner-title female-title">♀ Partner Details</h3>
              </div>
              
              <div className="form-fields">
                <div className="field-group">
                  <label className="field-label" htmlFor="female-name">Full Name</label>
                  <div className="input-with-icon">
                    <User className="input-icon" />
                    <input
                      id="female-name"
                      type="text"
                      className="input-field female-input with-icon"
                      placeholder="Enter full name"
                      value={femalePartner.fullName}
                      onChange={(e) => handleFemaleChange('fullName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="female-month">Birth Month</label>
                  <div className="input-with-icon">
                    <Calendar className="input-icon" />
                    <select
                      id="female-month"
                      className="select-field female-input with-icon"
                      value={femalePartner.birthMonth}
                      onChange={(e) => handleFemaleChange('birthMonth', e.target.value)}
                    >
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="female-day">Day</label>
                  <div className="input-with-icon">
                    <Hash className="input-icon" />
                    <input
                      id="female-day"
                      type="number"
                      min="1"
                      max="31"
                      className="input-field female-input with-icon"
                      placeholder="DD"
                      value={femalePartner.day}
                      onChange={(e) => handleFemaleChange('day', e.target.value)}
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="female-year">Year</label>
                  <div className="input-with-icon">
                    <Calendar className="input-icon" />
                    <input
                      id="female-year"
                      type="number"
                      min="1900"
                      max="2025"
                      className="input-field female-input with-icon"
                      placeholder="YYYY"
                      value={femalePartner.year}
                      onChange={(e) => handleFemaleChange('year', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="button-container">
            <button
              className="calculate-btn"
              onClick={handleCalculate}
              disabled={!isFormValid()}
            >
              <Sparkles className="btn-icon" />
              Generate Cosmic Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}