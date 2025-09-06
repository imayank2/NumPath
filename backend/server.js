// NumPath Server - Local Development Version
// This is a beginner-friendly, fully functional local server

const express = require("express");
const { Pool } = require('pg');
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

console.log(" Starting NumPath Server...");
console.log("Environment:", process.env.NODE_ENV || 'development');

// Create Express app
const app = express();

// ====================
// MIDDLEWARE
// ====================

// Enable CORS for local development
app.use(cors({
  origin: ['https://numpath-frontend.onrender.com'],
  credentials: true
}));

// Parse JSON data
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json());

// Serve static files
app.use("/uploads", express.static("uploads"));

// ====================
// CONFIGURATION
// ====================

const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret_key_for_local_dev';
const PORT = process.env.PORT || 4000;

// Database connection for local development
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'numpath',
  password: process.env.PGPASSWORD || 'postgres',
  port: process.env.PGPORT || 5432,
  // No SSL for local development
  ssl: false
});

// Test database connection
async function testDatabaseConnection() {
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    console.log(' Database connected successfully!');
    console.log(`Current time from database: ${result.rows[0].current_time}`);
    
    // Test if tables exist
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'profiles')
    `);
    
    console.log(` Found ${tableCheck.rows.length} tables:`, 
                tableCheck.rows.map(row => row.table_name));
                
    if (tableCheck.rows.length < 2) {
      console.log('  Missing tables. Please run the database setup SQL commands.');
    }
    
  } catch (error) {
    console.error(' Database connection failed:', error.message);
    console.log(' Make sure PostgreSQL is running and check your .env file');
  }
}

// Test connection on startup
testDatabaseConnection();

// ====================
// HELPER FUNCTIONS
// ====================

// JWT verification middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Access token required" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log('JWT verification failed:', err.message);
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
}

// ====================
// AUTHENTICATION ROUTES
// ====================

// User Registration
app.post("/signup", async (req, res) => {
  console.log("\n=== SIGNUP REQUEST ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  
  try {
    const { fullName, name, email, password, dateOfBirth, birthPlace, gender, phoneNumber } = req.body;
    
    // Use fullName if provided, otherwise use name
    const userName = fullName || name;
    
    console.log("Processed data:");
    console.log("- userName:", userName);
    console.log("- email:", email);
    console.log("- password:", password ? "[PROVIDED]" : "[MISSING]");
    console.log("- dateOfBirth:", dateOfBirth);
    console.log("- birthPlace:", birthPlace);
    console.log("- gender:", gender);
    console.log("- phoneNumber:", phoneNumber);

    // Validation
    if (!userName || !email || !password) {
      console.log(" Validation failed: Missing required fields");
      return res.status(400).json({
        error: "Name, email and password are required",
        received: { 
          userName: !!userName, 
          email: !!email, 
          password: !!password 
        }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log(" Invalid email format");
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Password validation
    if (password.length < 6) {
      console.log("Password too short");
      return res.status(400).json({
        error: "Password must be at least 6 characters long"
      });
    }

    console.log(" All validations passed");

    // Check if user exists
    console.log("Checking if user exists...");
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      console.log(" User already exists");
      return res.status(400).json({
        error: "User already exists with this email"
      });
    }

    console.log(" Email is available");

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(" Password hashed");

    // Insert user
    console.log("Creating new user...");
    const result = await pool.query(
      `INSERT INTO users (fullname, email, password, dob, gender, birth_place) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, fullname as "name", email, 
                dob as "dateOfBirth", 
                gender, 
                birth_place as "birthPlace"`,
      [userName, email, hashedPassword, dateOfBirth || null, gender || null, birthPlace || null]
    );

    const newUser = result.rows[0];
    console.log(" User created with ID:", newUser.id);

    // Generate token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    console.log(" JWT token generated");
    console.log("=== SIGNUP SUCCESS ===\n");

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: newUser
    });

  } catch (error) {
    console.error("=== SIGNUP ERROR ===");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.error("=====================\n");
    
    res.status(500).json({ 
      error: "Registration failed",
      details: error.message
    });
  }
});

// User Login
app.post("/login", async (req, res) => {
  console.log("\n=== LOGIN REQUEST ===");
  
  try {
    const { email, password } = req.body;
    
    console.log("Login attempt for:", email);

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required"
      });
    }

    // Find user
    const result = await pool.query(
      `SELECT id, fullname as "name", email, password, 
              dob as "dateOfBirth", 
              gender, 
              birth_place as "birthPlace" 
       FROM users 
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      console.log(" User not found");
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(" Invalid password");
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    console.log(" Login successful for user ID:", user.id);
    console.log("=== LOGIN SUCCESS ===\n");

    res.json({
      message: "Login successful",
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error("=== LOGIN ERROR ===");
    console.error("Error:", error.message);
    console.error("==================\n");
    
    res.status(500).json({ error: "Login failed" });
  }
});

// ====================
// PROFILE ROUTES
// ====================

