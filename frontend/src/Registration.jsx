import React, { useState } from 'react';
import './Registration.css';
import { Link } from "react-router-dom";
import axios from 'axios';
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    dateOfBirth: '',
    birthPlace: '',
    gender: ''
  });
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log('Form submitted:', formData);
  //   // Add your authentication logic here
  // };
  const handleSubmit = async (e) => { //to connect with backend
  e.preventDefault();

  const apiUrl = isLogin 
    ? 'http://localhost:4000/login'
    : 'http://localhost:4000/signup';

  try {
    const response = await axios.post(apiUrl, formData);

    console.log("Response:", response.data);

    // Optionally store token or user info
    localStorage.setItem('token', response.data.token);

    alert(response.data.message);
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    alert(error.response?.data?.error || "Something went wrong");
  }
};

  const styles = {
    loginContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7209b7 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    },
    loginFormWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      position: 'relative',
      zIndex: 10
    },
    loginHeader: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    logoSection: {
      marginBottom: '30px'
    },
    mysticIcon: {
      fontSize: '60px',
      marginBottom: '20px',
      display: 'block',
      filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.7))',
      animation: 'float 3s ease-in-out infinite'
    },
    appTitle: {
      fontSize: '48px',
      fontWeight: 'bold',
      background: 'linear-gradient(45deg, #ff6b9d, #c44569, #f8b500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: '0 0 10px 0',
      textShadow: '0 0 30px rgba(255, 107, 157, 0.5)'
    },
    appSubtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '18px',
      margin: '0'
    },
    formContainer: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '40px',
      width: '100%',
      maxWidth: '500px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
      position: 'relative'
    },
    formHeader: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    formTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#ffd700',
      margin: '0 0 10px 0',
      textShadow: '0 0 15px rgba(255, 215, 0, 0.5)'
    },
    formSubtitle: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '16px',
      margin: '0'
    },
    loginForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    inputRow: {
      display: 'flex',
      gap: '15px'
    },
    inputHalf: {
      flex: 1
    },
    label: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    labelIcon: {
      fontSize: '16px'
    },
    formInput: {
      padding: '15px',
      borderRadius: '10px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      outline: 'none'
    },
    selectInput: {
      padding: '15px',
      borderRadius: '10px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      outline: 'none',
      cursor: 'pointer'
    },
    formInputFocus: {
      border: '1px solid #ffd700',
      boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
      background: 'rgba(255, 255, 255, 0.15)'
    },
    formOptions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px'
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: 'rgba(255, 255, 255, 0.8)',
      cursor: 'pointer'
    },
    checkbox: {
      width: '16px',
      height: '16px',
      cursor: 'pointer'
    },
    forgotPassword: {
      color: '#ffd700',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    submitBtn: {
      background: 'linear-gradient(45deg, #8a2be2, #9966cc)',
      color: 'white',
      border: 'none',
      padding: '15px',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      boxShadow: '0 10px 30px rgba(138, 43, 226, 0.4)',
      marginTop: '10px'
    },
    submitBtnHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 15px 40px rgba(138, 43, 226, 0.6)'
    },
    btnIcon: {
      fontSize: '18px'
    },
    formFooter: {
      textAlign: 'center',
      marginTop: '20px',
      color: 'rgba(255, 255, 255, 0.7)'
    },
    toggleBtn: {
      color: '#ffd700',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'underline',
      fontSize: 'inherit'
    },
    divider: {
      textAlign: 'center',
      margin: '20px 0',
      position: 'relative',
      color: 'rgba(255, 255, 255, 0.5)'
    },
    dividerLine: {
      position: 'absolute',
      top: '50%',
      left: '0',
      right: '0',
      height: '1px',
      background: 'rgba(255, 255, 255, 0.2)',
      zIndex: 1
    },
    dividerText: {
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '0 15px',
      position: 'relative',
      zIndex: 2
    },
    socialLogin: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    socialBtn: {
      padding: '12px',
      borderRadius: '10px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      fontSize: '14px'
    },
    socialIcon: {
      fontSize: '16px'
    },
    mysticalElements: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 1
    },
    floatingOrb: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
      animation: 'float 4s ease-in-out infinite'
    },
    orb1: {
      width: '100px',
      height: '100px',
      top: '20%',
      left: '10%',
      animationDelay: '0s'
    },
    orb2: {
      width: '150px',
      height: '150px',
      top: '60%',
      right: '15%',
      animationDelay: '2s'
    },
    orb3: {
      width: '80px',
      height: '80px',
      bottom: '20%',
      left: '20%',
      animationDelay: '1s'
    },
    bottomNavigation: {
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 20
    },
    navItems: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    navItem: {
      padding: '8px 16px',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      textDecoration: 'none'
    },
    navItemActive: {
      background: 'rgba(255, 215, 0, 0.2)',
      color: '#ffd700',
      border: '1px solid rgba(255, 215, 0, 0.3)'
    },
    birthDetailsNote: {
      fontSize: '12px',
      color: 'rgba(255, 215, 0, 0.8)',
      fontStyle: 'italic',
      textAlign: 'center',
      margin: '10px 0',
      padding: '8px',
      background: 'rgba(255, 215, 0, 0.1)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 215, 0, 0.2)'
    }
  };

  return (
    <div style={styles.loginContainer}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        select option {
          background: #2a2a3e;
          color: white;
        }
        
        input:focus, select:focus {
          border: 1px solid #ffd700 !important;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.3) !important;
          background: rgba(255, 255, 255, 0.15) !important;
        }
        
        .social-btn:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: translateY(-1px);
        }
        
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(138, 43, 226, 0.6);
        }
        
        .nav-item:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          color: white !important;
        }
      `}</style>
      
      <div style={styles.loginFormWrapper}>
        <div style={styles.loginHeader}>
          <div style={styles.logoSection}>
            <span style={styles.mysticIcon}>🔮</span>
            <h1 style={styles.appTitle}>NumPath: A Mystic Numerology Portal</h1>
            <p style={styles.appSubtitle}>Every Number whispers a story - Find yours</p>
          </div>
        </div>

        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>
              {isLogin ? '🌟 Welcome Back to Your Mystic Journey' : '✨ Begin Your Numerological Adventure'}
            </h2>
            <p style={styles.formSubtitle}>
              {isLogin ? 'Enter your credentials to access your portal' : 'Create your account to unlock the mysteries'}
            </p>
          </div>

          <div style={styles.loginForm}>
            {!isLogin && (
              <>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}>👤</span>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    style={styles.formInput}
                    required
                  />
                </div>

                <div style={styles.inputRow}>
                  <div style={{...styles.inputGroup, ...styles.inputHalf}}>
                    <label style={styles.label}>
                      <span style={styles.labelIcon}>🎂</span>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      style={styles.formInput}
                      required
                    />
                  </div>

                  <div style={{...styles.inputGroup, ...styles.inputHalf}}>
                    <label style={styles.label}>
                      <span style={styles.labelIcon}>⚧</span>
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      style={styles.selectInput}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}>🌍</span>
                    Birth Place
                  </label>
                  <input
                    type="text"
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleInputChange}
                    placeholder="City, State/Province, Country"
                    style={styles.formInput}
                    required
                  />
                </div>

                <div style={styles.birthDetailsNote}>
                  ✨ Birth details are essential for accurate numerological calculations and cosmic insights
                </div>
              </>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>📧</span>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                style={styles.formInput}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>🔒</span>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                style={styles.formInput}
                required
              />
            </div>

            {isLogin && (
              <div style={styles.formOptions}>
                <label style={styles.checkboxContainer}>
                  <input 
                    type="checkbox" 
                    style={styles.checkbox}
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <a href="#" style={styles.forgotPassword}>Forgot Password?</a>
              </div>
            )}

            <button 
              type="button" 
              style={styles.submitBtn}
              className="submit-btn"
              onClick={handleSubmit}
            >
              <span style={styles.btnIcon}>⭐</span>
              {isLogin ? 'Enter Your Portal' : 'Create Mystic Account'}
            </button>
          </div>

          <div style={styles.formFooter}>
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                style={styles.toggleBtn}
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Start Your Journey' : 'Sign In'}
              </button>
            </p>
          </div>

          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>or</span>
          </div>

          <div style={styles.socialLogin}>
            <button style={styles.socialBtn} className="social-btn">
              <span style={styles.socialIcon}>🌐</span>
              Continue with Google
            </button>
            <button style={styles.socialBtn} className="social-btn">
              <span style={styles.socialIcon}>📱</span>
              Continue with Facebook
            </button>
          </div>
        </div>

        <div style={styles.mysticalElements}>
          <div style={{...styles.floatingOrb, ...styles.orb1}}></div>
          <div style={{...styles.floatingOrb, ...styles.orb2}}></div>
          <div style={{...styles.floatingOrb, ...styles.orb3}}></div>
        </div>

        <div style={styles.bottomNavigation}>
          <div style={styles.navItems}>
            <a href="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ ...styles.navItem, ...styles.navItemActive }} className="nav-item">🏠 Home</a>
            <a href="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.navItem} className="nav-item">❓ What is Numerology</a>
            <a href="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.navItem} className="nav-item">⭐ Why Important</a>
            <a href="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.navItem} className="nav-item">🛤️ Life Path</a>
            <a href="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.navItem} className="nav-item">🎯 Destiny Number</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;