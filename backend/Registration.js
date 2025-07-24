const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

//  Connect MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'NumPath', 
//   port: 3306
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected");
});

// Signup API
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, password], (err, result) => {
    if (err) throw err;
    res.send("User Registered");
  });
});

//  Login API
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send("Login Successful");
    } else {
      res.send("Invalid Email or Password");
    }
  });
});

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
