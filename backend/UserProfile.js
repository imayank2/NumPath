const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Enhanced CORS Configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Add explicit preflight handling
app.options('*', cors(corsOptions));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.method !== 'GET') {
    console.log('Request Headers:', req.headers);
  }
  next();
});

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Serve static files for profile images
app.use('/uploads', express.static('uploads'));

const SECRET_KEY = "8h#9G@d92!jdH@3jhs*&1js91!";

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'NumPath',
});

// Enhanced Token Verification Middleware with Debug Logging
function verifyToken(req, res, next) {
  console.log('\n=== TOKEN VERIFICATION DEBUG ===');
  console.log('Request URL:', req.url);
  console.log('Request Method:', req.method);
  
  const authHeader = req.headers['authorization'];
  console.log('Auth Header:', authHeader);
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Extracted Token:', token ? `${token.substring(0, 20)}...` : 'No token');
  console.log('Token Length:', token ? token.length : 0);

  if (!token) {
    console.log('❌ No token provided');
    return res.status(403).json({ 
      error: "Access token required",
      debug: {
        authHeader: authHeader,
        hasAuthHeader: !!authHeader,
        headerKeys: Object.keys(req.headers)
      }
    });
  }

  console.log('🔍 Verifying token with SECRET_KEY...');
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log('❌ Token verification failed:', err.message);
      console.log('Error details:', err);
      return res.status(403).json({ 
        error: "Invalid or expired token",
        debug: {
          jwtError: err.message,
          tokenPreview: token.substring(0, 20) + '...'
        }
      });
    }
    
    console.log('✅ Token verified successfully');
    console.log('User payload:', user);
    req.user = user;
    console.log('=== END TOKEN DEBUG ===\n');
    next();
  });
}

// Helper function to log user activity
const logUserActivity = (userId, activityType, description, ipAddress = null, userAgent = null) => {
  const logSql = "INSERT INTO user_activity (user_id, activity_type, activity_description, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)";
  db.query(logSql, [userId, activityType, description, ipAddress, userAgent], (err) => {
    if (err) console.log("Activity log error:", err);
  });
};

// Helper function to create user session
const createUserSession = (userId, token, ipAddress, userAgent) => {
  const deviceInfo = {
    userAgent: userAgent,
    timestamp: new Date().toISOString()
  };
  
  const sessionSql = "INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, device_info) VALUES (?, ?, ?, ?, ?)";
  db.query(sessionSql, [userId, token, ipAddress, userAgent, JSON.stringify(deviceInfo)], (err) => {
    if (err) console.log("Session create error:", err);
  });
};

// =====================================================
// ADDITIONAL API ENDPOINTS
// =====================================================

// Get User Statistics
app.get('/profile/stats', verifyToken, (req, res) => {
  const userId = req.user.userId;
  
  db.query('CALL GetUserStats(?)', [userId], (err, results) => {
    if (err) {
      console.error("Stats Error:", err);
      return res.status(500).json({ error: "Failed to get user statistics" });
    }
    
    res.json({
      stats: results[0][0] || {},
      message: "User statistics retrieved successfully"
    });
  });
});

// Get User Activity History
app.get('/profile/activity', verifyToken, (req, res) => {
  const userId = req.user.userId;
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  
  const activitySql = `
    SELECT 
      activity_type,
      activity_description,
      ip_address,
      created_at
    FROM user_activity 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?
  `;
  
  db.query(activitySql, [userId, limit, offset], (err, activities) => {
    if (err) {
      console.error("Activity fetch error:", err);
      return res.status(500).json({ error: "Failed to fetch activity history" });
    }
    
    // Get total count
    const countSql = "SELECT COUNT(*) as total FROM user_activity WHERE user_id = ?";
    db.query(countSql, [userId], (err, countResult) => {
      const total = countResult[0]?.total || 0;
      
      res.json({
        activities,
        pagination: {
          current_page: page,
          per_page: limit,
          total: total,
          total_pages: Math.ceil(total / limit)
        }
      });
    });
  });
});

// Get Active Sessions
app.get('/profile/sessions', verifyToken, (req, res) => {
  const userId = req.user.userId;
  
  const sessionsSql = `
    SELECT 
      id,
      ip_address,
      device_info,
      login_time,
      last_activity,
      is_active
    FROM user_sessions 
    WHERE user_id = ? AND is_active = TRUE
    ORDER BY last_activity DESC
    LIMIT 10
  `;
  
  db.query(sessionsSql, [userId], (err, sessions) => {
    if (err) {
      console.error("Sessions fetch error:", err);
      return res.status(500).json({ error: "Failed to fetch active sessions" });
    }
    
    res.json({ sessions });
  });
});

