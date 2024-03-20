const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env

const app = express();
app.use(express.json());

// MySQL Connection Pool
const db = mysql.createPool({
  connectionLimit: 10, 
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
    } else {
      console.log('Connected to the database!');
      connection.release();
    }
});
// Create a table for storing data
db.query(
  `CREATE TABLE IF NOT EXISTS data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255) NOT NULL
  )`,
  (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Table created successfully!');
    }
  }
);

app.get('/', (req, res) => {
  res.send('Hii, this is the root path!');
});

// API endpoint to insert data into the database
app.post('/api/data', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  db.query('INSERT INTO data (message) VALUES (?)', [message], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Error inserting data' });
    }

    res.json({ message: 'Data inserted successfully!' });
  });
});

app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM data', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Error fetching data' });
    }

    res.json(results);
  });
});

// Start the server
const port = process.env.PORT || 7005;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

