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

// Get one person or nametag by it's id and if it failed there's an error
// Get one person by ID
app.get('/api/persons/:id', async (req, res) => {
    const { id } = req.params;
    const personId = parseInt(id);

    // Ensure ID is a number
    if (isNaN(personId)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const person = await prisma.person.findUnique({
            where: { id: personId }
        });

        // Not Found Handling
        if (!person) {
            return res.status(404).json({ error: "Nametag not found." });
        }

        res.json(person);
    } catch (err) {
        // Log error internally, send generic message to user for security reasons
        console.error("Database Error:", err); 
        res.status(500).json({ error: "Internal Server Error." });