// Logout from specific session
app.delete('/profile/sessions/:sessionId', verifyToken, (req, res) => {
  const userId = req.user.userId;
  const sessionId = req.params.sessionId;
  
  const logoutSessionSql = "UPDATE user_sessions SET is_active = FALSE, logout_time = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?";
  
  db.query(logoutSessionSql, [sessionId, userId], (err, result) => {
    if (err) {
      console.error("Session logout error:", err);
      return res.status(500).json({ error: "Failed to logout session" });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    res.json({ message: "Session logged out successfully" });
  });
});

// Logout from all sessions
app.post('/profile/logout-all', verifyToken, (req, res) => {
  const userId = req.user.userId;
  
  const logoutAllSql = "UPDATE user_sessions SET is_active = FALSE, logout_time = CURRENT_TIMESTAMP WHERE user_id = ?";
  
  db.query(logoutAllSql, [userId], (err, result) => {
    if (err) {
      console.error("Logout all error:", err);
      return res.status(500).json({ error: "Failed to logout all sessions" });
    }
    
    // Log activity
    const clientIp = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    logUserActivity(userId, 'logout', 'Logged out from all sessions', clientIp, userAgent);
    
    res.json({ 
      message: "Logged out from all sessions successfully",
      sessions_closed: result.affectedRows
    });
  });
});

// Get App Settings (public)
app.get('/settings', (req, res) => {
  const settingsSql = "SELECT setting_key, setting_value, setting_type FROM app_settings WHERE is_public = TRUE";
  
  db.query(settingsSql, (err, settings) => {
    if (err) {
      console.error("Settings fetch error:", err);
      return res.status(500).json({ error: "Failed to fetch app settings" });
    }
    
    const formattedSettings = {};
    settings.forEach(setting => {
      let value = setting.setting_value;
      
      // Parse based on type
      switch(setting.setting_type) {
        case 'number':
          value = parseInt(value);
          break;
        case 'boolean':
          value = value === 'true';
          break;
        case 'json':
          try {
            value = JSON.parse(value);
          } catch(e) {
            console.log("JSON parse error for setting:", setting.setting_key);
          }
          break;
      }
      
      formattedSettings[setting.setting_key] = value;
    });
    
    res.json({ settings: formattedSettings });
  });
});

// Update User Preferences
app.put('/profile/preferences', verifyToken, (req, res) => {
  const userId = req.user.userId;
  const preferences = req.body;
  
  const updatePrefSql = `
    INSERT INTO user_profiles (user_id, preferences) 
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE preferences = VALUES(preferences)
  `;
  
  db.query(updatePrefSql, [userId, JSON.stringify(preferences)], (err) => {
    if (err) {
      console.error("Preferences update error:", err);
      return res.status(500).json({ error: "Failed to update preferences" });
    }
    
    res.json({ message: "Preferences updated successfully" });
  });
});

// Export User Data (GDPR Compliance)
app.get('/profile/export', verifyToken, (req, res) => {
  const userId = req.user.userId;
  
  // Get complete user data
  const exportSql = `
    SELECT 
      s.*,
      p.phone, p.address, p.bio, p.occupation, p.preferences,
      l.last_login
    FROM signup s
    LEFT JOIN user_profiles p ON s.id = p.user_id
    LEFT JOIN login l ON s.email = l.email
    WHERE s.id = ?
  `;
  
  db.query(exportSql, [userId], (err, userData) => {
    if (err) {
      console.error("Export error:", err);
      return res.status(500).json({ error: "Failed to export user data" });
    }
    
    // Get activity history
    const activitySql = "SELECT * FROM user_activity WHERE user_id = ? ORDER BY created_at DESC";
    db.query(activitySql, [userId], (err, activities) => {
      if (err) {
        console.error("Activity export error:", err);
        activities = [];
      }
      
      const exportData = {
        user_info: userData[0] || {},
        activity_history: activities,
        export_date: new Date().toISOString(),
        export_format: "JSON"
      };
      
      // Remove sensitive data
      delete exportData.user_info.password;
      
      res.json(exportData);
    });
  });
});

// Database connection and table creation
db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected");
  
  // Create profile table if it doesn't exist
  const createProfileTable = `
    CREATE TABLE IF NOT EXISTS user_profiles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      phone VARCHAR(20),
      address TEXT,
      bio TEXT,
      profile_image VARCHAR(255),
      occupation VARCHAR(100),
      preferences JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES signup(id) ON DELETE CASCADE
    )
  `;
  
  db.query(createProfileTable, (err) => {
    if (err) console.log("Profile table creation error:", err);
    else console.log("Profile table ready");
  });
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Signup API (enhanced)
app.post('/signup', async (req, res) => {
  const { fullName, email, password, dateOfBirth, birthPlace, gender } = req.body;

  console.log('📝 Signup request received:', { fullName, email, dateOfBirth, birthPlace, gender });

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

          console.log('✅ Signup successful, token generated:', token.substring(0, 20) + '...');

          // Log user activity
          const clientIp = req.ip || req.connection.remoteAddress;
          const userAgent = req.get('User-Agent');
          
          // Skip logging if tables don't exist yet
          try {
            logUserActivity(signupResult.insertId, 'signup', `New user registered: ${fullName}`, clientIp, userAgent);
            createUserSession(signupResult.insertId, token, clientIp, userAgent);
          } catch (logError) {
            console.log('Note: Activity logging skipped (tables may not exist yet)');
          }

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

// Login API (enhanced with debugging)
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log('🔐 Login request received for:', email);

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
        // Update last login
        const updateLoginSql = "UPDATE login SET last_login = CURRENT_TIMESTAMP WHERE email = ?";
        db.query(updateLoginSql, [email]);

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

          console.log('✅ Login successful, token generated:', token.substring(0, 20) + '...');
          console.log('User details:', { id: userDetails.id, name: userDetails.name, email });

          // Log user activity and create session
          const clientIp = req.ip || req.connection.remoteAddress;
          const userAgent = req.get('User-Agent');
          
          try {
            logUserActivity(userDetails.id, 'login', `User logged in successfully`, clientIp, userAgent);
            createUserSession(userDetails.id, token, clientIp, userAgent);
          } catch (logError) {
            console.log('Note: Activity logging skipped');
          }

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
        console.log('❌ Password mismatch for:', email);
        res.status(401).json({ error: "Invalid email or password" });
      }
    } else {
      console.log('❌ User not found:', email);
      res.status(401).json({ error: "Invalid email or password" });
    }
  });
});

