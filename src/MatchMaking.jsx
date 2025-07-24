import React, { useState } from 'react';
import { Heart, Users, Calendar, User, Sparkles, ArrowRight, Star, MapPin } from 'lucide-react';
    const MatchMaking = () => {
  const [currentPage, setCurrentPage] = useState('input'); // 'input' or 'result'
  const [maleDetails, setMaleDetails] = useState({
    name: '',
    birthDate: '',
    birthMonth: '',
    birthYear: '',
    birthCity: ''
  });
  const [femaleDetails, setFemaleDetails] = useState({
    name: '',
    birthDate: '',
    birthMonth: '',
    birthYear: '',
    birthCity: ''
  });
  const [compatibilityResult, setCompatibilityResult] = useState(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Function to calculate zodiac sign based on birth date and month
  const calculateZodiacSign = (day, month) => {
    const date = parseInt(day);
    const monthIndex = months.indexOf(month);
    
    if (!date || monthIndex === -1) return '';
    
    const zodiacData = [
      { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
      { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
      { sign: 'Pisces', start: [2, 19], end: [3, 20] },
      { sign: 'Aries', start: [3, 21], end: [4, 19] },
      { sign: 'Taurus', start: [4, 20], end: [5, 20] },
      { sign: 'Gemini', start: [5, 21], end: [6, 20] },
      { sign: 'Cancer', start: [6, 21], end: [7, 22] },
      { sign: 'Leo', start: [7, 23], end: [8, 22] },
      { sign: 'Virgo', start: [8, 23], end: [9, 22] },
      { sign: 'Libra', start: [9, 23], end: [10, 22] },
      { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
      { sign: 'Sagittarius', start: [11, 22], end: [12, 21] }
    ];

    for (let zodiac of zodiacData) {
      if (zodiac.sign === 'Capricorn') {
        // Special case for Capricorn (spans across two months)
        if ((monthIndex + 1 === 12 && date >= 22) || (monthIndex + 1 === 1 && date <= 19)) {
          return zodiac.sign;
        }
      } else {
        const startMonth = zodiac.start[0];
        const startDay = zodiac.start[1];
        const endMonth = zodiac.end[0];
        const endDay = zodiac.end[1];
        
        if ((monthIndex + 1 === startMonth && date >= startDay) || 
            (monthIndex + 1 === endMonth && date <= endDay)) {
          return zodiac.sign;
        }
      }
    }
    return '';
  };

  const calculateCompatibility = () => {
    // Calculate zodiac signs automatically
    const maleZodiac = calculateZodiacSign(maleDetails.birthDate, maleDetails.birthMonth);
    const femaleZodiac = calculateZodiacSign(femaleDetails.birthDate, femaleDetails.birthMonth);

    // Simple compatibility algorithm based on various factors
    let score = 0;
    let factors = [];

    // Name compatibility (based on first letter)
    const maleFirstLetter = maleDetails.name.charAt(0).toLowerCase();
    const femaleFirstLetter = femaleDetails.name.charAt(0).toLowerCase();
    const letterScore = Math.abs(maleFirstLetter.charCodeAt(0) - femaleFirstLetter.charCodeAt(0));
    const nameCompatibility = Math.max(20, 100 - letterScore * 3);
    score += nameCompatibility * 0.2;
    factors.push({ name: 'Name Harmony', score: Math.round(nameCompatibility), description: 'Based on numerological name analysis' });

    // Birth date compatibility
    const maleBirthNum = parseInt(maleDetails.birthDate) || 1;
    const femaleBirthNum = parseInt(femaleDetails.birthDate) || 1;
    const dateCompatibility = Math.max(60, 100 - Math.abs(maleBirthNum - femaleBirthNum) * 5);
    score += dateCompatibility * 0.25;
    factors.push({ name: 'Birth Date Synchrony', score: Math.round(dateCompatibility), description: 'Alignment of birth dates and life paths' });

    // Zodiac compatibility (simplified)
    const zodiacCompat = getZodiacCompatibility(maleZodiac, femaleZodiac);
    score += zodiacCompat * 0.3;
    factors.push({ name: 'Zodiac Alignment', score: Math.round(zodiacCompat), description: `${maleZodiac} & ${femaleZodiac} astrological compatibility` });

    // Age compatibility
    const maleAge = new Date().getFullYear() - parseInt(maleDetails.birthYear);
    const femaleAge = new Date().getFullYear() - parseInt(femaleDetails.birthYear);
    const ageDiff = Math.abs(maleAge - femaleAge);
    const ageCompatibility = Math.max(70, 100 - ageDiff * 2);
    score += ageCompatibility * 0.15;
    factors.push({ name: 'Age Harmony', score: Math.round(ageCompatibility), description: 'Life stage and maturity alignment' });

    // Birth city compatibility (geographical harmony)
    if (maleDetails.birthCity && femaleDetails.birthCity) {
      const cityCompatibility = maleDetails.birthCity.toLowerCase().trim() === femaleDetails.birthCity.toLowerCase().trim() 
        ? 95 
        : Math.max(60, 90 - Math.abs(maleDetails.birthCity.length - femaleDetails.birthCity.length) * 2);
      score += cityCompatibility * 0.1;
      factors.push({ name: 'Geographical Harmony', score: Math.round(cityCompatibility), description: 'Cultural and environmental alignment' });
    }

    const finalScore = Math.round(score);
    const compatibility = getCompatibilityLevel(finalScore);

    setCompatibilityResult({
      score: finalScore,
      level: compatibility.level,
      message: compatibility.message,
      factors: factors,
      advice: getCompatibilityAdvice(finalScore),
      maleZodiac: maleZodiac,
      femaleZodiac: femaleZodiac
    });

    setCurrentPage('result');
  };

  const getZodiacCompatibility = (sign1, sign2) => {
    const compatibilityMatrix = {
      'Aries': { 'Leo': 95, 'Sagittarius': 90, 'Gemini': 85, 'Aquarius': 80, 'Libra': 75 },
      'Taurus': { 'Virgo': 95, 'Capricorn': 90, 'Cancer': 85, 'Pisces': 80, 'Scorpio': 75 },
      'Gemini': { 'Libra': 95, 'Aquarius': 90, 'Aries': 85, 'Leo': 80, 'Sagittarius': 75 },
      'Cancer': { 'Scorpio': 95, 'Pisces': 90, 'Taurus': 85, 'Virgo': 80, 'Capricorn': 75 },
      'Leo': { 'Aries': 95, 'Sagittarius': 90, 'Gemini': 85, 'Libra': 80, 'Aquarius': 75 },
      'Virgo': { 'Taurus': 95, 'Capricorn': 90, 'Cancer': 85, 'Scorpio': 80, 'Pisces': 75 },
      'Libra': { 'Gemini': 95, 'Aquarius': 90, 'Leo': 85, 'Aries': 80, 'Sagittarius': 75 },
      'Scorpio': { 'Cancer': 95, 'Pisces': 90, 'Virgo': 85, 'Taurus': 80, 'Capricorn': 75 },
      'Sagittarius': { 'Leo': 95, 'Aries': 90, 'Libra': 85, 'Gemini': 80, 'Aquarius': 75 },
      'Capricorn': { 'Virgo': 95, 'Taurus': 90, 'Scorpio': 85, 'Cancer': 80, 'Pisces': 75 },
      'Aquarius': { 'Libra': 95, 'Gemini': 90, 'Sagittarius': 85, 'Leo': 80, 'Aries': 75 },
      'Pisces': { 'Scorpio': 95, 'Cancer': 90, 'Capricorn': 85, 'Virgo': 80, 'Taurus': 75 }
    };

    return (compatibilityMatrix[sign1]?.[sign2] || 
            compatibilityMatrix[sign2]?.[sign1] || 
            70 + Math.random() * 20);
  };

  const getCompatibilityLevel = (score) => {
    if (score >= 90) return { level: 'Excellent', message: 'A match made in heaven! Your souls are deeply connected.' };
    if (score >= 80) return { level: 'Very Good', message: 'Strong compatibility with great potential for lasting love.' };
    if (score >= 70) return { level: 'Good', message: 'Good compatibility with room for beautiful growth together.' };
    if (score >= 60) return { level: 'Fair', message: 'Moderate compatibility that can flourish with understanding.' };
    return { level: 'Challenging', message: 'Requires extra effort but love can overcome all obstacles.' };
  };

  const getCompatibilityAdvice = (score) => {
    if (score >= 90) return "Your connection is extraordinary. Nurture this beautiful bond with open communication and shared dreams.";
    if (score >= 80) return "You have a strong foundation. Focus on building trust and creating memorable experiences together.";
    if (score >= 70) return "Great potential lies ahead. Invest time in understanding each other's perspectives and values.";
    if (score >= 60) return "With patience and compromise, your relationship can blossom into something beautiful.";
    return "Every relationship has challenges. Focus on your strengths and work together to overcome differences.";
  };

  const InputForm = () => (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Heart className="text-pink-500 w-12 h-12 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              SoulMate: Mystic Compatibility Portal
            </h1>
          </div>
          <p className="text-xl text-gray-300">Discover your cosmic connection - Find your perfect match</p>
        </div>

        {/* Main Form */}
        <div className="bg-gray-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Sparkles className="text-yellow-400 w-8 h-8 mx-auto mb-4 animate-spin" />
            <h2 className="text-3xl font-bold text-white mb-2">Get Your Complete Compatibility Report</h2>
            <p className="text-gray-300 text-lg">Enter both partners' details below for cosmic analysis</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Male Details */}
            <div className="bg-gray-700/20 rounded-2xl p-6 border border-white/5 hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <User className="text-cyan-400 w-6 h-6" />
                <h3 className="text-xl font-semibold text-cyan-400">Male Partner Details</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    className="w-full p-3 bg-gray-800/60 border border-white/10 rounded-xl text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    value={maleDetails.name}
                    onChange={(e) => setMaleDetails({...maleDetails, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Birth Month</label>
                  <select
                    className="w-full p-3 bg-gray-800/60 border border-white/10 rounded-xl text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all cursor-pointer"
                    value={maleDetails.birthMonth}
                    onChange={(e) => setMaleDetails({...maleDetails, birthMonth: e.target.value})}
                  >
                    <option value="">Select Month</option>
                    {months.map((month) => (
                      <option key={month} value={month} className="bg-gray-800">{month}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Day</label>
                    <input
                      type="number"
                      placeholder="DD"
                      min="1"
                      max="31"
                      className="w-full p-3 bg-gray-800/60 border border-white/10 rounded-xl text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      value={maleDetails.birthDate}
                      onChange={(e) => setMaleDetails({...maleDetails, birthDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Year</label>
                    <input
                      type="number"
                      placeholder="YYYY"
                      min="1900"
                      max="2024"
                      className="w-full p-3 bg-gray-800/60 border border-white/10 rounded-xl text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      value={maleDetails.birthYear}
                      onChange={(e) => setMaleDetails({...maleDetails, birthYear: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Birth City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Enter birth city"
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-white/10 rounded-xl text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      value={maleDetails.birthCity}
                      onChange={(e) => setMaleDetails({...maleDetails, birthCity: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Female Details */}
            <div className="bg-gray-700/20 rounded-2xl p-6 border border-white/5 hover:border-pink-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <User className="text-pink-400 w-6 h-6" />
                <h3 className="text-xl font-semibold text-pink-400">Female Partner Details</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    className="w-full p-3 bg-gray-800/60 border border-white/10 rounded-xl text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                    value={femaleDetails.name}
                    onChange={(e) => setFemaleDetails({...femaleDetails, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Birth Month</label>
                  <select
                    className="w-full p-3 bg-gray-800/60 border border-white/10 rounded-xl text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all cursor-pointer"
                    value={femaleDetails.birthMonth}
                    onChange={(e) => setFemaleDetails({...femaleDetails, birthMonth: e.target.value})}
                  >
                    <option value="">Select Month</option>
                    {months.map((month) => (
                      <option key={month} value={month} className="bg-gray-800">{month}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Day</label>
                    <input
                      type="number"
                      placeholder="DD"
                      min="1"
                      max="31"
                      className="w-full p-3 bg-gray-800/60 border border-white/10 rounded-xl text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                      value={femaleDetails.birthDate}
                      onChange={(e) => setFemaleDetails({...femaleDetails, birthDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Year</label>
                    <input
                      type="number"
                      placeholder="YYYY"
                      min="1900"
                      max="2024"
                      className="w-full p-3 bg-gray-800/60 border border-white/10 rounded-xl text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                      value={femaleDetails.birthYear}
                      onChange={(e) => setFemaleDetails({...femaleDetails, birthYear: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Birth City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Enter birth city"
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-white/10 rounded-xl text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                      value={femaleDetails.birthCity}
                      onChange={(e) => setFemaleDetails({...femaleDetails, birthCity: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="text-center">
            <button
              onClick={calculateCompatibility}
              disabled={!maleDetails.name || !femaleDetails.name || !maleDetails.birthMonth || !femaleDetails.birthMonth || !maleDetails.birthDate || !femaleDetails.birthDate}
              className="flex items-center gap-3 mx-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <Sparkles className="w-6 h-6" />
              Calculate Compatibility
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ResultPage = () => (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Heart className="text-pink-500 w-12 h-12 animate-pulse" />
            <h1 className="text-4xl font-bold text-white">Compatibility Report</h1>
          </div>
          <p className="text-xl text-gray-300">
            {maleDetails.name} ({compatibilityResult?.maleZodiac}) & {femaleDetails.name} ({compatibilityResult?.femaleZodiac})
          </p>
        </div>

        {/* Main Result */}
        <div className="bg-gray-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl mb-8">
          <div className="text-center mb-8">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${compatibilityResult?.score * 3.51} 351`}
                  className="transition-all duration-2000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#ec4899'}} />
                    <stop offset="100%" style={{stopColor: '#8b5cf6'}} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  {compatibilityResult?.score}%
                </span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              {compatibilityResult?.level} Match!
            </h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {compatibilityResult?.message}
            </p>
          </div>

          {/* Compatibility Factors */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {compatibilityResult?.factors.map((factor, index) => (
              <div key={index} className="bg-gray-700/20 rounded-2xl p-6 border border-white/5 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-white">{factor.name}</h4>
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-400 w-5 h-5" />
                    <span className="text-cyan-400 font-bold">{factor.score}%</span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">{factor.description}</p>
                <div className="w-full bg-gray-600/30 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-1500 ease-out"
                    style={{ width: `${factor.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Advice Section */}
          <div className="bg-gradient-to-r from-pink-500/10 to-purple-600/10 rounded-2xl p-6 border border-pink-500/20">
            <h4 className="flex items-center gap-3 text-xl font-semibold text-white mb-4">
              <Heart className="text-pink-500 w-6 h-6" />
              Relationship Advice
            </h4>
            <p className="text-gray-200 text-lg leading-relaxed">
              {compatibilityResult?.advice}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setCurrentPage('input')}
            className="px-6 py-3 bg-gray-700/30 text-white font-semibold rounded-xl border border-white/10 hover:bg-gray-700/50 transition-all duration-300"
          >
            Calculate Another Match
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            Save Report
          </button>
        </div>
      </div>
    </div>
  );

  return currentPage === 'input' ? <InputForm /> : <ResultPage />;
};

export default MatchMaking;