import React, { useState } from 'react'; 
import { Star, Calendar, User, Target, Clock, Moon, Sun, Compass } from 'lucide-react';
import './App2.css';

const getLifePathDescription = (number) => {
  const descriptions = {
    1: 'The Leader - Independent, pioneering, ambitious',
    2: 'The Diplomat - Cooperative, sensitive, peacemaker',
    3: 'The Creative - Artistic, expressive, optimistic',
    4: 'The Builder - Practical, disciplined, hardworking',
    5: 'The Adventurer - Freedom-loving, curious, dynamic',
    6: 'The Nurturer - Caring, responsible, family-oriented',
    7: 'The Seeker - Spiritual, analytical, introspective',
    8: 'The Achiever - Ambitious, material success, authority',
    9: 'The Humanitarian - Compassionate, generous, wise'
  };
  return descriptions[number] || 'Unknown';
};

const getBirthNumberDescription = (number) => {
  const descriptions = {
    1: 'Natural leader with strong willpower',
    2: 'Diplomatic and cooperative nature',
    3: 'Creative and expressive personality',
    4: 'Practical and methodical approach',
    5: 'Adventurous and freedom-seeking',
    6: 'Nurturing and responsibility-focused',
    7: 'Analytical and spiritually inclined',
    8: 'Ambitious with business acumen',
    9: 'Humanitarian with global perspective'
  };
  return descriptions[number] || 'Unique traits';
};

const getDestinyNumberDescription = (number) => {
  const descriptions = {
    1: 'Leadership and innovation destiny',
    2: 'Partnership and harmony purpose',
    3: 'Creative expression and inspiration',
    4: 'Building and systematic achievement',
    5: 'Freedom and progressive change',
    6: 'Service and nurturing others',
    7: 'Spiritual wisdom and research',
    8: 'Material mastery and authority',
    9: 'Universal service and completion'
  };
  return descriptions[number] || 'Special mission';
};