// Get Complete Profile (READ) - Enhanced with debugging
app.get('/profile', verifyToken, (req, res) => {
  console.log('👤 Profile request received for user:', req.user);
  
  const sql = `
    SELECT 
      s.id, s.name, s.email, s.date_of_birth, s.gender, s.birth_place,
      p.phone, p.address, p.bio, p.profile_image, p.occupation
    FROM signup s
    LEFT JOIN user_profiles p ON s.id = p.user_id
    WHERE s.email = ?
  `;
  
  db.query(sql, [req.user.email], (err, result) => {
    if (err) {
      console.error("Profile Fetch Error:", err);
      return res.status(500).json({ error: "Failed to fetch profile" });
    }

    console.log('Database query result:', result);

    if (result.length > 0) {
      const user = result[0];
      const profileData = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          dateOfBirth: user.date_of_birth,
          birthPlace: user.birth_place,
          gender: user.gender,
          address: user.address || '',
          bio: user.bio || '',
          profileImage: user.profile_image ? `http://localhost:4000/uploads/${user.profile_image}` : null,
          occupation: user.occupation || ''
        }
      };
      
      console.log('✅ Profile data sent:', profileData);
      res.json(profileData);
    } else {
      console.log('❌ User not found in database for email:', req.user.email);
      res.status(404).json({ error: "User not found" });
    }
  });
});

