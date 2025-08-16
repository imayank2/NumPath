// import React from 'react';
// import { Heart, Star, Crown, Zap, ArrowLeft, Calculator, TrendingUp } from 'lucide-react';

// export default function AccurateResultPage({ malePartner, femalePartner, onReset }) {
  
//   // Function to calculate Life Path Number (Numerology)
//   const calculateLifePathNumber = (date) => {
//     if (!date) return 1; // Default fallback
//     const dateStr = date.toString().replace(/-/g, '');
//     let sum = 0;
//     for (let i = 0; i < dateStr.length; i++) {
//       const digit = parseInt(dateStr[i]);
//       if (!isNaN(digit)) {
//         sum += digit;
//       }
//     }
//     while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
//       const digits = sum.toString().split('');
//       sum = digits.reduce((a, b) => parseInt(a) + parseInt(b), 0);
//     }
//     return sum;
//   };

//   // Function to get zodiac sign from birth date
//   const getZodiacSign = (date) => {
//     if (!date) return { name: 'Aries', element: 'Fire' }; // Default fallback
//     const dateParts = date.toString().split('-');
//     if (dateParts.length < 3) return { name: 'Aries', element: 'Fire' };
    
//     const month = parseInt(dateParts[1]);
//     const day = parseInt(dateParts[2]);
    
//     const signs = [
//       { name: 'Aquarius', start: [1, 20], end: [2, 18], element: 'Air' },
//       { name: 'Pisces', start: [2, 19], end: [3, 20], element: 'Water' },
//       { name: 'Aries', start: [3, 21], end: [4, 19], element: 'Fire' },
//       { name: 'Taurus', start: [4, 20], end: [5, 20], element: 'Earth' },
//       { name: 'Gemini', start: [5, 21], end: [6, 20], element: 'Air' },
//       { name: 'Cancer', start: [6, 21], end: [7, 22], element: 'Water' },
//       { name: 'Leo', start: [7, 23], end: [8, 22], element: 'Fire' },
//       { name: 'Virgo', start: [8, 23], end: [9, 22], element: 'Earth' },
//       { name: 'Libra', start: [9, 23], end: [10, 22], element: 'Air' },
//       { name: 'Scorpio', start: [10, 23], end: [11, 21], element: 'Water' },
//       { name: 'Sagittarius', start: [11, 22], end: [12, 21], element: 'Fire' },
//       { name: 'Capricorn', start: [12, 22], end: [1, 19], element: 'Earth' }
//     ];

//     for (let sign of signs) {
//       if (sign.name === 'Capricorn') {
//         if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
//           return sign;
//         }
//       } else if (sign.name === 'Aquarius') {
//         if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
//           return sign;
//         }
//       } else {
//         const [startMonth, startDay] = sign.start;
//         const [endMonth, endDay] = sign.end;
//         if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
//           return sign;
//         }
//       }
//     }
//     return signs[0];
//   };

//   // Calculate compatibility based on multiple factors
//   const calculateAccurateCompatibility = () => {
//     // Validate input data
//     if (!malePartner?.birthDate || !femalePartner?.birthDate) {
//       return {
//         overallScore: 75,
//         factors: [{
//           name: 'Basic Compatibility',
//           description: 'General compatibility assessment',
//           score: 75,
//           insight: 'Unable to perform detailed analysis without complete birth date information'
//         }],
//         maleData: { lifePathNumber: 1, zodiacSign: { name: 'Aries', element: 'Fire' } },
//         femaleData: { lifePathNumber: 1, zodiacSign: { name: 'Aries', element: 'Fire' } }
//       };
//     }

//     const male = {
//       birthDate: malePartner.birthDate,
//       lifePathNumber: calculateLifePathNumber(malePartner.birthDate),
//       zodiacSign: getZodiacSign(malePartner.birthDate)
//     };
    
//     const female = {
//       birthDate: femalePartner.birthDate,
//       lifePathNumber: calculateLifePathNumber(femalePartner.birthDate),
//       zodiacSign: getZodiacSign(femalePartner.birthDate)
//     };

//     let totalScore = 0;
//     let factors = [];

//     // 1. Life Path Number Compatibility (40% weight)
//     const lifePathCompatibility = getLifePathCompatibility(male.lifePathNumber, female.lifePathNumber);
//     totalScore += lifePathCompatibility.score * 0.4;
//     factors.push({
//       name: 'Life Path Numbers',
//       description: `${male.lifePathNumber} & ${female.lifePathNumber}`,
//       score: lifePathCompatibility.score,
//       insight: lifePathCompatibility.insight
//     });

//     // 2. Zodiac Element Compatibility (35% weight)
//     const elementCompatibility = getElementCompatibility(male.zodiacSign.element, female.zodiacSign.element);
//     totalScore += elementCompatibility.score * 0.35;
//     factors.push({
//       name: 'Zodiac Elements',
//       description: `${male.zodiacSign.element} & ${female.zodiacSign.element}`,
//       score: elementCompatibility.score,
//       insight: elementCompatibility.insight
//     });

