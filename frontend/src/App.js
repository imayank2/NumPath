import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Home";
import Result from "./Result";
import Registration from "./Registration";
import MatchMaking from "./MatchMaking";
import UserProfile from "./UserProfile"; // Add this import
// import Navbar from "./Navbar"; 

/**
 * Main App Component with routing and shared state for form
 */
const App = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    day: "",
    month: "",
    year: "",
  });

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submit
  const handleSubmit = () => {
    const { name, day, month, year } = formData;
    if (name && day && month && year) {
      navigate("/result");
    } else {
      alert("Please fill in all fields");
    }
  };

  // Reset form and navigate back to Home
  const handleReset = () => {
    setFormData({
      name: "",
      day: "",
      month: "",
      year: "",
    });
    navigate("/");
  };

  return (
    <div className="App">
      {/* <Navbar /> */}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
            />
          }
        />
        <Route
          path="/result"
          element={
            <Result
              formData={formData}
              onReset={handleReset}
            />
          }
        />
        <Route path="/login" element={<Registration />} />
        <Route path="/Matchmaking" element={<MatchMaking />} />
        <Route path="/UserProfile" element={<UserProfile />} />
      </Routes>
    </div>
  );
};

export default App;