// Get current user profile
app.get("/profile", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, fullname as "name", email, 
              dob as "dateOfBirth", 
              gender, 
              birth_place as "birthPlace"
       FROM users 
       WHERE id = $1`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Error fetching profile" });
  }
});

// Update user profile
app.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, dateOfBirth, gender, birthPlace } = req.body;
    const userId = req.user.userId;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const result = await pool.query(
      `UPDATE users 
       SET fullname = $1, 
           dob = $2, 
           gender = $3, 
           birth_place = $4 
       WHERE id = $5
       RETURNING id, fullname as "name", email, 
                dob as "dateOfBirth", 
                gender, 
                birth_place as "birthPlace"`,
      [name, dateOfBirth || null, gender || null, birthPlace || null, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Error updating profile" });
  }
});

// ====================
// FAMILY/FRIEND PROFILES
// ====================


// Get all profiles for user
app.get("/profiles", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, dob, tim, place, created_at as "createdAt" 
       FROM profiles 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.user.userId]
    );
    res.json({ profiles: result.rows });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ error: "Error fetching profiles" });
  }
});

// Create new profile
app.post("/profiles", verifyToken, async (req, res) => {
  try {
    const { name, dob, tim, place } = req.body;

    if (!name || !dob || !tim || !place) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await pool.query(
      `INSERT INTO profiles (user_id, name, dob, tim, place) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, dob, tim, place, created_at as "createdAt"`,
      [req.user.userId, name, dob, tim, place]
    );

    res.status(201).json({
      message: "Profile created successfully",
      profile: result.rows[0]
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ error: "Error creating profile" });
  }
});


// Get single profile
app.get("/profiles/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT id, name, dob, tim, place, created_at as "createdAt" 
       FROM profiles 
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Error fetching profile" });
  }
});

// Update profile
app.put("/profiles/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dob, tim, place } = req.body;

    if (!name || !dob || !tim || !place) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await pool.query(
      `UPDATE profiles 
       SET name = $1, dob = $2, tim = $3, place = $4 
       WHERE id = $5 AND user_id = $6
       RETURNING id, name, dob, tim, place, created_at as "createdAt"`,
      [name, dob, tim, place, id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json({ 
      message: "Profile updated successfully",
      profile: result.rows[0]
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Error updating profile" });
  }
});

// Delete profile
app.delete("/profiles/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      "DELETE FROM profiles WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ error: "Error deleting profile" });
  }
});

// ====================
// DASHBOARD
// ====================

app.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT fullname as "name", email, dob as "dateOfBirth", 
              birth_place as "birthPlace", gender 
       FROM users 
       WHERE email = $1`,
      [req.user.email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    res.json({
      message: `Welcome to your mystical dashboard, ${user.name}!`,
      user: {
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        birthPlace: user.birthPlace,
        gender: user.gender
      },
      numerologyReady: true
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

// ====================
// DEBUG ROUTES (for local development)
// ====================

// Database health check
app.get("/debug/database", async (req, res) => {
  try {
    const connectionTest = await pool.query('SELECT NOW() as current_time');
    
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'profiles')
    `);
    
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    
    res.json({
      status: "Database connected",
      timestamp: connectionTest.rows[0].current_time,
      tables: tableCheck.rows.map(row => row.table_name),
      userCount: userCount.rows[0].count,
      poolInfo: {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "Database connection failed",
      error: error.message
    });
  }
});

// Test signup without database
app.post("/debug/signup-test", (req, res) => {
  console.log("=== SIGNUP TEST ===");
  console.log("Body:", req.body);
  
  const { fullName, name, email, password } = req.body;
  const userName = fullName || name;
  
  res.json({
    message: "Signup test completed",
    received: {
      fullName,
      name,
      email: email ? "[PROVIDED]" : "[MISSING]",
      password: password ? "[PROVIDED]" : "[MISSING]",
      computedUserName: userName
    },
    validation: {
      hasUserName: !!userName,
      hasEmail: !!email,
      hasPassword: !!password,
      emailFormat: email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : false
    }
  });
});

// ====================
// UTILITY ROUTES
// ====================

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "NumPath Server running locally!",
    timestamp: new Date().toISOString(),
    version: "1.0.0-local",
    port: PORT,
    endpoints: [
      "POST /signup - User registration",
      "POST /login - User login",
      "GET /profile - Get user profile",
      "PUT /profile - Update user profile",
      "GET /profiles - Get family profiles",
      "POST /profiles - Add family profile",
      "GET /profiles/:id - Get single profile",
      "PUT /profiles/:id - Update family profile",
      "DELETE /profiles/:id - Delete family profile",
      "GET /dashboard - User dashboard",
      "GET /debug/database - Database check",
      "POST /debug/signup-test - Test signup data processing"
    ]
  });
});

// ====================
// ERROR HANDLING
// ====================

app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
    message: "Check the available endpoints at /health"
  });
});

// ====================
// START SERVER
// ====================

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log(' NumPath Local Development Server Started!');
  console.log('='.repeat(60));
  console.log(` Server running on: http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Database: PostgreSQL on localhost:${process.env.PGPORT || 5432}`);
  console.log('');
  console.log(' Quick Test URLs:');
  console.log(`   Health Check: http://localhost:${PORT}/health`);
  console.log(`   Database Check: http://localhost:${PORT}/debug/database`);
  console.log('');
  console.log(' Ready for local development!');
  console.log('   Frontend should connect to: http://localhost:' + PORT);
  console.log('='.repeat(60) + '\n');
});