//     // 3. Zodiac Sign Compatibility (25% weight)
//     const signCompatibility = getZodiacCompatibility(male.zodiacSign.name, female.zodiacSign.name);
//     totalScore += signCompatibility.score * 0.25;
//     factors.push({
//       name: 'Zodiac Signs',
//       description: `${male.zodiacSign.name} & ${female.zodiacSign.name}`,
//       score: signCompatibility.score,
//       insight: signCompatibility.insight
//     });

//     return {
//       overallScore: Math.round(totalScore),
//       factors: factors,
//       maleData: male,
//       femaleData: female
//     };
//   };

//   // Life Path Number Compatibility Matrix
//   const getLifePathCompatibility = (num1, num2) => {
//     const compatibility = {
//       '1': { '1': 70, '2': 85, '3': 90, '4': 60, '5': 80, '6': 75, '7': 65, '8': 85, '9': 80 },
//       '2': { '1': 85, '2': 75, '3': 80, '4': 90, '5': 70, '6': 95, '7': 80, '8': 85, '9': 85 },
//       '3': { '1': 90, '2': 80, '3': 85, '4': 65, '5': 95, '6': 80, '7': 75, '8': 70, '9': 90 },
//       '4': { '1': 60, '2': 90, '3': 65, '4': 80, '5': 60, '6': 85, '7': 70, '8': 95, '9': 70 },
//       '5': { '1': 80, '2': 70, '3': 95, '4': 60, '5': 75, '6': 70, '7': 85, '8': 75, '9': 85 },
//       '6': { '1': 75, '2': 95, '3': 80, '4': 85, '5': 70, '6': 80, '7': 75, '8': 80, '9': 95 },
//       '7': { '1': 65, '2': 80, '3': 75, '4': 70, '5': 85, '6': 75, '7': 85, '8': 65, '9': 80 },
//       '8': { '1': 85, '2': 85, '3': 70, '4': 95, '5': 75, '6': 80, '7': 65, '8': 80, '9': 75 },
//       '9': { '1': 80, '2': 85, '3': 90, '4': 70, '5': 85, '6': 95, '7': 80, '8': 75, '9': 85 }
//     };

//     const score = compatibility[num1.toString()]?.[num2.toString()] || 70;
    
//     const insights = {
//       95: "Perfect numerological harmony - your life paths complement each other beautifully",
//       90: "Excellent compatibility - you share similar life goals and values",
//       85: "Great connection - your energies flow well together",
//       80: "Good compatibility - you balance each other's strengths and weaknesses",
//       75: "Decent match - with understanding, you can build a strong relationship",
//       70: "Moderate compatibility - requires effort but can work well",
//       65: "Challenging but possible - you'll need patience and communication",
//       60: "Different paths - growth through understanding each other's differences"
//     };

//     return {
//       score,
//       insight: insights[score] || insights[70]
//     };
//   };

//   // Element Compatibility
//   const getElementCompatibility = (element1, element2) => {
//     const compatibility = {
//       'Fire': { 'Fire': 85, 'Earth': 70, 'Air': 95, 'Water': 60 },
//       'Earth': { 'Fire': 70, 'Earth': 80, 'Air': 65, 'Water': 90 },
//       'Air': { 'Fire': 95, 'Earth': 65, 'Air': 85, 'Water': 75 },
//       'Water': { 'Fire': 60, 'Earth': 90, 'Air': 75, 'Water': 85 }
//     };

//     const score = compatibility[element1][element2];
    
//     const insights = {
//       95: "Explosive chemistry - you ignite each other's passions and dreams",
//       90: "Deep emotional connection - you understand each other intuitively",
//       85: "Strong attraction - similar energy levels and approaches to life",
//       80: "Stable foundation - you ground each other perfectly",
//       75: "Balanced relationship - you complement each other's differences",
//       70: "Steady connection - requires patience but very rewarding",
//       65: "Different approaches - can learn a lot from each other",
//       60: "Opposing energies - challenges that can lead to tremendous growth"
//     };

//     return {
//       score,
//       insight: insights[score]
//     };
//   };

//   // Basic Zodiac Compatibility
//   const getZodiacCompatibility = (sign1, sign2) => {
//     // Simplified compatibility based on traditional astrology
//     const highCompatible = ['Aries-Leo', 'Aries-Sagittarius', 'Taurus-Virgo', 'Taurus-Capricorn', 
//                           'Gemini-Libra', 'Gemini-Aquarius', 'Cancer-Scorpio', 'Cancer-Pisces',
//                           'Leo-Sagittarius', 'Virgo-Capricorn', 'Libra-Aquarius', 'Scorpio-Pisces'];
    
//     const pair = `${sign1}-${sign2}`;
//     const reversePair = `${sign2}-${sign1}`;
    
//     let score = 75; // Default
//     let insight = "Moderate compatibility - every relationship has its unique dynamics";
    
//     if (highCompatible.includes(pair) || highCompatible.includes(reversePair)) {
//       score = 90;
//       insight = "Excellent zodiac harmony - your signs naturally understand each other";
//     } else if (sign1 === sign2) {
//       score = 80;
//       insight = "Same sign connection - you share similar traits and understand each other well";
//     }

//     return { score, insight };
//   };

//   const compatibilityData = calculateAccurateCompatibility();

