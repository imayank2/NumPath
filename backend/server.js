const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch"); // Add this for chat functionality
const dotenv = require("dotenv");
dotenv.config();
// Create Express app
const app = express();



// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// Secret key for JWT
const SECRET_KEY = "process.env.JET_API_KEY";

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "NumPath",
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database - NumPath");
});

// ==================
// MIDDLEWARE
// ==================

// JWT verification middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Access token required" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
}

// ==================
// AUTHENTICATION
// ==================

// User signup
app.post("/signup", async (req, res) => {
  const { fullName, name, email, password, dateOfBirth, birthPlace, gender } =
    req.body;

  // Use fullName if provided, otherwise use name
  const userName = fullName || name;

  // Validation
  if (!userName || !email || !password) {
    return res.status(400).json({
      error: "Name, email and password are required",
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({
      error: "Password must be at least 6 characters long",
    });
  }

  try {
    // Check if user already exists
    const checkUserSql = "SELECT email FROM signup WHERE email = ?";
    db.query(checkUserSql, [email], async (err, result) => {
      if (err) {
        console.error("Database Check Error:", err);
        return res.status(500).json({ error: "Database error occurred" });
      }

      if (result.length > 0) {
        return res.status(409).json({
          error: "User already exists with this email",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert into signup table
      const signupSql = `
        INSERT INTO signup (name, email, password, date_of_birth, gender, birth_place) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        signupSql,
        [
          userName,
          email,
          hashedPassword,
          dateOfBirth || null,
          gender || null,
          birthPlace || null,
        ],
        (err, signupResult) => {
          if (err) {
            console.error("Signup Error:", err);
            return res.status(500).json({ error: "Signup failed" });
          }

          // Insert into login table
          const loginSql = "INSERT INTO login (email, password) VALUES (?, ?)";
          db.query(loginSql, [email, hashedPassword], (err) => {
            if (err) {
              console.error("Login Insert Error:", err);
              return res.status(500).json({
                error: "Signup success, but login setup failed",
              });
            }

            // Create JWT token
            const token = jwt.sign(
              {
                userId: signupResult.insertId,
                email: email,
                name: userName,
              },
              SECRET_KEY,
              { expiresIn: "24h" }
            );

            res.status(201).json({
              message: "Signup successful! Welcome to NumPath!",
              token,
              user: {
                id: signupResult.insertId,
                name: userName,
                email,
                dateOfBirth: dateOfBirth || null,
                birthPlace: birthPlace || null,
                gender: gender || null,
              },
            });
          });
        }
      );
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Something went wrong during signup" });
  }
});

// User login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  const loginSql = "SELECT * FROM login WHERE email = ?";
  db.query(loginSql, [email], async (err, loginResult) => {
    if (err) {
      console.error("Login Error:", err);
      return res.status(500).json({ error: "Login failed" });
    }

    if (loginResult.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const loginUser = loginResult[0];
    const match = await bcrypt.compare(password, loginUser.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Get user details from signup table
    const userDetailsSql = `
      SELECT id, name, email, date_of_birth, gender, birth_place 
      FROM signup WHERE email = ?
    `;

    db.query(userDetailsSql, [email], (err, signupResult) => {
      if (err) {
        console.error("User Details Error:", err);
        return res.status(500).json({
          error: "Login successful but failed to fetch user details",
        });
      }

      const userDetails = signupResult[0] || {};

      // Create JWT token
      const token = jwt.sign(
        {
          userId: userDetails.id || null,
          email: email,
          name: userDetails.name || "User",
        },
        SECRET_KEY,
        { expiresIn: "24h" }
      );

      res.json({
        message: "Login successful! Welcome back to NumPath!",
        token,
        user: {
          id: userDetails.id,
          name: userDetails.name,
          email: userDetails.email,
          dateOfBirth: userDetails.date_of_birth,
          birthPlace: userDetails.birth_place,
          gender: userDetails.gender,
        },
      });
    });
  });
});

// ==================
// PROFILE ROUTES
// ==================

// 1. GET USER PROFILE - Get current user's profile information
app.get("/profile", verifyToken, (req, res) => {
  // Get user details from signup table
  const sql = `
    SELECT id, name, email, date_of_birth, gender, birth_place 
    FROM signup WHERE email = ?
  `;

  db.query(sql, [req.user.email], (err, result) => {
    if (err) {
      console.error("Get Profile Error:", err);
      return res.status(500).json({ error: "Failed to get profile" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "User profile not found" });
    }

    const user = result[0];
    res.json({
      message: "Profile retrieved successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.date_of_birth,
        birthPlace: user.birth_place,
        gender: user.gender,
      },
    });
  });
});

// 2. UPDATE USER PROFILE - Update current user's profile
app.put("/profile", verifyToken, (req, res) => {
  const { name, dateOfBirth, birthPlace, gender } = req.body;

  // Validation
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  // Update user profile in signup table
  const sql = `
    UPDATE signup 
    SET name = ?, date_of_birth = ?, birth_place = ?, gender = ?
    WHERE email = ?
  `;

  db.query(
    sql,
    [name, dateOfBirth || null, birthPlace || null, gender || null, req.user.email],
    (err, result) => {
      if (err) {
        console.error("Update Profile Error:", err);
        return res.status(500).json({ error: "Failed to update profile" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        message: "Profile updated successfully",
        user: {
          name,
          email: req.user.email,
          dateOfBirth: dateOfBirth || null,
          birthPlace: birthPlace || null,
          gender: gender || null,
        },
      });
    }
  );
});

// 3. GET ALL PROFILES - Get all family/friend profiles for current user
app.get("/profiles", verifyToken, (req, res) => {
  // Get all profiles created by current user
  const sql = "SELECT * FROM profiles WHERE useremail = ? ORDER BY created_at DESC";

  db.query(sql, [req.user.email], (err, results) => {
    if (err) {
      console.error("Get Profiles Error:", err);
      return res.status(500).json({ error: "Failed to get profiles" });
    }

    res.json({
      message: "Profiles retrieved successfully",
      profiles: results,
      count: results.length,
    });
  });
});

// 4. ADD NEW PROFILE - Add new family/friend profile
app.post("/profiles", verifyToken, (req, res) => {
  const { name, dob, tim, place } = req.body;

  // Validation
  if (!name || !dob || !tim || !place) {
    return res.status(400).json({
      error: "All fields are required (name, dob, tim, place)",
    });
  }

  // Insert new profile
  const sql = `
    INSERT INTO profiles (name, useremail, dob, tim, place, created_at) 
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.query(sql, [name, req.user.email, dob, tim, place], (err, result) => {
    if (err) {
      console.error("Add Profile Error:", err);
      return res.status(500).json({ error: "Failed to add profile" });
    }

    res.status(201).json({
      message: "Profile added successfully",
      profile: {
        id: result.insertId,
        name,
        useremail: req.user.email,
        dob,
        tim,
        place,
      },
    });
  });
});

// 5. UPDATE PROFILE - Update existing family/friend profile
app.put("/profiles/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, dob, tim, place } = req.body;

  // Validation
  if (!name || !dob || !tim || !place) {
    return res.status(400).json({
      error: "All fields are required (name, dob, tim, place)",
    });
  }

  // Update profile (only if it belongs to current user)
  const sql = `
    UPDATE profiles 
    SET name = ?, dob = ?, tim = ?, place = ?, updated_at = NOW() 
    WHERE id = ? AND useremail = ?
  `;

  db.query(sql, [name, dob, tim, place, id, req.user.email], (err, result) => {
    if (err) {
      console.error("Update Profile Error:", err);
      return res.status(500).json({ error: "Failed to update profile" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Profile not found or you don't have permission to update it",
      });
    }

    res.json({
      message: "Profile updated successfully",
      profile: {
        id,
        name,
        dob,
        tim,
        place,
      },
    });
  });
});

// 6. DELETE PROFILE - Delete family/friend profile
app.delete("/profiles/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  // Delete profile (only if it belongs to current user)
  const sql = "DELETE FROM profiles WHERE id = ? AND useremail = ?";

  db.query(sql, [id, req.user.email], (err, result) => {
    if (err) {
      console.error("Delete Profile Error:", err);
      return res.status(500).json({ error: "Failed to delete profile" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Profile not found or you don't have permission to delete it",
      });
    }

    res.json({
      message: "Profile deleted successfully",
      deletedId: id,
    });
  });
});

// 7. GET SINGLE PROFILE - Get specific profile details
app.get("/profiles/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  // Get specific profile (only if it belongs to current user)
  const sql = "SELECT * FROM profiles WHERE id = ? AND useremail = ?";

  db.query(sql, [id, req.user.email], (err, result) => {
    if (err) {
      console.error("Get Single Profile Error:", err);
      return res.status(500).json({ error: "Failed to get profile" });
    }

    if (result.length === 0) {
      return res.status(404).json({
        error: "Profile not found or you don't have permission to view it",
      });
    }

    res.json({
      message: "Profile retrieved successfully",
      profile: result[0],
    });
  });
});

// ====================
// DASHBOARD
// ==================

app.get("/dashboard", verifyToken, (req, res) => {
  const sql = `
    SELECT name, email, date_of_birth, birth_place, gender 
    FROM signup WHERE email = ?
  `;

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
          gender: user.gender,
        },
        numerologyReady: true,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

// ==================
// CHAT FUNCTIONALITY 
// ==================

// Chat endpoint - Fixed Mistral integration
// app.post("/chat", async (req, res) => {
//   console.log("💬 Chat request received:", req.body);
  
//   const { message } = req.body;

//   // Validation
//   if (!message) {
//     return res.status(400).json({ error: "Message is required" });
//   }

//   try {
//     console.log("🤖 Sending to NumPath:", message);
    
//     // Create better prompt for numerology context
//     const numerologyPrompt = `You are a numerology expert and spiritual guide. A user asks: "${message}". 
//     Provide a helpful, mystical, and informative response about numerology, life path numbers, destiny numbers, or spiritual guidance. 
//     Keep the response conversational, engaging, and under 200 words. Use emojis where appropriate.`;

//     const response = await fetch("http://localhost:11434/api/generate", {
//       method: "POST",
//       headers: { 
//         "Content-Type": "application/json" 
//       },
//       body: JSON.stringify({
//         model: "numpath-bot",
//         prompt: numerologyPrompt,
//         stream: false, // Important: Set to false for simpler response
//         temperature: 0.7,
//         max_tokens: 300
//       })
//     });

//     console.log(" response status:", response.status);

//     if (!response.ok) {
//       throw new Error(`Mistral API error! Status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log(" Mistral response received");

//     // Send the response back
//     res.json({ 
//       reply: data.response || "Sorry, I couldn't generate a response.",
//       source: "Mistral AI",
//       timestamp: new Date().toISOString()
//     });

//   } catch (error) {
//     console.error("Chat Error:", error.message);
    
//     // Return error with helpful message
//     res.status(500).json({ 
//       error: "Failed to connect to Mistral AI",
//       details: error.message,
//       solution: "Make sure Ollama is running with: ollama serve"
//     });
//   }
// });

// app.post("/chat", async (req, res) => {
//   console.log("💬 Chat request received:", req.body);

//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: "Message is required" });
//   }

//   try {
//     const numerologyPrompt = `You are a numerology expert and spiritual guide. A user asks: "${message}". 
//     Provide a helpful, mystical, and informative response about numerology, life path numbers, destiny numbers, or spiritual guidance. 
//     Keep the response conversational, engaging, and under 200 words. Use emojis where appropriate.`;

//     const response = await fetch("http://localhost:11434/api/generate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         model: "numpath-bot",
//         prompt: numerologyPrompt,
//         stream: false,
//         temperature: 0.7,
//         num_predict: 300
//       })
//     });

//     console.log("📡 Ollama status:", response.status);

//     const text = await response.text();
//     console.log("📦 Ollama raw response:", text);

//     if (!response.ok) {
//       return res.status(500).json({
//         error: "Ollama API error",
//         status: response.status,
//         details: text
//       });
//     }

//     const data = JSON.parse(text);

//     res.json({
//       reply: data.response || "No reply from AI",
//       source: "Mistral AI",
//       timestamp: new Date().toISOString()
//     });

//   } catch (error) {
//     console.error("❌ Chat Error:", error);
//     res.status(500).json({
//       error: "Chat backend failed",
//       details: error.message
//     });
//   }
// });

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "numpath-bot",
        prompt: message,
        stream: false
      })
    });

    const data = await response.json();
    res.json({ reply: data.response || "No reply", source: "Mistral AI" });

  } catch (err) {
    console.error("Chat Error:", err.message);
    res.status(500).json({ error: "Backend chat failed", details: err.message });
  }
});