// Update Profile (UPDATE) - Enhanced
app.put('/profile', verifyToken, (req, res) => {
  const { name, phone, dateOfBirth, birthPlace, gender, address, bio, occupation } = req.body;
  const userId = req.user.userId;

  console.log('📝 Profile update request for user ID:', userId);
  console.log('Update data:', { name, phone, dateOfBirth, birthPlace, gender, address, bio, occupation });

  if (dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    if (isNaN(birthDate.getTime()) || birthDate > today) {
      return res.status(400).json({ error: "Invalid date of birth" });
    }
  }

  // Start transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Transaction failed" });
    }

    // Update signup table
    const updateSignupSql = "UPDATE signup SET name = ?, date_of_birth = ?, birth_place = ?, gender = ? WHERE id = ?";
    db.query(updateSignupSql, [name, dateOfBirth, birthPlace, gender, userId], (err, signupResult) => {
      if (err) {
        return db.rollback(() => {
          console.error("Signup Update Error:", err);
          res.status(500).json({ error: "Failed to update basic profile" });
        });
      }

      // Update or insert profile data
      const upsertProfileSql = `
        INSERT INTO user_profiles (user_id, phone, address, bio, occupation) 
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        phone = VALUES(phone), 
        address = VALUES(address), 
        bio = VALUES(bio), 
        occupation = VALUES(occupation)
      `;
      
      db.query(upsertProfileSql, [userId, phone, address, bio, occupation], (err, profileResult) => {
        if (err) {
          return db.rollback(() => {
            console.error("Profile Update Error:", err);
            res.status(500).json({ error: "Failed to update extended profile" });
          });
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: "Failed to commit changes" });
            });
          }

          console.log('✅ Profile updated successfully for user ID:', userId);

          // Log activity
          const clientIp = req.ip || req.connection.remoteAddress;
          const userAgent = req.get('User-Agent');
          try {
            logUserActivity(userId, 'profile_update', 'Profile information updated', clientIp, userAgent);
          } catch (logError) {
            console.log('Note: Activity logging skipped');
          }

          res.json({ message: "Profile updated successfully!" });
        });
      });
    });
  });
});

// Upload Profile Image - Enhanced
app.post('/profile/upload-image', verifyToken, upload.single('profileImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }

  const userId = req.user.userId;
  const filename = req.file.filename;
  const fileSize = req.file.size;
  const fileType = req.file.mimetype;
  const originalName = req.file.originalname;

  console.log('📷 Image upload for user ID:', userId, 'File:', filename);

  // Get old image to delete it
  const getOldImageSql = "SELECT profile_image FROM user_profiles WHERE user_id = ?";
  db.query(getOldImageSql, [userId], (err, result) => {
    if (err) {
      console.error("Get old image error:", err);
    } else if (result.length > 0 && result[0].profile_image) {
      // Delete old image file
      const oldImagePath = path.join('uploads', result[0].profile_image);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.log("Failed to delete old image:", err);
      });
    }

    // Update profile with new image
    const updateImageSql = `
      INSERT INTO user_profiles (user_id, profile_image) 
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE profile_image = VALUES(profile_image)
    `;
    
    db.query(updateImageSql, [userId, filename], (err, updateResult) => {
      if (err) {
        console.error("Image Update Error:", err);
        return res.status(500).json({ error: "Failed to update profile image" });
      }

      console.log('✅ Profile image updated successfully');

      // Log activity
      const clientIp = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');
      try {
        logUserActivity(userId, 'profile_update', 'Profile image updated', clientIp, userAgent);
      } catch (logError) {
        console.log('Note: Activity logging skipped');
      }

      res.json({ 
        message: "Profile image updated successfully!",
        imageUrl: `http://localhost:4000/uploads/${filename}`
      });
    });
  });
});

// Delete Profile Image
app.delete('/profile/image', verifyToken, (req, res) => {
  const userId = req.user.userId;

  const getImageSql = "SELECT profile_image FROM user_profiles WHERE user_id = ?";
  db.query(getImageSql, [userId], (err, result) => {
    if (err) {
      console.error("Get image error:", err);
      return res.status(500).json({ error: "Failed to get profile image" });
    }

    if (result.length > 0 && result[0].profile_image) {
      const imagePath = path.join('uploads', result[0].profile_image);
      
      // Delete file from filesystem
      fs.unlink(imagePath, (err) => {
        if (err) console.log("Failed to delete image file:", err);
      });

      // Remove from database
      const deleteImageSql = "UPDATE user_profiles SET profile_image = NULL WHERE user_id = ?";
      db.query(deleteImageSql, [userId], (err) => {
        if (err) {
          console.error("Delete image error:", err);
          return res.status(500).json({ error: "Failed to delete profile image" });
        }
        res.json({ message: "Profile image deleted successfully!" });
      });
    } else {
      res.status(404).json({ error: "No profile image found" });
    }
  });
});