//   const getScoreMessage = (score) => {
//     if (score >= 90) return "Perfect Cosmic Match!";
//     if (score >= 85) return "Excellent Compatibility!";
//     if (score >= 80) return "Very Strong Connection!";
//     if (score >= 75) return "Great Compatibility!";
//     if (score >= 70) return "Good Match!";
//     return "Moderate Compatibility!";
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #fde68a 0%, #fbbf24 25%, #f59e0b 50%, #d97706 100%)',
//       position: 'relative',
//       overflow: 'hidden',
//       fontFamily: 'Arial, sans-serif'
//     }}>
      
//       {/* Animated Background */}
//       <div style={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         overflow: 'hidden',
//         zIndex: 0
//       }}>
//         <div style={{
//           position: 'absolute',
//           width: '300px',
//           height: '300px',
//           top: '-150px',
//           right: '-150px',
//           borderRadius: '50%',
//           background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.15))',
//           animation: 'float 6s ease-in-out infinite'
//         }}></div>
//         <div style={{
//           position: 'absolute',
//           width: '200px',
//           height: '200px',
//           bottom: '-100px',
//           left: '-100px',
//           borderRadius: '50%',
//           background: 'linear-gradient(45deg, rgba(255, 193, 7, 0.2), rgba(255, 152, 0, 0.15))',
//           animation: 'float 6s ease-in-out infinite 2s'
//         }}></div>
//         <div style={{
//           position: 'absolute',
//           width: '250px',
//           height: '250px',
//           top: '50%',
//           left: '-125px',
//           borderRadius: '50%',
//           background: 'linear-gradient(45deg, rgba(255, 235, 59, 0.15), rgba(255, 193, 7, 0.15))',
//           animation: 'float 6s ease-in-out infinite 4s'
//         }}></div>
//         <div style={{
//           position: 'absolute',
//           width: '180px',
//           height: '180px',
//           bottom: '20%',
//           right: '-90px',
//           borderRadius: '50%',
//           background: 'linear-gradient(45deg, rgba(255, 241, 118, 0.15), rgba(255, 215, 0, 0.15))',
//           animation: 'float 6s ease-in-out infinite 1s'
//         }}></div>
//       </div>

//       {/* Content */}
//       <div style={{
//         position: 'relative',
//         zIndex: 1,
//         padding: '2rem',
//         maxWidth: '1000px',
//         margin: '0 auto'
//       }}>
        
//         {/* Header */}
//         <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
//           <Crown style={{
//             color: '#b45309',
//             width: '3rem',
//             height: '3rem',
//             marginBottom: '1rem',
//             filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))'
//           }} />
//           <h1 style={{
//             fontSize: '3rem',
//             fontWeight: 'bold',
//             color: '#b45309',
//             textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
//             margin: '0 0 1rem 0'
//           }}>
//             Cosmic Compatibility Report
//           </h1>
//           <p style={{
//             fontSize: '1.3rem',
//             color: '#b45309',
//             fontWeight: 600,
//             margin: 0,
//             textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
//           }}>
//             {malePartner.fullName} & {femalePartner.fullName}
//           </p>
//         </div>

//         {/* Main Card */}
//         <div style={{
//           background: 'rgba(255, 255, 255, 0.15)',
//           backdropFilter: 'blur(20px)',
//           borderRadius: '2rem',
//           padding: '3rem',
//           border: '2px solid rgba(255, 215, 0, 0.3)',
//           boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
//         }}>
          
//           {/* Score Section */}
//           <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
//             <div style={{
//               fontSize: '6rem',
//               marginBottom: '1rem',
//               filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))'
//             }}>
//               ✨
//             </div>
//             <div style={{
//               background: 'linear-gradient(135deg, #ffd700 0%, #ffb347 100%)',
//               borderRadius: '2rem',
//               padding: '2rem',
//               border: '3px solid rgba(255, 215, 0, 0.6)',
//               boxShadow: 'inset 0 2px 10px rgba(255, 255, 255, 0.3)'
//             }}>
//               <h2 style={{
//                 fontSize: '4rem',
//                 fontWeight: 'bold',
//                 color: '#b45309',
//                 textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
//                 margin: '0 0 0.5rem 0'
//               }}>
//                 {compatibilityData.overallScore}%
//               </h2>
//               <p style={{
//                 fontSize: '1.5rem',
//                 color: '#b45309',
//                 fontWeight: 600,
//                 textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
//                 margin: 0
//               }}>
//                 {getScoreMessage(compatibilityData.overallScore)}
//               </p>
//             </div>
//           </div>

