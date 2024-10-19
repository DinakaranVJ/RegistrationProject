// backend/index.js
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  
    password: 'dina11', 
    database: 'registration_db'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL!');
});

// CRUD operations

// Create
app.post('/api/registrations', (req, res) => {
    const { Name, Email, DateOfBirth, RegistrationStatus } = req.body;
    const sql = 'INSERT INTO Registration (Name, Email, DateOfBirth, RegistrationStatus) VALUES (?, ?, ?, ?)';
    db.query(sql, [Name, Email, DateOfBirth, RegistrationStatus], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).json({ id: result.insertId, Name, Email, DateOfBirth, RegistrationStatus });
    });
});

// Read
app.get('/api/registrations', (req, res) => {
    const sql = 'SELECT * FROM Registration';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Update
app.put('/api/registrations/:id', (req, res) => {
    const { id } = req.params;
    const { Name, Email, DateOfBirth, RegistrationStatus } = req.body;
    const sql = 'UPDATE Registration SET Name = ?, Email = ?, DateOfBirth = ?, RegistrationStatus = ? WHERE ID = ?';
    db.query(sql, [Name, Email, DateOfBirth, RegistrationStatus, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ id, Name, Email, DateOfBirth, RegistrationStatus });
    });
});

// Delete
app.delete('/api/registrations/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Registration WHERE ID = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(204).send();
    });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Registration API');
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
