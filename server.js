const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db'); 

const app = express();

// Angular 19 often runs on port 4200, so we allow that origin
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// GET all persons
app.get('/api/persons', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM persons ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new person
app.post('/api/persons', async (req, res) => {
    const { name, email } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO persons (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));