// Test Mistral connection
app.get("/chat/test-mistral", async (req, res) => {
  try {
    const response = await fetch("http://localhost:11434/api/tags");
    
    if (response.ok) {
      const models = await response.json();
      res.json({
        status: "✅ connection working!",
        available_models: models.models || [],
        test_message: "Try sending a message to /chat endpoint"
      });
    } else {
      throw new Error("Ollama not responding");
    }
  } catch (error) {
    res.status(500).json({
      status: "❌  connection failed",
      error: error.message,
      solution: "Run: ollama serve (then: ollama pull mistral)"
    });
  }
});

// ==================
// NUMEROLOGY DATA
// ==================

// Name + DOB API (from your third server)
app.post("/submit", verifyToken, (req, res) => {
  const { full_name, dob } = req.body;

  const sql = "INSERT INTO user_dob (full_name, dob) VALUES (?, ?)";
  db.query(sql, [full_name, dob], (err, result) => {
    if (err) {
      console.error("Submit Error:", err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json({
        message: "User info saved successfully",
        id: result.insertId,
      });
    }
  });
});

// ==================
// UTILITY ROUTES
// ==================

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "✅ NumPath API is running!",
    timestamp: new Date().toISOString(),
    endpoints: [
      "POST /signup - User registration",
      "POST /login - User login",
      "GET /profile - Get user profile",
      "PUT /profile - Update user profile",
      "GET /profiles - Get family profiles",
      "POST /profiles - Add family profile",
      "PUT /profiles/:id - Update family profile",
      "DELETE /profiles/:id - Delete family profile",
      "GET /profiles/:id - Get single profile",
      "GET /dashboard - User dashboard",
      "POST /submit - Submit name and DOB for numerology",
      "POST /chat - AI Chat functionality",
    ],
  });
});

