import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/login" className="nav-link">SignUp/login</Link>
          {/* <Link to="/About" className="nav-link">About us</Link> */}
          <Link to="/MatchMaking" className="nav-link">Match Making</Link>
          <Link to="/Blog" className="nav-link">Blog</Link>
          <Link to="/ContactUs" className="nav-link">Contact us</Link>
          <Link to="/UserProfile" className="nav-link">Profile</Link>
          <Link to="/ChatUI" className="nav-link">Chat</Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;