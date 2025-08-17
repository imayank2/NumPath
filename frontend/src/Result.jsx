import React, { useEffect } from 'react';
import { ChevronLeft, Star, Calendar, User } from 'lucide-react';
import './App.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Result = ({ formData }) => {
  const navigate = useNavigate();
  const onBack=() => {
        navigate('/');
  };

  // ✅ Check token when page loads
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You must be logged in to view this page.');
      console.log('❌ No token found, redirecting to login');
      navigate('/login'); // No token → go to login
      return;
    }

    // Verify token with backend
    axios.get('http://localhost:4000/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      console.log('✅ Token valid:', res.data);
    })
    .catch(err => {
      console.error('❌ Token invalid:', err.response?.data || err);
      localStorage.removeItem('authToken'); // remove bad token
      navigate('/login'); // send to login
    });
  }, [navigate]);

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

  const getBirthNumberDescription = (num) => {
    const descriptions = {
      1: 'The Leader - Independent, pioneering, and ambitious. You possess natural leadership qualities and have the drive to initiate new projects. Your birth number indicates strong willpower, determination, and the ability to forge your own path. You are innovative, original, and prefer to lead rather than follow.',
      
      2: 'The Cooperator - Diplomatic, sensitive, and peace-loving. You excel in partnerships and teamwork. Your birth number reveals a natural ability to mediate conflicts and bring harmony to situations. You are intuitive, gentle, and work best in collaborative environments where you can support others.',
      
      3: 'The Communicator - Creative, expressive, and optimistic. You have a natural gift for communication and artistic expression. Your birth number indicates talents in writing, speaking, or performing arts. You bring joy and inspiration to others through your enthusiasm and creative abilities.',
      
      4: 'The Builder - Practical, reliable, and hardworking. You excel at creating stable foundations and bringing order to chaos. Your birth number reveals strong organizational skills and the ability to work methodically toward long-term goals. You value security, tradition, and systematic approaches.',
      
      5: 'The Adventurer - Freedom-loving, curious, and versatile. You thrive on change and new experiences. Your birth number indicates a restless spirit that seeks variety and adventure. You are adaptable, progressive, and have a natural ability to communicate and connect with diverse groups of people.',
      
      6: 'The Nurturer - Caring, responsible, and family-oriented. You have a natural inclination to heal and serve others. Your birth number reveals strong protective instincts and the ability to create harmonious environments. You excel in roles involving counseling, teaching, or caring for others.',
      
      7: 'The Seeker - Analytical, intuitive, and spiritually inclined. You possess a deep need to understand life\'s mysteries. Your birth number indicates strong research abilities and a preference for solitude to contemplate and analyze. You are drawn to spiritual, philosophical, or scientific pursuits.',
      
      8: 'The Achiever - Ambitious, business-minded, and materialistic. You have natural leadership abilities in the material world. Your birth number reveals strong organizational and managerial skills. You are driven to achieve success, recognition, and financial security through determined effort.',
      
      9: 'The Humanitarian - Compassionate, generous, and globally minded. You feel called to serve humanity and make the world better. Your birth number indicates broad vision, artistic talents, and the ability to inspire others through your idealism and selfless service to causes greater than yourself.'
    };
    return descriptions[num] || 'Your birth number carries special significance. This number influences your natural talents and the way you approach life\'s challenges.';
  };

  const getLifePathDescription = (num) => {
    const descriptions = {
      1: 'Life Path 1 - The Pioneer: You are here to develop independence, leadership, and innovation. Your life journey involves learning to stand on your own, initiate new projects, and lead others. You\'re meant to break new ground and create original solutions. Your challenges include learning to balance independence with cooperation and developing confidence without becoming dominating.',
      
      2: 'Life Path 2 - The Diplomat: You are here to learn cooperation, partnership, and the art of working with others. Your life purpose involves creating harmony, mediating conflicts, and supporting others in achieving their goals. You\'re meant to develop sensitivity, patience, and the ability to work behind the scenes. Your lessons include learning to assert yourself while maintaining peace.',
      
      3: 'Life Path 3 - The Creative Communicator: You are here to develop and express your creative talents through communication, arts, or entertainment. Your life journey involves inspiring others through your optimism, creativity, and self-expression. You\'re meant to bring joy and beauty to the world. Your challenges include focusing your scattered energies and developing discipline in your creative pursuits.',
      
      4: 'Life Path 4 - The Master Builder: You are here to create lasting foundations and bring order to the world. Your life purpose involves hard work, patience, and methodical progress toward substantial goals. You\'re meant to build systems, structures, and security for yourself and others. Your lessons include learning to balance work with rest and rigid thinking with flexibility.',
      
      5: 'Life Path 5 - The Freedom Seeker: You are here to experience life fully through change, travel, and diverse experiences. Your life journey involves learning about freedom, variety, and progressive thinking. You\'re meant to explore new ideas and help others expand their horizons. Your challenges include developing commitment and focus while maintaining your need for freedom.',
      
      6: 'Life Path 6 - The Nurturer: You are here to serve others through healing, teaching, and creating harmonious environments. Your life purpose involves responsibility for family, community, and those who need care. You\'re meant to develop compassion, responsibility, and the ability to create beauty and harmony. Your lessons include learning to care for others without becoming controlling or martyring yourself.',
      
      7: 'Life Path 7 - The Spiritual Seeker: You are here to develop wisdom through study, analysis, and spiritual exploration. Your life journey involves seeking truth, understanding life\'s deeper mysteries, and developing intuition. You\'re meant to become an expert in your chosen field and share your wisdom. Your challenges include learning to trust others and balancing solitude with human connection.',
      
      8: 'Life Path 8 - The Material Master: You are here to learn about power, authority, and material success in the physical world. Your life purpose involves developing business acumen, organizational skills, and the ability to manifest material abundance. You\'re meant to achieve recognition and financial success while maintaining ethical standards. Your lessons include balancing material and spiritual values.',
      
      9: 'Life Path 9 - The Universal Humanitarian: You are here to serve humanity through compassion, generosity, and universal love. Your life journey involves developing a broad perspective and dedicating yourself to causes that benefit all people. You\'re meant to be a light for others and help heal the world. Your challenges include learning to let go of the past and avoiding disappointment when others don\'t meet your high ideals.',
      
      11: 'Life Path 11 - The Inspired Healer: You are here to inspire others through spiritual insight and intuitive abilities. Your life purpose involves developing your psychic gifts and using them to guide and heal others. You\'re meant to be a channel for higher wisdom and bring illumination to the world. Your challenges include managing sensitivity and learning to ground your high vibration in practical reality.',
      
      22: 'Life Path 22 - The Master Builder: You are here to create something of lasting value that benefits humanity. Your life purpose involves combining spiritual insight with practical skills to build something significant in the material world. You\'re meant to turn dreams into reality on a large scale. Your challenges include managing the pressure of your potential and learning to work with others effectively.',
      
      33: 'Life Path 33 - The Master Teacher: You are here to uplift humanity through unconditional love and spiritual teaching. Your life purpose involves healing others through your presence and wisdom. You\'re meant to be a living example of love in action and guide others toward their highest potential. Your challenges include avoiding martyrdom and learning to balance giving with receiving.'
    };
    return descriptions[num] || 'Your life path number reveals the spiritual lessons and purpose you are meant to fulfill in this lifetime. Each number carries its own unique vibration and set of experiences.';
  };

  const getPersonalYearDescription = (num) => {
    const descriptions = {
      1: 'Personal Year 1 - New Beginnings: This is your year of fresh starts, independence, and new opportunities. You\'re entering a 9-year cycle with energy focused on leadership, innovation, and personal initiative. Expect new projects, career changes, or major life transitions. This is the time to plant seeds for your future and take charge of your destiny. Focus on self-development and building confidence.',
      
      2: 'Personal Year 2 - Cooperation & Patience: This year emphasizes partnerships, relationships, and working with others. Progress may be slower than last year, requiring patience and diplomacy. Focus on building alliances, improving existing relationships, and paying attention to details. This is a time for cooperation rather than competition. Emotional sensitivity is heightened.',
      
      3: 'Personal Year 3 - Creative Expression: This is your year of creativity, communication, and social expansion. Your artistic abilities are heightened, and opportunities for self-expression abound. Focus on writing, speaking, performing, or any creative endeavors. Social life is active, and you may find yourself in the spotlight. Optimism and joy characterize this year.',
      
      4: 'Personal Year 4 - Hard Work & Foundation: This year requires discipline, organization, and steady progress toward long-term goals. Focus on building solid foundations in career, relationships, and health. Hard work and attention to detail are essential. This is not a year for shortcuts - patience and persistence will pay off. Establish routines and systems.',
      
      5: 'Personal Year 5 - Change & Freedom: This is your year of adventure, travel, and unexpected changes. Embrace new experiences and break free from restrictive situations. Your desire for freedom and variety is strong. This can bring geographic moves, career changes, or new relationships. Stay flexible and open to opportunities that expand your horizons.',
      
      6: 'Personal Year 6 - Responsibility & Service: This year focuses on home, family, and service to others. You may take on increased responsibilities for loved ones or community. Marriage, divorce, births, or family changes are common. Focus on creating harmony, beauty, and healing in your environment. Your nurturing abilities are highlighted.',
      
      7: 'Personal Year 7 - Inner Development: This is your year of introspection, spiritual growth, and seeking deeper truths. You may feel drawn to solitude, study, or spiritual practices. This is not a year for major external changes but for inner development and gaining wisdom. Trust your intuition and take time for reflection and analysis.',
      
      8: 'Personal Year 8 - Material Achievement: This year focuses on business, career advancement, and material success. Your organizational and leadership abilities are highlighted. This is a powerful year for achieving recognition, increasing income, and advancing your position in the world. Focus on practical goals and efficient use of resources.',
      
      9: 'Personal Year 9 - Completion & Release: This is the final year of your 9-year cycle, marked by endings, completions, and letting go. Relationships, jobs, or situations that no longer serve your highest good may end. This is a year of clearing out the old to make way for new beginnings. Focus on forgiveness, compassion, and humanitarian service.'
    };
    return descriptions[num] || 'Your personal year reveals the overarching theme and energy that will influence your experiences throughout this year.';
  };

  const getPersonalMonthDescription = (num) => {
    const descriptions = {
      1: 'Personal Month 1 - Initiative: Start new projects, make important decisions, and take leadership roles. Your energy is high and focused on beginnings.',
      2: 'Personal Month 2 - Cooperation: Focus on relationships, partnerships, and working harmoniously with others. Patience and diplomacy are key.',
      3: 'Personal Month 3 - Communication: Express yourself creatively, socialize, and share your ideas. This is a time for joy and artistic pursuits.',
      4: 'Personal Month 4 - Organization: Focus on practical matters, hard work, and building foundations. Attention to detail is important.',
      5: 'Personal Month 5 - Adventure: Embrace change, travel, and new experiences. Freedom and variety are highlighted this month.',
      6: 'Personal Month 6 - Service: Focus on family, home, and helping others. Your nurturing qualities are especially strong.',
      7: 'Personal Month 7 - Reflection: Take time for introspection, study, and spiritual growth. Trust your intuition and seek inner wisdom.',
      8: 'Personal Month 8 - Achievement: Focus on business, career goals, and material success. Your leadership abilities are highlighted.',
      9: 'Personal Month 9 - Completion: Wrap up projects, clear out old situations, and prepare for new beginnings. Let go of what no longer serves you.'
    };
    return descriptions[num] || 'This month brings specific energies that influence your daily experiences and decisions.';
  };

  const getPersonalDayDescription = (num) => {
    const descriptions = {
      1: 'Personal Day 1 - Leadership: Take initiative, start new projects, make important decisions. Your confidence and independence are strong.',
      2: 'Personal Day 2 - Harmony: Focus on cooperation, relationships, and peaceful solutions. Be patient and diplomatic.',
      3: 'Personal Day 3 - Expression: Communicate, create, socialize, and enjoy life. Your optimism and charm are heightened.',
      4: 'Personal Day 4 - Structure: Focus on practical matters, organization, and steady progress. Work hard and pay attention to details.',
      5: 'Personal Day 5 - Freedom: Embrace variety, adventure, and unexpected opportunities. Stay flexible and open to change.',
      6: 'Personal Day 6 - Caring: Focus on family, home, and helping others. Your nurturing and healing abilities are strong.',
      7: 'Personal Day 7 - Wisdom: Seek solitude, study, meditate, and trust your intuition. This is a day for inner reflection.',
      8: 'Personal Day 8 - Power: Focus on business, achievement, and material goals. Your organizational skills are highlighted.',
      9: 'Personal Day 9 - Service: Help others, complete projects, and practice forgiveness. Focus on humanitarian concerns.'
    };
    return descriptions[num] || 'Today\'s energy influences your mood, decisions, and the types of experiences you\'re likely to encounter.';
  };

  const getZodiacDescription = (sign) => {
    const descriptions = {
      'Aries': 'Aries (Mar 21 - Apr 19) - The Ram: Bold, energetic, and pioneering. You\'re a natural leader with strong initiative and courage. You love challenges and aren\'t afraid to take risks. Your enthusiasm is contagious, though you can be impulsive. You prefer to lead rather than follow and have a competitive spirit.',
      
      'Taurus': 'Taurus (Apr 20 - May 20) - The Bull: Stable, practical, and determined. You value security, comfort, and the finer things in life. You\'re incredibly reliable and have great endurance. You prefer consistency over change and can be quite stubborn when pushed. You have a strong connection to nature and material pleasures.',
      
      'Gemini': 'Gemini (May 21 - Jun 20) - The Twins: Versatile, curious, and communicative. You have a quick wit and love learning new things. You\'re adaptable and can handle multiple tasks simultaneously. Your charm and intelligence make you a great conversationalist, though you can be inconsistent and restless.',
      
      'Cancer': 'Cancer (Jun 21 - Jul 22) - The Crab: Nurturing, intuitive, and protective. You\'re deeply emotional and have strong family bonds. You have excellent memory and are highly empathetic. You can be moody and tend to retreat when hurt, but you\'re incredibly loyal and caring to those you love.',
      
      'Leo': 'Leo (Jul 23 - Aug 22) - The Lion: Confident, generous, and dramatic. You love being the center of attention and have natural leadership qualities. You\'re warm-hearted, creative, and have a flair for the dramatic. You can be prideful and need recognition, but you\'re also incredibly loyal and protective of loved ones.',
      
      'Virgo': 'Virgo (Aug 23 - Sep 22) - The Virgin: Analytical, practical, and perfectionist. You have excellent attention to detail and love helping others. You\'re organized, reliable, and have high standards. You can be overly critical and worry too much, but your dedication and service to others is unmatched.',
      
      'Libra': 'Libra (Sep 23 - Oct 22) - The Scales: Diplomatic, charming, and harmony-seeking. You have excellent social skills and love beauty in all forms. You\'re fair-minded and always try to see both sides of a situation. You can be indecisive and avoid conflicts, but you bring balance and peace wherever you go.',
      
      'Scorpio': 'Scorpio (Oct 23 - Nov 21) - The Scorpion: Intense, passionate, and mysterious. You have incredible depth and transformative power. You\'re highly intuitive and can see through facades. You can be secretive and possessive, but your loyalty and emotional intensity make you a powerful ally and partner.',
      
      'Sagittarius': 'Sagittarius (Nov 22 - Dec 21) - The Archer: Optimistic, adventurous, and philosophical. You love travel, learning, and exploring new ideas. You\'re honest to a fault and have a great sense of humor. You can be tactless and restless, but your enthusiasm and wisdom inspire others to expand their horizons.',
      
      'Capricorn': 'Capricorn (Dec 22 - Jan 19) - The Goat: Ambitious, disciplined, and responsible. You have incredible persistence and work steadily toward your goals. You\'re practical, organized, and respect tradition. You can be overly serious and pessimistic, but your determination and reliability make you highly successful.',
      
      'Aquarius': 'Aquarius (Jan 20 - Feb 18) - The Water Bearer: Independent, innovative, and humanitarian. You\'re a forward-thinking visionary who values freedom and individuality. You\'re friendly but can be emotionally detached. You can be unpredictable and rebellious, but your unique perspective and desire to help humanity make you a true original.',
      
      'Pisces': 'Pisces (Feb 19 - Mar 20) - The Fish: Compassionate, intuitive, and artistic. You\'re highly sensitive and have powerful imagination. You\'re empathetic and often absorb others\' emotions. You can be escapist and overly trusting, but your compassion and spiritual insight bring healing and inspiration to others.'
    };
    return descriptions[sign] || 'Your zodiac sign reveals personality traits and characteristics based on your birth date.';
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
        <Link to="/" className="back-button"></Link>
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
            <div className="card-title">Numerology Insights</div>
          </div>
          <div className="insight-section birth-insight">
            <h4 className="insight-title birth">Birth Number {birthNumber}</h4>
            <p className="insight-description">{getBirthNumberDescription(birthNumber)}</p>
          </div>
          <div className="insight-section lifepath-insight">
            <h4 className="insight-title lifepath">Life Path Number {lifePathNumber}</h4>
            <p className="insight-description">{getLifePathDescription(lifePathNumber)}</p>
          </div>
        </div>

        <div className="result-card cycle-insights-card">
          <div className="card-header">
            <div className="icon-container"><Calendar /></div>
            <div className="card-title">Current Year & Cycle Insights</div>
          </div>
          <div className="insight-section personal-year-insight">
            <h4 className="insight-title personal-year">Personal Year {personalYear}</h4>
            <p className="insight-description">{getPersonalYearDescription(personalYear)}</p>
          </div>
          <div className="insight-section personal-month-insight">
            <h4 className="insight-title personal-month">Personal Month {personalMonth}</h4>
            <p className="insight-description">{getPersonalMonthDescription(personalMonth)}</p>
          </div>
          <div className="insight-section personal-day-insight">
            <h4 className="insight-title personal-day">Personal Day {personalDay}</h4>
            <p className="insight-description">{getPersonalDayDescription(personalDay)}</p>
          </div>
        </div>

        <div className="result-card zodiac-insights-card">
          <div className="card-header">
            <div className="icon-container"><Star /></div>
            <div className="card-title">Astrological Profile</div>
          </div>
          <div className="insight-section zodiac-insight">
            <h4 className="insight-title zodiac">{zodiac} Characteristics</h4>
            <p className="insight-description">{getZodiacDescription(zodiac)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