// ==================
// ERROR HANDLING
// ==================

// Error Handler      
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    availableEndpoints: [
      "POST /signup",
      "POST /login",
      "GET /profile",
      "PUT /profile",
      "GET /profiles",
      "POST /profiles",
      "PUT /profiles/:id",
      "DELETE /profiles/:id",
      "GET /profiles/:id",
      "GET /dashboard",
      "POST /submit",
      "POST /chat",
      "GET /health",
    ],
  });
});

// ==================
// START SERVER
// ==================

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 NumPath Server started on http://localhost:${PORT}`);
  console.log(`✨ Ready to unlock the mysteries of numbers!`);
  console.log(`🤖 Chat functionality enabled with AI integration!`);
  console.log(`📊 Available endpoints:`);
  console.log(`   POST /signup - User registration`);
  console.log(`   POST /login - User login`);
  console.log(`   GET /profile - Get current user profile`);
  console.log(`   PUT /profile - Update current user profile`);
  console.log(`   GET /profiles - Get all family/friend profiles`);
  console.log(`   POST /profiles - Add new family/friend profile`);
  console.log(`   GET /profiles/:id - Get specific profile`);
  console.log(`   PUT /profiles/:id - Update specific profile`);
  console.log(`   DELETE /profiles/:id - Delete specific profile`);
  console.log(`   GET /dashboard - User dashboard`);
  console.log(`   POST /submit - Submit name and DOB`);
  console.log(`   POST /chat - AI Chat functionality`);
  console.log(`   GET /health - Health check`);
});