// Change Password
app.put('/profile/change-password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const email = req.user.email;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current password and new password are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters long" });
  }

  try {
    // Verify current password
    const getCurrentPasswordSql = "SELECT password FROM login WHERE email = ?";
    db.query(getCurrentPasswordSql, [email], async (err, result) => {
      if (err) {
        console.error("Get password error:", err);
        return res.status(500).json({ error: "Failed to verify current password" });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const match = await bcrypt.compare(currentPassword, result[0].password);
      if (!match) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      // Hash new password and update
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      
      const updatePasswordSql = "UPDATE login SET password = ? WHERE email = ?";
      db.query(updatePasswordSql, [hashedNewPassword, email], (err) => {
        if (err) {
          console.error("Password update error:", err);
          return res.status(500).json({ error: "Failed to update password" });
        }
        
        // Also update in signup table for consistency
        const updateSignupPasswordSql = "UPDATE signup SET password = ? WHERE email = ?";
        db.query(updateSignupPasswordSql, [hashedNewPassword, email], (err) => {
          if (err) console.log("Signup password update error:", err);
        });

        // Log activity
        const clientIp = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent');
        try {
          logUserActivity(req.user.userId, 'password_change', 'Password changed successfully', clientIp, userAgent);
        } catch (logError) {
          console.log('Note: Activity logging skipped');
        }

        res.json({ message: "Password changed successfully!" });
      });
    });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Delete Account (DELETE)
app.delete('/profile/delete-account', verifyToken, async (req, res) => {
  const { password } = req.body;
  const userId = req.user.userId;
  const email = req.user.email;

  if (!password) {
    return res.status(400).json({ error: "Password is required to delete account" });
  }

  try {
    // Verify password before deletion
    const getPasswordSql = "SELECT password FROM login WHERE email = ?";
    db.query(getPasswordSql, [email], async (err, result) => {
      if (err) {
        console.error("Get password error:", err);
        return res.status(500).json({ error: "Failed to verify password" });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const match = await bcrypt.compare(password, result[0].password);
      if (!match) {
        return res.status(401).json({ error: "Password is incorrect" });
      }

      // Start transaction for account deletion
      db.beginTransaction((err) => {
        if (err) {
          return res.status(500).json({ error: "Transaction failed" });
        }

        // Get profile image to delete file
        const getImageSql = "SELECT profile_image FROM user_profiles WHERE user_id = ?";
        db.query(getImageSql, [userId], (err, imageResult) => {
          if (!err && imageResult.length > 0 && imageResult[0].profile_image) {
            const imagePath = path.join('uploads', imageResult[0].profile_image);
            fs.unlink(imagePath, (err) => {
              if (err) console.log("Failed to delete profile image:", err);
            });
          }

          // Delete from login table
          const deleteLoginSql = "DELETE FROM login WHERE email = ?";
          db.query(deleteLoginSql, [email], (err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Delete login error:", err);
                res.status(500).json({ error: "Failed to delete account" });
              });
            }

            // Delete from signup table (this will cascade delete profile due to foreign key)
            const deleteSignupSql = "DELETE FROM signup WHERE id = ?";
            db.query(deleteSignupSql, [userId], (err) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Delete signup error:", err);
                  res.status(500).json({ error: "Failed to delete account" });
                });
              }

              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    res.status(500).json({ error: "Failed to commit account deletion" });
                  });
                }

                console.log('✅ Account deleted successfully for user ID:', userId);
                res.json({ message: "Account deleted successfully!" });
              });
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("Account deletion error:", error);
    res.status(500).json({ error: "Something went wrong during account deletion" });
  }
});

// Dashboard (existing)
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

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: "NumPath API is running!", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Token validation endpoint (for frontend debugging)
app.get('/validate-token', verifyToken, (req, res) => {
  res.json({ 
    valid: true, 
    user: req.user,
    message: "Token is valid"
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.stack);
  
  // Handle multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum 5MB allowed.' });
    }
  }
  
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 Handler
app.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.method, req.url);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    url: req.url,
    available_routes: [
      'POST /signup',
      'POST /login', 
      'GET /profile',
      'PUT /profile',
      'POST /profile/upload-image',
      'DELETE /profile/image',
      'PUT /profile/change-password',
      'DELETE /profile/delete-account',
      'GET /dashboard',
      'GET /health',
      'GET /validate-token'
    ]
  });
});

// Start Server
app.listen(4000, () => {
  console.log("🔮 NumPath Server started on port 4000");
  console.log("✨ Ready to unlock the mysteries of numbers!");
  console.log("📁 Profile images will be served from: http://localhost:4000/uploads/");
  console.log("🔧 Debug mode enabled - check console for detailed logs");
  console.log("🌐 CORS enabled for: http://localhost:3000");
});