//           {/* Insights Section */}
//           <div style={{ marginBottom: '2rem' }}>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: '1rem',
//               marginBottom: '2rem'
//             }}>
//               <Star style={{ color: '#d97706', width: '2rem', height: '2rem' }} />
//               <h3 style={{
//                 color: '#b45309',
//                 fontSize: '1.8rem',
//                 fontWeight: 600,
//                 margin: 0,
//                 textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
//               }}>
//                 Mystical Analysis
//               </h3>
//             </div>
//             <div style={{
//               display: 'grid',
//               gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//               gap: '1rem'
//             }}>
//               {compatibilityData.factors.map((factor, index) => (
//                 <div key={index} style={{
//                   background: 'rgba(255, 255, 255, 0.2)',
//                   padding: '1.5rem',
//                   borderRadius: '1rem',
//                   border: '1px solid rgba(255, 215, 0, 0.3)',
//                   transition: 'transform 0.3s ease'
//                 }}>
//                   <div style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '1rem',
//                     marginBottom: '0.5rem'
//                   }}>
//                     <span style={{ fontSize: '1.5rem' }}>⭐</span>
//                     <div>
//                       <h4 style={{
//                         color: '#b45309',
//                         fontSize: '1rem',
//                         fontWeight: 600,
//                         margin: 0
//                       }}>
//                         {factor.name} ({factor.score}%)
//                       </h4>
//                       <p style={{
//                         color: '#b45309',
//                         fontSize: '0.9rem',
//                         margin: '0.25rem 0'
//                       }}>
//                         {factor.description}
//                       </p>
//                     </div>
//                   </div>
//                   <p style={{
//                     color: '#b45309',
//                     fontSize: '0.85rem',
//                     fontWeight: 500,
//                     margin: 0,
//                     fontStyle: 'italic'
//                   }}>
//                     {factor.insight}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Message Section */}
//           <div style={{
//             background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 215, 0, 0.2) 100%)',
//             borderRadius: '1.5rem',
//             padding: '2rem',
//             textAlign: 'center',
//             marginBottom: '2rem',
//             border: '2px solid rgba(255, 215, 0, 0.3)'
//           }}>
//             <Zap style={{
//               color: '#d97706',
//               width: '2.5rem',
//               height: '2.5rem',
//               marginBottom: '1rem'
//             }} />
//             <h4 style={{
//               color: '#b45309',
//               fontSize: '1.5rem',
//               fontWeight: 600,
//               marginBottom: '1rem',
//               textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
//             }}>
//               The Universe Has Spoken!
//             </h4>
//             <p style={{
//               color: '#b45309',
//               fontSize: '1.1rem',
//               lineHeight: 1.6,
//               fontWeight: 500,
//               margin: 0
//             }}>
//               Your compatibility analysis reveals a {compatibilityData.overallScore >= 80 ? 'remarkably strong' : compatibilityData.overallScore >= 70 ? 'promising' : 'moderate'} connection. 
//               The cosmic forces have aligned your life path numbers ({compatibilityData.maleData.lifePathNumber} & {compatibilityData.femaleData.lifePathNumber}) 
//               and elemental energies ({compatibilityData.maleData.zodiacSign.element} & {compatibilityData.femaleData.zodiacSign.element}) 
//               in a way that {compatibilityData.overallScore >= 80 ? 'creates natural harmony and deep understanding' : 'offers opportunities for growth and connection'}.
//               Remember, true compatibility goes beyond numbers - it's built through love, understanding, and shared experiences.
//             </p>
//           </div>

//           {/* Action Button */}
//           <div style={{
//             display: 'flex',
//             justifyContent: 'center',
//             gap: '1rem',
//             flexWrap: 'wrap'
//           }}>
//             <button 
//               onClick={onReset}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.5rem',
//                 padding: '1rem 1.5rem',
//                 border: '2px solid #fbbf24',
//                 borderRadius: '1rem',
//                 fontSize: '1rem',
//                 fontWeight: 600,
//                 cursor: 'pointer',
//                 background: 'linear-gradient(135deg, #92400e 0%, #b45309 100%)',
//                 color: '#fbbf24',
//                 textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
//                 transition: 'all 0.3s ease'
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.transform = 'translateY(-2px)';
//                 e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.transform = 'translateY(0)';
//                 e.target.style.boxShadow = 'none';
//               }}
//             >
//               <ArrowLeft style={{ width: '1.25rem', height: '1.25rem' }} />
//               Calculate Another Match
//             </button>
//           </div>
//         </div>

//         {/* Disclaimer */}
//         <div style={{ textAlign: 'center', marginTop: '2rem' }}>
//           <p style={{
//             color: '#b45309',
//             fontSize: '0.9rem',
//             fontWeight: 500
//           }}>
//             * This compatibility analysis is based on numerology and astrological principles for entertainment purposes.
//           </p>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes float {
//           0%, 100% {
//             transform: translateY(0px) rotate(0deg);
//             opacity: 0.7;
//           }
//           50% {
//             transform: translateY(-20px) rotate(180deg);
//             opacity: 1;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }



import React from 'react';
import { Heart, Star, Crown, Zap, ArrowLeft, Calculator, TrendingUp } from 'lucide-react';