// Form Components
const FormInput = ({ label, type = "text", placeholder, value, onChange, ...props }) => (
  <div>
    <label style={{ color: 'white', fontWeight: '500', marginBottom: '6px', display: 'block' }}>{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="form-input"
      {...props}
    />
  </div>
);

const FormSelect = ({ label, value, onChange, options, placeholder }) => (
  <div>
    <label style={{ color: 'white', fontWeight: '500', marginBottom: '6px', display: 'block' }}>{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="form-select"
    >
      <option value="">{placeholder}</option>
      {options.map((option, index) => (
        <option key={option} value={index + 1}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

// Compact Form Component for Top Position
const CompactFormSection = ({ formData, onInputChange, onSubmit }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const isFormValid = formData.name && formData.day && formData.month && formData.year;

  return (
    <div className="glass-card hover-lift animate-mystical-glow" style={{ marginBottom: '2rem' }}>
      <div className="text-center mb-6">
        <div className="icon-container calendar mb-3">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-secondary-gradient text-xl font-bold mb-2">
          🔮 Get Your Complete Numerology Report
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
          Quick calculation - Enter your details below
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <FormSelect
          label="Month"
          value={formData.month}
          onChange={(e) => onInputChange('month', e.target.value)}
          options={months}
          placeholder="Select Month"
        />
        <FormInput
          label="Day"
          type="number"
          min="1"
          max="31"
          placeholder="DD"
          value={formData.day}
          onChange={(e) => onInputChange('day', e.target.value)}
        />
        <FormInput
          label="Year"
          type="number"
          min="1900"
          max="2024"
          placeholder="YYYY"
          value={formData.year}
          onChange={(e) => onInputChange('year', e.target.value)}
        />
        <FormInput
          label="Full Name"
          type="text"
          placeholder="Birth name"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={!isFormValid}
        className="btn-primary w-full"
        style={{ fontSize: '16px', padding: '14px 28px' }}
      >
        ✨ Calculate My Numerology Profile
      </button>
    </div>
  );
};

// Main Information Sections
const WhatIsNumerologySection = () => (
  <div className="glass-card hover-lift animate-fade-in-up">
    <div className="text-center mb-6">
      <div className="icon-container cosmic mb-4">
        <Compass className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-primary-gradient text-2xl font-bold mb-4">
        What is Numerology?
      </h2>
    </div>

    <div className="space-y-4 text-shadow-sm" style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.7' }}>
      <p>
        <strong className="text-secondary-gradient">Numerology</strong> is an ancient metaphysical science that explores the mystical relationship between numbers and life events. 
        It's based on the belief that numbers carry vibrational energy that influences our personality, relationships, and life path.
      </p>
      <p>
        Dating back over 4,000 years to ancient civilizations like Babylon, Egypt, and Greece, numerology was developed by great minds including 
        <strong className="text-tertiary-gradient"> Pythagoras</strong>, who believed "numbers rule the universe."
      </p>
      <div className="insight-card primary">
        <p className="font-semibold text-white">
          🔮 Core Principle: Every number from 1-9 carries unique vibrational frequencies that shape our destiny and reveal hidden truths about our life purpose.
        </p>
      </div>
    </div>
  </div>
);

const WhyNumerologyImportantSection = () => (
  <div className="glass-card hover-lift animate-fade-in-up animate-delay-1">
    <div className="text-center mb-6">
      <div className="icon-container star mb-4">
        <Target className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-secondary-gradient text-2xl font-bold mb-4">
        Why is Numerology Important?
      </h2>
    </div>

    <div className="space-y-4 text-shadow-sm" style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.7' }}>
      <p>
        Numerology serves as a powerful tool for <strong className="text-primary-gradient">self-discovery and guidance</strong>, 
        helping you understand your true nature and life's direction.
      </p>
      
      <div className="grid-responsive mt-6">
        <div className="insight-card secondary">
          <h4 className="text-secondary-gradient font-semibold mb-2">🎯 Self-Understanding</h4>
          <p>Reveals your strengths, weaknesses, and natural talents</p>
        </div>
        <div className="insight-card tertiary">
          <h4 className="text-tertiary-gradient font-semibold mb-2">💼 Career Guidance</h4>
          <p>Shows ideal career paths aligned with your vibration</p>
        </div>
        <div className="insight-card primary">
          <h4 className="text-primary-gradient font-semibold mb-2">💕 Relationship Compatibility</h4>
          <p>Understanding compatibility with partners and friends</p>
        </div>
        <div className="insight-card cosmic">
          <h4 className="text-cosmic-gradient font-semibold mb-2">⏰ Timing Decisions</h4>
          <p>Optimal timing for major life decisions and changes</p>
        </div>
      </div>
    </div>
  </div>
);

const LifePathSection = () => (
  <div className="glass-card hover-lift animate-fade-in-up animate-delay-2">
    <div className="text-center mb-6">
      <div className="icon-container star mb-4">
        <Star className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-primary-gradient text-2xl font-bold mb-4">
        What's a Life Path Number?
      </h2>
    </div>

    <div className="text-shadow-sm space-y-4" style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6' }}>
      <p>
        Your <strong className="text-primary-gradient">Life Path Number</strong> is the most important number in numerology. 
        It represents your life's journey, core purpose, and the lessons you're here to learn.
      </p>
      <p>
        Calculated from your <strong className="text-secondary-gradient">birth date</strong>, it reveals your natural talents, 
        personality traits, and the challenges you'll face throughout your lifetime.
      </p>
      <div className="insight-card primary">
        <p className="font-semibold text-white">
          ✨ Think of it as your soul's blueprint - the path you chose before incarnating into this lifetime.
        </p>
      </div>
    </div>

    <div className="mt-6">
      <h3 className="text-secondary-gradient font-bold mb-4 text-lg">Life Path Characteristics:</h3>
      <div className="grid-responsive text-sm">
        {Array.from({length: 9}, (_, i) => i + 1).map(num => (
          <div key={num} className="path-card hover-lift">
            <span className="path-number">Path {num}:</span>
            <span className="path-description" style={{ marginLeft: '8px' }}>
              {getLifePathDescription(num).split(' - ')[1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BirthNumberSection = () => (
  <div className="glass-card hover-lift animate-fade-in-up animate-delay-3">
    <div className="text-center mb-6">
      <div className="icon-container calendar mb-4">
        <Calendar className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-tertiary-gradient text-2xl font-bold mb-4">
        What is Birth Number?
      </h2>
    </div>

    <div className="space-y-4 text-shadow-sm" style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.7' }}>
      <p>
        Your <strong className="text-tertiary-gradient">Birth Number</strong> is derived from the day of the month you were born. 
        It represents your <strong className="text-primary-gradient">natural personality</strong> and how you appear to others.
      </p>
      <p>
        Unlike Life Path, which shows your life journey, Birth Number reveals your 
        <strong className="text-secondary-gradient"> innate characteristics</strong> and immediate behavioral patterns.
      </p>
      
      <div className="insight-card tertiary">
        <p className="font-semibold text-white">
          🎭 Your Birth Number is like your "personality mask" - the first impression you give to the world.
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-tertiary-gradient font-bold mb-4 text-lg">Birth Number Traits:</h3>
        <div className="grid-responsive text-sm">
          {Array.from({length: 9}, (_, i) => i + 1).map(num => (
            <div key={num} className="path-card hover-lift">
              <span className="path-number">Birth {num}:</span>
              <span className="path-description" style={{ marginLeft: '8px' }}>
                {getBirthNumberDescription(num)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const DestinyNumberSection = () => (
  <div className="glass-card hover-lift animate-fade-in-up">
    <div className="text-center mb-6">
      <div className="icon-container user mb-4">
        <User className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-cosmic-gradient text-2xl font-bold mb-4">
        What is Destiny Number?
      </h2>
    </div>

    <div className="space-y-4 text-shadow-sm" style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.7' }}>
      <p>
        Your <strong className="text-cosmic-gradient">Destiny Number</strong> (also called Expression Number) is calculated from the 
        <strong className="text-primary-gradient"> full name given at birth</strong>. It represents your life's mission and ultimate potential.
      </p>
      <p>
        While Life Path shows the journey, Destiny Number reveals the 
        <strong className="text-secondary-gradient"> destination</strong> - what you're meant to achieve and contribute to the world.
      </p>
      
      <div className="insight-card cosmic">
        <p className="font-semibold text-white">
          🎯 Your Destiny Number is your soul's calling - the unique gift you're meant to share with humanity.
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-cosmic-gradient font-bold mb-4 text-lg">Destiny Number Purposes:</h3>
        <div className="grid-responsive text-sm">
          {Array.from({length: 9}, (_, i) => i + 1).map(num => (
            <div key={num} className="path-card hover-lift">
              <span className="path-number">Destiny {num}:</span>
              <span className="path-description" style={{ marginLeft: '8px' }}>
                {getDestinyNumberDescription(num)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const PersonalCyclesSection = () => (
  <div className="glass-card hover-lift animate-fade-in-up animate-delay-1">
    <div className="text-center mb-6">
      <div className="icon-container cosmic mb-4 animate-mystical-glow">
        <Clock className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-secondary-gradient text-2xl font-bold mb-4">
        Personal Year, Month & Day Numbers
      </h2>
    </div>

    <div className="space-y-6 text-shadow-sm" style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.7' }}>
      
      {/* Personal Year */}
      <div className="insight-card secondary">
        <div className="flex items-center mb-3">
          <Sun className="w-6 h-6 text-yellow-400 mr-3" />
          <h3 className="text-secondary-gradient font-bold text-lg">Personal Year Number</h3>
        </div>
        <p className="mb-3">
          Calculated using your birth date and current year, it reveals the 
          <strong className="text-primary-gradient"> overall theme and energy</strong> of your current year (Jan 1 - Dec 31).
        </p>
        <div className="grid-responsive text-sm mt-4">
          <div className="path-card">
            <span className="path-number">Year 1:</span> <span className="path-description">New beginnings, leadership</span>
          </div>
          <div className="path-card">
            <span className="path-number">Year 2:</span> <span className="path-description">Cooperation, relationships</span>
          </div>
          <div className="path-card">
            <span className="path-number">Year 3:</span> <span className="path-description">Creative expression, communication</span>
          </div>
          <div className="path-card">
            <span className="path-number">Year 4:</span> <span className="path-description">Hard work, building foundations</span>
          </div>
          <div className="path-card">
            <span className="path-number">Year 5:</span> <span className="path-description">Freedom, change, adventure</span>
          </div>
          <div className="path-card">
            <span className="path-number">Year 6:</span> <span className="path-description">Family, responsibility, service</span>
          </div>
          <div className="path-card">
            <span className="path-number">Year 7:</span> <span className="path-description">Spiritual growth, introspection</span>
          </div>
          <div className="path-card">
            <span className="path-number">Year 8:</span> <span className="path-description">Material success, achievement</span>
          </div>
          <div className="path-card">
            <span className="path-number">Year 9:</span> <span className="path-description">Completion, humanitarian service</span>
          </div>
        </div>
      </div>

      {/* Personal Month */}
      <div className="insight-card tertiary">
        <div className="flex items-center mb-3">
          <Moon className="w-6 h-6 text-blue-400 mr-3" />
          <h3 className="text-tertiary-gradient font-bold text-lg">Personal Month Number</h3>
        </div>
        <p className="mb-3">
          Calculated using Personal Year + current month, it shows the 
          <strong className="text-secondary-gradient"> specific energy and focus</strong> for each month within your personal year cycle.
        </p>
        <div className="path-card">
          <span className="path-description">
            Provides detailed monthly guidance for decision-making, timing of important events, and understanding monthly themes.
          </span>
        </div>
      </div>

      {/* Personal Day */}
      <div className="insight-card primary">
        <div className="flex items-center mb-3">
          <Star className="w-6 h-6 text-purple-400 mr-3" />
          <h3 className="text-primary-gradient font-bold text-lg">Personal Day Number</h3>
        </div>
        <p className="mb-3">
          Calculated using Personal Month + current date, it reveals the 
          <strong className="text-tertiary-gradient"> daily energy and opportunities</strong> available to you each day.
        </p>
        <div className="path-card">
          <span className="path-description">
            Perfect for daily planning, understanding mood patterns, and choosing optimal timing for activities and decisions.
          </span>
        </div>
      </div>

      <div className="insight-card cosmic">
        <p className="font-semibold text-white text-center">
          🔄 These cycles work together like cosmic clockwork, helping you align with natural rhythms and maximize your potential!
        </p>
      </div>
    </div>
  </div>
);

const Home = ({ formData, onInputChange, onSubmit }) => {
  const [activeSection, setActiveSection] = useState('all');

  return (
    <div className="bg-gradient-cosmic" style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1400px', margin: 'auto' }}>
        
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-cosmic-gradient mb-4 text-shadow-professional">
            {/* 🔮 Mystic Numerology Portals */}
            🔮NumPath: A Mystic Numerology Portal
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {/* Unlock the ancient wisdom of numbers and discover your true cosmic blueprint */}
            Every Number whispers a story - Find yours
          </p>
        </div>

        {/* FORM AT TOP - Most Visible Position */}
        <CompactFormSection 
          formData={formData}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
        />

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { key: 'all', label: '🌟 All Sections' },
            { key: 'what', label: '❓ What is Numerology' },
            { key: 'why', label: '⭐ Why Important' },
            { key: 'lifepath', label: '🛤️ Life Path' },
            { key: 'birth', label: '📅 Birth Number' },
            { key: 'destiny', label: '🎯 Destiny Number' },
            { key: 'cycles', label: '🔄 Personal Cycles' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`btn-outline ${activeSection === tab.key ? 'bg-purple-500/20' : ''} text-sm px-3 py-2`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {(activeSection === 'all' || activeSection === 'what') && <WhatIsNumerologySection />}
          {(activeSection === 'all' || activeSection === 'why') && <WhyNumerologyImportantSection />}
          {(activeSection === 'all' || activeSection === 'lifepath') && <LifePathSection />}
          {(activeSection === 'all' || activeSection === 'birth') && <BirthNumberSection />}
          {(activeSection === 'all' || activeSection === 'destiny') && <DestinyNumberSection />}
          {(activeSection === 'all' || activeSection === 'cycles') && <PersonalCyclesSection />}
        </div>
      </div>
    </div>
  );
};

export default Home;