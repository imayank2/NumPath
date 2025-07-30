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
  const { name, email, password, gender, birth_place } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const signupSql = "INSERT INTO signup (name, email, password, gender, birth_place) VALUES (?, ?, ?, ?, ?)";
    db.query(signupSql, [name, email, hashedPassword, gender, birth_place], (err) => {
      if (err) {
        console.error("Signup Error:", err);
        return res.status(500).send("Signup Failed");
      }

      const loginSql = "INSERT INTO login (email, password) VALUES (?, ?)";
      db.query(loginSql, [email, hashedPassword], (err) => {
        if (err) {
          console.error("Login Insert Error:", err);
          return res.status(500).send("Signup success, but login insert failed");
        }

        res.status(201).send("Signup Successful");
      });
    });
  } catch (error) {
    console.error("Bcrypt Error:", error);
    res.status(500).send("Something went wrong");
  }
});

// Login API with JWT
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM login WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error("Login Error:", err);
      return res.status(500).send("Login Failed");
    }

    if (result.length > 0) {
      const storedHash = result[0].password;
      const match = await bcrypt.compare(password, storedHash);

      if (match) {
        // Generate JWT token
        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: "Login Successful", token });
      } else {
        res.status(401).send("Invalid Email or Password");
      }
    } else {
      res.status(401).send("Invalid Email or Password");
    }
  });
});

//  Protected Route
app.get('/dashboard', verifyToken, (req, res) => {
  res.send(`Hello ${req.user.email}, welcome to the dashboard!`);
});

// Middleware to verify token
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.sendStatus(403);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
