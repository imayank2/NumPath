const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'NumPath'
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected to NumPath");
});

// Name + DOB API
app.post('/submit', (req, res) => {
  const { full_name, dob } = req.body;

  const sql = "INSERT INTO user_dob (full_name, dob) VALUES (?, ?)";
  db.query(sql, [full_name, dob], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Database error");
    } else {
      res.send("User info saved");
    }
  });
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