export default function AccurateResultPage({ malePartner, femalePartner, onReset }) {
  
  // Function to calculate Life Path Number (Numerology)
  const calculateLifePathNumber = (date) => {
    if (!date) return Math.floor(Math.random() * 9) + 1; // Random fallback instead of always 1
    const dateStr = date.toString().replace(/-/g, '');
    let sum = 0;
    for (let i = 0; i < dateStr.length; i++) {
      const digit = parseInt(dateStr[i]);
      if (!isNaN(digit)) {
        sum += digit;
      }
    }
    // Proper reduction to single digit (except master numbers)
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      const digits = sum.toString().split('');
      sum = digits.reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }
    return sum;
  };

  // Function to get zodiac sign from birth date
  const getZodiacSign = (date) => {
    if (!date) {
      // Return random zodiac sign instead of always Aries
      const randomSigns = [
        { name: 'Aries', element: 'Fire' },
        { name: 'Taurus', element: 'Earth' },
        { name: 'Gemini', element: 'Air' },
        { name: 'Cancer', element: 'Water' },
        { name: 'Leo', element: 'Fire' },
        { name: 'Virgo', element: 'Earth' },
        { name: 'Libra', element: 'Air' },
        { name: 'Scorpio', element: 'Water' },
        { name: 'Sagittarius', element: 'Fire' },
        { name: 'Capricorn', element: 'Earth' },
        { name: 'Aquarius', element: 'Air' },
        { name: 'Pisces', element: 'Water' }
      ];
      return randomSigns[Math.floor(Math.random() * randomSigns.length)];
    }
    
    const dateParts = date.toString().split('-');
    if (dateParts.length < 3) return { name: 'Aries', element: 'Fire' };
    
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);
    
    // Fixed zodiac calculation with proper date ranges
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { name: 'Capricorn', element: 'Earth' };
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { name: 'Aquarius', element: 'Air' };
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return { name: 'Pisces', element: 'Water' };
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { name: 'Aries', element: 'Fire' };
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { name: 'Taurus', element: 'Earth' };
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { name: 'Gemini', element: 'Air' };
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { name: 'Cancer', element: 'Water' };
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { name: 'Leo', element: 'Fire' };
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { name: 'Virgo', element: 'Earth' };
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { name: 'Libra', element: 'Air' };
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { name: 'Scorpio', element: 'Water' };
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { name: 'Sagittarius', element: 'Fire' };
    
    return { name: 'Aries', element: 'Fire' }; // fallback
  };

  // Calculate compatibility based on multiple factors
  const calculateAccurateCompatibility = () => {
    const male = {
      birthDate: malePartner?.birthDate,
      lifePathNumber: calculateLifePathNumber(malePartner?.birthDate),
      zodiacSign: getZodiacSign(malePartner?.birthDate)
    };
    
    const female = {
      birthDate: femalePartner?.birthDate,
      lifePathNumber: calculateLifePathNumber(femalePartner?.birthDate),
      zodiacSign: getZodiacSign(femalePartner?.birthDate)
    };

    let totalScore = 0;
    let factors = [];

    // 1. Life Path Number Compatibility (40% weight)
    const lifePathCompatibility = getLifePathCompatibility(male.lifePathNumber, female.lifePathNumber);
    totalScore += lifePathCompatibility.score * 0.4;
    factors.push({
      name: 'Life Path Numbers',
      description: `${male.lifePathNumber} & ${female.lifePathNumber}`,
      score: lifePathCompatibility.score,
      insight: lifePathCompatibility.insight
    });

    // 2. Zodiac Element Compatibility (35% weight)
    const elementCompatibility = getElementCompatibility(male.zodiacSign.element, female.zodiacSign.element);
    totalScore += elementCompatibility.score * 0.35;
    factors.push({
      name: 'Zodiac Elements',
      description: `${male.zodiacSign.element} & ${female.zodiacSign.element}`,
      score: elementCompatibility.score,
      insight: elementCompatibility.insight
    });

    // 3. Zodiac Sign Compatibility (25% weight)
    const signCompatibility = getZodiacCompatibility(male.zodiacSign.name, female.zodiacSign.name);
    totalScore += signCompatibility.score * 0.25;
    factors.push({
      name: 'Zodiac Signs',
      description: `${male.zodiacSign.name} & ${female.zodiacSign.name}`,
      score: signCompatibility.score,
      insight: signCompatibility.insight
    });

    // Add name compatibility factor for more variation
    const nameCompatibility = getNameCompatibility(malePartner?.fullName || 'Unknown', femalePartner?.fullName || 'Unknown');
    factors.push({
      name: 'Name Harmony',
      description: `${malePartner?.fullName?.split(' ')[0] || 'Partner'} & ${femalePartner?.fullName?.split(' ')[0] || 'Partner'}`,
      score: nameCompatibility.score,
      insight: nameCompatibility.insight
    });

    return {
      overallScore: Math.round(totalScore),
      factors: factors,
      maleData: male,
      femaleData: female
    };
  };

  // Life Path Number Compatibility Matrix (Updated with more variation)
  const getLifePathCompatibility = (num1, num2) => {
    const compatibility = {
      1: { 1: 72, 2: 88, 3: 91, 4: 58, 5: 83, 6: 76, 7: 64, 8: 87, 9: 79, 11: 85, 22: 74, 33: 80 },
      2: { 1: 88, 2: 73, 3: 82, 4: 93, 5: 69, 6: 96, 7: 81, 8: 84, 9: 86, 11: 90, 22: 85, 33: 88 },
      3: { 1: 91, 2: 82, 3: 84, 4: 63, 5: 97, 6: 78, 7: 77, 8: 68, 9: 92, 11: 89, 22: 71, 33: 85 },
      4: { 1: 58, 2: 93, 3: 63, 4: 81, 5: 59, 6: 87, 7: 72, 8: 96, 9: 71, 11: 75, 22: 94, 33: 82 },
      5: { 1: 83, 2: 69, 3: 97, 4: 59, 5: 74, 6: 68, 7: 86, 8: 73, 9: 87, 11: 82, 22: 70, 33: 79 },
      6: { 1: 76, 2: 96, 3: 78, 4: 87, 5: 68, 6: 83, 7: 73, 8: 82, 9: 98, 11: 91, 22: 86, 33: 95 },
      7: { 1: 64, 2: 81, 3: 77, 4: 72, 5: 86, 6: 73, 7: 88, 8: 63, 9: 83, 11: 92, 22: 78, 33: 85 },
      8: { 1: 87, 2: 84, 3: 68, 4: 96, 5: 73, 6: 82, 7: 63, 8: 79, 9: 74, 11: 81, 22: 93, 33: 76 },
      9: { 1: 79, 2: 86, 3: 92, 4: 71, 5: 87, 6: 98, 7: 83, 8: 74, 9: 87, 11: 89, 22: 80, 33: 94 },
      11: { 1: 85, 2: 90, 3: 89, 4: 75, 5: 82, 6: 91, 7: 92, 8: 81, 9: 89, 11: 95, 22: 88, 33: 97 },
      22: { 1: 74, 2: 85, 3: 71, 4: 94, 5: 70, 6: 86, 7: 78, 8: 93, 9: 80, 11: 88, 22: 84, 33: 90 },
      33: { 1: 80, 2: 88, 3: 85, 4: 82, 5: 79, 6: 95, 7: 85, 8: 76, 9: 94, 11: 97, 22: 90, 33: 92 }
    };

    const score = compatibility[num1]?.[num2] || compatibility[num2]?.[num1] || (65 + Math.floor(Math.random() * 20));
    
    const getInsightByScore = (score) => {
      if (score >= 95) return "Perfect numerological harmony - your life paths complement each other beautifully";
      if (score >= 90) return "Excellent compatibility - you share similar life goals and values";
      if (score >= 85) return "Great connection - your energies flow well together";
      if (score >= 80) return "Good compatibility - you balance each other's strengths and weaknesses";
      if (score >= 75) return "Decent match - with understanding, you can build a strong relationship";
      if (score >= 70) return "Moderate compatibility - requires effort but can work well";
      if (score >= 65) return "Challenging but possible - you'll need patience and communication";
      return "Different paths - growth through understanding each other's differences";
    };

    return {
      score,
      insight: getInsightByScore(score)
    };
  };

  // Element Compatibility (Updated for more accuracy)
  const getElementCompatibility = (element1, element2) => {
    const compatibility = {
      'Fire': { 'Fire': 84, 'Earth': 67, 'Air': 96, 'Water': 58 },
      'Earth': { 'Fire': 67, 'Earth': 82, 'Air': 61, 'Water': 92 },
      'Air': { 'Fire': 96, 'Earth': 61, 'Air': 86, 'Water': 73 },
      'Water': { 'Fire': 58, 'Earth': 92, 'Air': 73, 'Water': 87 }
    };

    const score = compatibility[element1]?.[element2] || 70;
    
    const getInsightByScore = (score) => {
      if (score >= 95) return "Explosive chemistry - you ignite each other's passions and dreams";
      if (score >= 90) return "Deep emotional connection - you understand each other intuitively";
      if (score >= 85) return "Strong attraction - similar energy levels and approaches to life";
      if (score >= 80) return "Stable foundation - you ground each other perfectly";
      if (score >= 75) return "Balanced relationship - you complement each other's differences";
      if (score >= 70) return "Steady connection - requires patience but very rewarding";
      if (score >= 65) return "Different approaches - can learn a lot from each other";
      return "Opposing energies - challenges that can lead to tremendous growth";
    };

    return {
      score,
      insight: getInsightByScore(score)
    };
  };

  // Enhanced Zodiac Compatibility
  const getZodiacCompatibility = (sign1, sign2) => {
    const compatibilityMatrix = {
      'Aries': { 'Aries': 78, 'Taurus': 65, 'Gemini': 83, 'Cancer': 62, 'Leo': 94, 'Virgo': 58, 'Libra': 86, 'Scorpio': 71, 'Sagittarius': 91, 'Capricorn': 60, 'Aquarius': 85, 'Pisces': 69 },
      'Taurus': { 'Aries': 65, 'Taurus': 81, 'Gemini': 59, 'Cancer': 89, 'Leo': 67, 'Virgo': 93, 'Libra': 74, 'Scorpio': 87, 'Sagittarius': 56, 'Capricorn': 95, 'Aquarius': 61, 'Pisces': 82 },
      'Gemini': { 'Aries': 83, 'Taurus': 59, 'Gemini': 84, 'Cancer': 66, 'Leo': 88, 'Virgo': 72, 'Libra': 96, 'Scorpio': 63, 'Sagittarius': 85, 'Capricorn': 58, 'Aquarius': 94, 'Pisces': 70 },
      'Cancer': { 'Aries': 62, 'Taurus': 89, 'Gemini': 66, 'Cancer': 86, 'Leo': 73, 'Virgo': 81, 'Libra': 68, 'Scorpio': 97, 'Sagittarius': 54, 'Capricorn': 84, 'Aquarius': 57, 'Pisces': 92 },
      'Leo': { 'Aries': 94, 'Taurus': 67, 'Gemini': 88, 'Cancer': 73, 'Leo': 82, 'Virgo': 64, 'Libra': 91, 'Scorpio': 76, 'Sagittarius': 96, 'Capricorn': 61, 'Aquarius': 87, 'Pisces': 69 },
      'Virgo': { 'Aries': 58, 'Taurus': 93, 'Gemini': 72, 'Cancer': 81, 'Leo': 64, 'Virgo': 83, 'Libra': 75, 'Scorpio': 89, 'Sagittarius': 59, 'Capricorn': 94, 'Aquarius': 66, 'Pisces': 78 },
      'Libra': { 'Aries': 86, 'Taurus': 74, 'Gemini': 96, 'Cancer': 68, 'Leo': 91, 'Virgo': 75, 'Libra': 85, 'Scorpio': 71, 'Sagittarius': 88, 'Capricorn': 63, 'Aquarius': 95, 'Pisces': 72 },
      'Scorpio': { 'Aries': 71, 'Taurus': 87, 'Gemini': 63, 'Cancer': 97, 'Leo': 76, 'Virgo': 89, 'Libra': 71, 'Scorpio': 84, 'Sagittarius': 65, 'Capricorn': 82, 'Aquarius': 59, 'Pisces': 93 },
      'Sagittarius': { 'Aries': 91, 'Taurus': 56, 'Gemini': 85, 'Cancer': 54, 'Leo': 96, 'Virgo': 59, 'Libra': 88, 'Scorpio': 65, 'Sagittarius': 87, 'Capricorn': 52, 'Aquarius': 92, 'Pisces': 62 },
      'Capricorn': { 'Aries': 60, 'Taurus': 95, 'Gemini': 58, 'Cancer': 84, 'Leo': 61, 'Virgo': 94, 'Libra': 63, 'Scorpio': 82, 'Sagittarius': 52, 'Capricorn': 86, 'Aquarius': 55, 'Pisces': 79 },
      'Aquarius': { 'Aries': 85, 'Taurus': 61, 'Gemini': 94, 'Cancer': 57, 'Leo': 87, 'Virgo': 66, 'Libra': 95, 'Scorpio': 59, 'Sagittarius': 92, 'Capricorn': 55, 'Aquarius': 88, 'Pisces': 64 },
      'Pisces': { 'Aries': 69, 'Taurus': 82, 'Gemini': 70, 'Cancer': 92, 'Leo': 69, 'Virgo': 78, 'Libra': 72, 'Scorpio': 93, 'Sagittarius': 62, 'Capricorn': 79, 'Aquarius': 64, 'Pisces': 85 }
    };

    const score = compatibilityMatrix[sign1]?.[sign2] || 75;
    
    const getInsightByScore = (score) => {
      if (score >= 95) return "Perfect zodiac alignment - you're naturally made for each other";
      if (score >= 90) return "Excellent zodiac harmony - your signs naturally understand each other";
      if (score >= 85) return "Strong zodiac connection - great potential for lasting love";
      if (score >= 80) return "Good zodiac match - you complement each other well";
      if (score >= 75) return "Moderate zodiac compatibility - with effort, great things are possible";
      if (score >= 70) return "Fair zodiac match - differences can be strengths";
      if (score >= 60) return "Challenging zodiac pairing - requires understanding and patience";
      return "Complex zodiac dynamics - growth through overcoming differences";
    };

    return { 
      score, 
      insight: getInsightByScore(score) 
    };
  };

  // New: Name Compatibility function for additional variation
  const getNameCompatibility = (name1, name2) => {
    if (!name1 || !name2) return { score: 70, insight: "Names create a harmonious energy together" };
    
    // Simple algorithm based on letter values and name length
    const getNameValue = (name) => {
      return name.toLowerCase().split('').reduce((sum, char) => {
        return sum + (char.charCodeAt(0) - 96);
      }, 0);
    };
    
    const value1 = getNameValue(name1);
    const value2 = getNameValue(name2);
    const difference = Math.abs(value1 - value2);
    const average = (value1 + value2) / 2;
    
    // Calculate score based on harmony of name values
    let score = Math.round(90 - (difference / average) * 30);
    score = Math.max(55, Math.min(95, score)); // Ensure score is between 55-95
    
    const getInsightByScore = (score) => {
      if (score >= 90) return "Your names create beautiful harmony and positive vibrations";
      if (score >= 80) return "Strong name compatibility - your names flow well together";
      if (score >= 70) return "Good name harmony - creates a balanced energy";
      return "Your names bring unique energies that complement each other";
    };

    return {
      score,
      insight: getInsightByScore(score)
    };
  };

  const compatibilityData = calculateAccurateCompatibility();

  const getScoreMessage = (score) => {
    if (score >= 90) return "Perfect Cosmic Match!";
    if (score >= 85) return "Excellent Compatibility!";
    if (score >= 80) return "Very Strong Connection!";
    if (score >= 75) return "Great Compatibility!";
    if (score >= 70) return "Good Match!";
    if (score >= 65) return "Promising Connection!";
    return "Moderate Compatibility!";
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fde68a 0%, #fbbf24 25%, #f59e0b 50%, #d97706 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          top: '-150px',
          right: '-150px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.15))',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          bottom: '-100px',
          left: '-100px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(255, 193, 7, 0.2), rgba(255, 152, 0, 0.15))',
          animation: 'float 6s ease-in-out infinite 2s'
        }}></div>
        <div style={{
          position: 'absolute',
          width: '250px',
          height: '250px',
          top: '50%',
          left: '-125px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(255, 235, 59, 0.15), rgba(255, 193, 7, 0.15))',
          animation: 'float 6s ease-in-out infinite 4s'
        }}></div>
        <div style={{
          position: 'absolute',
          width: '180px',
          height: '180px',
          bottom: '20%',
          right: '-90px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(255, 241, 118, 0.15), rgba(255, 215, 0, 0.15))',
          animation: 'float 6s ease-in-out infinite 1s'
        }}></div>
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '2rem',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Crown style={{
            color: '#b45309',
            width: '3rem',
            height: '3rem',
            marginBottom: '1rem',
            filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))'
          }} />
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#b45309',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            margin: '0 0 1rem 0'
          }}>
            Cosmic Compatibility Report
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#b45309',
            fontWeight: 600,
            margin: 0,
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
          }}>
            {malePartner?.fullName || 'Partner 1'} & {femalePartner?.fullName || 'Partner 2'}
          </p>
        </div>

        {/* Main Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2rem',
          padding: '3rem',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
        }}>
          
          {/* Score Section */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              fontSize: '6rem',
              marginBottom: '1rem',
              filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))'
            }}>
              ✨
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #ffd700 0%, #ffb347 100%)',
              borderRadius: '2rem',
              padding: '2rem',
              border: '3px solid rgba(255, 215, 0, 0.6)',
              boxShadow: 'inset 0 2px 10px rgba(255, 255, 255, 0.3)'
            }}>
              <h2 style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                color: '#b45309',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                margin: '0 0 0.5rem 0'
              }}>
                {compatibilityData.overallScore}%
              </h2>
              <p style={{
                fontSize: '1.5rem',
                color: '#b45309',
                fontWeight: 600,
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                margin: 0
              }}>
                {getScoreMessage(compatibilityData.overallScore)}
              </p>
            </div>
          </div>

          {/* Insights Section */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <Star style={{ color: '#d97706', width: '2rem', height: '2rem' }} />
              <h3 style={{
                color: '#b45309',
                fontSize: '1.8rem',
                fontWeight: 600,
                margin: 0,
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
              }}>
                Mystical Analysis
              </h3>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              {compatibilityData.factors.map((factor, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  transition: 'transform 0.3s ease'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>⭐</span>
                    <div>
                      <h4 style={{
                        color: '#b45309',
                        fontSize: '1rem',
                        fontWeight: 600,
                        margin: 0
                      }}>
                        {factor.name} ({factor.score}%)
                      </h4>
                      <p style={{
                        color: '#b45309',
                        fontSize: '0.9rem',
                        margin: '0.25rem 0'
                      }}>
                        {factor.description}
                      </p>
                    </div>
                  </div>
                  <p style={{
                    color: '#b45309',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    margin: 0,
                    fontStyle: 'italic'
                  }}>
                    {factor.insight}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Message Section */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 215, 0, 0.2) 100%)',
            borderRadius: '1.5rem',
            padding: '2rem',
            textAlign: 'center',
            marginBottom: '2rem',
            border: '2px solid rgba(255, 215, 0, 0.3)'
          }}>
            <Zap style={{
              color: '#d97706',
              width: '2.5rem',
              height: '2.5rem',
              marginBottom: '1rem'
            }} />
            <h4 style={{
              color: '#b45309',
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '1rem',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
            }}>
              The Universe Has Spoken!
            </h4>
            <p style={{
              color: '#b45309',
              fontSize: '1.1rem',
              lineHeight: 1.6,
              fontWeight: 500,
              margin: 0
            }}>
              Your compatibility analysis reveals a {compatibilityData.overallScore >= 80 ? 'remarkably strong' : compatibilityData.overallScore >= 70 ? 'promising' : 'moderate'} connection. 
              The cosmic forces have aligned your life path numbers ({compatibilityData.maleData.lifePathNumber} & {compatibilityData.femaleData.lifePathNumber}) 
              and elemental energies ({compatibilityData.maleData.zodiacSign.element} & {compatibilityData.femaleData.zodiacSign.element}) 
              in a way that {compatibilityData.overallScore >= 80 ? 'creates natural harmony and deep understanding' : 'offers opportunities for growth and connection'}.
              Remember, true compatibility goes beyond numbers - it's built through love, understanding, and shared experiences.
            </p>
          </div>

          {/* Action Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={onReset}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 1.5rem',
                border: '2px solid #fbbf24',
                borderRadius: '1rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #92400e 0%, #b45309 100%)',
                color: '#fbbf24',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <ArrowLeft style={{ width: '1.25rem', height: '1.25rem' }} />
              Calculate Another Match
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{
            color: '#b45309',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            * This compatibility analysis is based on numerology and astrological principles for entertainment purposes.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}