// src/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section brand-section">
            <div className="footer-logo">
              <span className="logo-icon">🔮</span>
              <h3>NumPath</h3>
            </div>
            <p className="footer-description">
              A Mystic Numerology Portal where every number whispers a story. 
              Discover the hidden meanings behind your numbers and unlock your destiny.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">📘</a>
              <a href="#" className="social-link" aria-label="Twitter">🐦</a>
              <a href="#" className="social-link" aria-label="Instagram">📷</a>
              <a href="#" className="social-link" aria-label="YouTube">📺</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/" onClick={() => window.scrollTo(0, 0)}>Home</Link></li>
              <li><Link to="/About">About Us</Link></li>
              <li><Link to="/MatchMaking">Match Making</Link></li>
              <li><Link to="/Blog">Blog</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4>Services</h4>
            <ul className="footer-links">
              {/* <li><Link to="/">Numerology Report</Link></li>
              <li><Link to="/">Birth Number</Link></li>
              <li><Link to="/">Destiny Number</Link></li>
              <li><Link to="/">Life Path</Link></li> */}
              <li><Link to="/" onClick={() => window.scrollTo(0, 0)}>Numerology Report</Link></li>
              <li><Link to="/" onClick={() => window.scrollTo(0, 0)}>Birth Number</Link></li>
              <li><Link to="/" onClick={() => window.scrollTo(0, 0)}>Destiny Number</Link></li>
              <li><Link to="/" onClick={() => window.scrollTo(0, 0)}>Life Path</Link></li>

            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <p>📧 mayank.astro.project@gmail.com</p>
              <p>📞 +91 7906403761</p>
              <p>📍 Agra, Uttar Pradesh, India</p>
            </div>
            <Link to="/ContactUs" className="contact-button">Get in Touch</Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 NumPath. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;