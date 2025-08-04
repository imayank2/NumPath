const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "8h#9G@d92!jdH@3jhs*&1js91!";

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'NumPath',
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected");
});

// Signup API
app.post('/signup', async (req, res) => {
  const { fullName, email, password, dateOfBirth, birthPlace, gender } = req.body;

  if (!fullName || !email || !password || !dateOfBirth || !birthPlace || !gender) {
    return res.status(400).json({
      error: "All fields are required",
      missing: {
        fullName: !fullName,
        email: !email,
        password: !password,
        dateOfBirth: !dateOfBirth,
        birthPlace: !birthPlace,
        gender: !gender
      }
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }

  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  if (isNaN(birthDate.getTime()) || birthDate > today) {
    return res.status(400).json({ error: "Invalid date of birth" });
  }

  try {
    const checkUserSql = "SELECT email FROM signup WHERE email = ?";
    db.query(checkUserSql, [email], async (err, result) => {
      if (err) {
        console.error("Database Check Error:", err);
        return res.status(500).json({ error: "Database error occurred" });
      }

      if (result.length > 0) {
        return res.status(409).json({ error: "User already exists with this email" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const signupSql = "INSERT INTO signup (name, email, password, date_of_birth, gender, birth_place) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(signupSql, [fullName, email, hashedPassword, dateOfBirth, gender, birthPlace], (err, signupResult) => {
        if (err) {
          console.error("Signup Error:", err);
          return res.status(500).json({ error: "Signup failed" });
        }

        const loginSql = "INSERT INTO login (email, password) VALUES (?, ?)";
        db.query(loginSql, [email, hashedPassword], (err) => {
          if (err) {
            console.error("Login Insert Error:", err);
            return res.status(500).json({ error: "Signup success, but login setup failed" });
          }

          const token = jwt.sign({
            email,
            userId: signupResult.insertId,
            name: fullName
          }, SECRET_KEY, { expiresIn: '24h' });

          res.status(201).json({
            message: "Signup successful! Welcome to NumPath!",
            token,
            user: {
              id: signupResult.insertId,
              name: fullName,
              email,
              dateOfBirth,
              birthPlace,
              gender
            }
          });
        });
      });
    });
  } catch (error) {
    console.error("Bcrypt Error:", error);
    res.status(500).json({ error: "Something went wrong during signup" });
  }
});

// Login API
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const loginSql = "SELECT * FROM login WHERE email = ?";
  db.query(loginSql, [email], async (err, loginResult) => {
    if (err) {
      console.error("Login Error:", err);
      return res.status(500).json({ error: "Login failed" });
    }

    if (loginResult.length > 0) {
      const loginUser = loginResult[0];
      const match = await bcrypt.compare(password, loginUser.password);

      if (match) {
        const userDetailsSql = "SELECT id, name, email, date_of_birth, gender, birth_place FROM signup WHERE email = ?";
        db.query(userDetailsSql, [email], (err, signupResult) => {
          if (err) {
            console.error("User Details Error:", err);
            return res.status(500).json({ error: "Login successful but failed to fetch user details" });
          }

          const userDetails = signupResult[0] || {};
          const token = jwt.sign({
            email,
            userId: userDetails.id || null,
            name: userDetails.name || 'User'
          }, SECRET_KEY, { expiresIn: '24h' });

          res.json({
            message: "Login successful! Welcome back to NumPath!",
            token,
            user: {
              id: userDetails.id,
              name: userDetails.name,
              email: userDetails.email,
              dateOfBirth: userDetails.date_of_birth,
              birthPlace: userDetails.birth_place,
              gender: userDetails.gender
            }
          });
        });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });
});

app.post('/profile/save', verifyToken, (req, res) => {
  const userId = req.user.userId;
  const { phone, address, bio, occupation } = req.body;

  if (!userId) return res.status(401).json({ error: "Unauthorized user" });

  const checkQuery = "SELECT * FROM user_profile WHERE user_id = ?";
  db.query(checkQuery, [userId], (err, result) => {
    if (err) {
      console.error("Error checking user_profile:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length > 0) {
      // 👇 Already exists → UPDATE
      const updateQuery = `UPDATE user_profile 
        SET phone = ?, address = ?, bio = ?, occupation = ?, updated_at = NOW()
        WHERE user_id = ?`;

      db.query(updateQuery, [phone, address, bio, occupation, userId], (err) => {
        if (err) {
          console.error("Update error:", err);
          return res.status(500).json({ error: "Failed to update profile" });
        }
        return res.json({ message: "Profile updated successfully" });
      });

    } else {
      // 👇 Not exists → INSERT
      const insertQuery = `INSERT INTO user_profile (user_id, phone, address, bio, occupation)
        VALUES (?, ?, ?, ?, ?)`;

      db.query(insertQuery, [userId, phone, address, bio, occupation], (err) => {
        if (err) {
          console.error("Insert error:", err);
          return res.status(500).json({ error: "Failed to save profile" });
        }
        return res.json({ message: "Profile saved successfully" });
      });
    }
  });
});


// Get Profile
app.get('/profile', verifyToken, (req, res) => {
  const sql = "SELECT id, name, email, date_of_birth, gender, birth_place FROM signup WHERE email = ?";
  db.query(sql, [req.user.email], (err, result) => {
    if (err) {
      console.error("Profile Fetch Error:", err);
      return res.status(500).json({ error: "Failed to fetch profile" });
    }

    if (result.length > 0) {
      const user = result[0];
      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          dateOfBirth: user.date_of_birth,
          birthPlace: user.birth_place,
          gender: user.gender
        }
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

// Update Profile
app.put('/profile', verifyToken, async (req, res) => {
  const { fullName, dateOfBirth, birthPlace, gender } = req.body;
  const email = req.user.email;

  if (dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    if (isNaN(birthDate.getTime()) || birthDate > today) {
      return res.status(400).json({ error: "Invalid date of birth" });
    }
  }

  const sql = "UPDATE signup SET name = ?, date_of_birth = ?, birth_place = ?, gender = ? WHERE email = ?";
  db.query(sql, [fullName, dateOfBirth, birthPlace, gender, email], (err, result) => {
    if (err) {
      console.error("Profile Update Error:", err);
      return res.status(500).json({ error: "Failed to update profile" });
    }

    if (result.affectedRows > 0) {
      res.json({ message: "Profile updated successfully!" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

// Dashboard
app.get('/dashboard', verifyToken, (req, res) => {
  const sql = "SELECT name, email, date_of_birth, birth_place, gender FROM signup WHERE email = ?";
  db.query(sql, [req.user.email], (err, result) => {
    if (err) {
      console.error("Dashboard Error:", err);
      return res.status(500).json({ error: "Failed to load dashboard" });
    }

    if (result.length > 0) {
      const user = result[0];
      res.json({
        message: `Welcome to your mystical dashboard, ${user.name}!`,
        user: {
          name: user.name,
          email: user.email,
          dateOfBirth: user.date_of_birth,
          birthPlace: user.birth_place,
          gender: user.gender
        },
        numerologyReady: true
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

// Token Verification Middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: "Access token required" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: "NumPath API is running!", timestamp: new Date().toISOString() });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ✅ Fixed 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(4000, () => {
  console.log("🔮 NumPath Server started on port 4000");
  console.log("✨ Ready to unlock the mysteries of numbers!");
});