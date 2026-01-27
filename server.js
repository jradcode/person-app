require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const prisma = require('./db'); // Ensure this file correctly exports your Prisma client

const app = express();
// Render sets process.env.PORT automatically, default is usually 10000
const PORT = process.env.PORT || 10000; 

const allowedOrigins = [
  'http://localhost:4200', // For local development
  'https://jradcode.github.io' // Your actual GitHub Pages URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy: This origin is not allowed'), false);
    }
    return callback(null, true);
  }
}));

// ng build --base-href /person-app/         command to build

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json({ limit: '10kb' })); // Limits total request size

// Routes

// Get all persons or nametags and display error if failure
app.get('/api/persons', async (req, res) => {
    try {
        const persons = await prisma.person.findMany({
            orderBy: { id: 'asc' } 
        });
        res.json(persons); 
    } catch (err) {
        // Log the actual error to your terminal so you can see what went wrong
        console.error("GET /api/persons error:", err);
        res.status(500).json({ error: "Internal Server Error." });
    }
});

// Get one person by ID
app.get('/api/persons/:id', async (req, res) => {
    const { id } = req.params;
    const personId = parseInt(id);

    if (isNaN(personId)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const person = await prisma.person.findUnique({
            where: { id: personId }
        });

        if (!person) {
            return res.status(404).json({ error: "Nametag not found." });
        }

        res.json(person);
    } catch (err) {
        console.error("Database Error:", err); 
        res.status(500).json({ error: "Internal Server Error." });
    }
});

// Create a new person (The "Add" functionality)
app.post('/api/persons', async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const newPerson = await prisma.person.create({
            data: { firstName, lastName, email }
        });

        res.status(201).json(newPerson);
    } catch (err) {
        console.error("POST /api/persons error:", err);
        res.status(500).json({ error: "Internal Server Error." });
    }
});

// Edit a person (The "Update" functionality)
app.put('/api/persons/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { firstName, lastName, email } = req.body;
        const updated = await prisma.person.update({
            where: { id: parseInt(id) },
            data: { firstName, lastName, email }
        });
        res.json(updated);
    } catch (err) {
        console.error("PUT error:", err);
        res.status(500).json({ error: "Internal Server Error." });
    }
});

// Delete a person
app.delete('/api/persons/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.person.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    } catch (err) {
        console.error("DELETE error:", err);
        res.status(500).json({ error: "Internal Server Error." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});