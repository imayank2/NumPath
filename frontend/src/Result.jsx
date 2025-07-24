import React from 'react';
import { ChevronLeft, Star, Calendar, User } from 'lucide-react';
import './App.css';

const Result = ({ formData, onBack }) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const reduceToSingleDigit = (num) => {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
  };

  const calculateBirthNumber = (day) => reduceToSingleDigit(parseInt(day));
  const calculateLifePathNumber = (day, month, year) =>
    reduceToSingleDigit(parseInt(day) + parseInt(month) + parseInt(year));
  const calculatePersonalYear = (day, month, year) =>
    reduceToSingleDigit(parseInt(day) + parseInt(month) + year);
  const calculatePersonalMonth = (year, month) => reduceToSingleDigit(year + month);
  const calculatePersonalDay = (month, day) => reduceToSingleDigit(month + day);

  const getZodiacSign = (day, month) => {
    const signs = [
      'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini',
      'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'
    ];
    const cutoff = [20, 19, 20, 20, 21, 21, 23, 23, 23, 23, 22, 22];
    return day <= cutoff[month - 1]
      ? signs[(month + 10) % 12]
      : signs[month - 1];
  };

  const getDescription = (num) => {
    const map = {
      6: 'The Nurturer - Caring, responsible, family-oriented. Natural healers and caretakers who serve others with love.',
      11: 'The Intuitive - Highly spiritual, inspirational, visionary. Master number with powerful intuition and psychic abilities.',
      // Add other numbers if needed
    };
    return map[num] || 'Description coming soon.';
  };

  // Final Calculations
  const birthNumber = calculateBirthNumber(formData.day);
  const lifePathNumber = calculateLifePathNumber(formData.day, formData.month, formData.year);
  const personalYear = calculatePersonalYear(formData.day, formData.month, currentYear);
  const personalMonth = calculatePersonalMonth(personalYear, currentMonth);
  const personalDay = calculatePersonalDay(personalMonth, currentDay);
  const zodiac = getZodiacSign(parseInt(formData.day), parseInt(formData.month));

  return (
    <div className="result-container">
      <div className="result-content">
        <button onClick={onBack} className="back-button">
          <ChevronLeft size={18} /> Back to Calculator
        </button>

        <div className="result-header">
          <h1 className="result-title">Numerology Report</h1>
          <p className="result-subtitle">for {formData.name}</p>
        </div>

        <div className="results-grid">
          <div className="result-card core-numbers-card">
            <div className="card-header">
              <div className="icon-container"><Star /></div>
              <div className="card-title">Core Numbers</div>
            </div>
            <div className="number-row">
              <span className="number-label">Birth Number:</span>
              <span className="number-value primary">{birthNumber}</span>
            </div>
            <div className="number-row">
              <span className="number-label">Life Path Number:</span>
              <span className="number-value primary master-number">{lifePathNumber}</span>
            </div>
            <div className="number-row">
              <span className="number-label">Personal Year:</span>
              <span className="number-value primary">{personalYear}</span>
            </div>
          </div>

          <div className="result-card current-cycle-card">
            <div className="card-header">
              <div className="icon-container"><Calendar /></div>
              <div className="card-title">Current Cycle</div>
            </div>
            <div className="number-row">
              <span className="number-label">Personal Month:</span>
              <span className="number-value secondary">{personalMonth}</span>
            </div>
            <div className="number-row">
              <span className="number-label">Personal Day:</span>
              <span className="number-value secondary">{personalDay}</span>
            </div>
            <div className="number-row">
              <span className="number-label">Zodiac Sign:</span>
              <span className="number-value tertiary">{zodiac}</span>
            </div>
          </div>
        </div>

        <div className="result-card insights-card">
          <div className="card-header">
            <div className="icon-container"><User /></div>
            <div className="card-title">Life Path Insights</div>
          </div>
          <div className="insight-section birth-insight">
            <h4 className="insight-title birth">Birth Number {birthNumber}</h4>
            <p className="insight-description">{getDescription(birthNumber)}</p>
          </div>
          <div className="insight-section lifepath-insight">
            <h4 className="insight-title lifepath">Life Path Number {lifePathNumber}</h4>
            <p className="insight-description">{getDescription(lifePathNumber)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
