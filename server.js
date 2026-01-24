require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const prisma = require('./db')

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json({ limit: '10kb' }));

// Routes

//Get all persons or nametags and display error if failure
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

//Get one person or nametag by it's id and if it failed there's an error
// Get one person by ID
app.get('/api/persons/:id', async (req, res) => {
    const { id } = req.params;
    const personId = parseInt(id);

    //Ensure ID is a number
    if (isNaN(personId)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const person = await prisma.person.findUnique({
            where: { id: personId }
        });

        //Not Found Handling
        if (!person) {
            return res.status(404).json({ error: "Nametag not found." });
        }

        res.json(person);
    } catch (err) {
        //Log error internally, send generic message to user for security reasons
        console.error("Database Error:", err); 
        res.status(500).json({ error: "Internal Server Error." });
    }
});

// app.use(express.json({ limit: '10kb' })); // Limits total request size

app.post('/api/persons', async (req, res) => {
    try {
        const { fullName, age } = req.body;

        // Validation: Don't trust frontend!
        if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
            return res.status(400).json({ error: "A valid name is required." });
        }

        if (fullName.length > 50) {
            return res.status(400).json({ error: "Name is too long." });
        }

        //Data Cleaning
        const cleanName = fullName.trim();
        const cleanAge = age ? parseInt(age) : null;

        //Database Operation
        const newPerson = await prisma.person.create({
            data: { 
                fullName: cleanName, 
                age: cleanAge 
            }
        });

        res.status(201).json(newPerson);

    } catch (err) {
        console.error("POST /api/persons error:", err);
        
        res.status(500).json({ error: "Failed to create nametag!" });
    }
});

//this edits or updates the current nametag or person 
app.put('/api/persons/:id', async (req, res) => {
    const { id } = req.params;
    const personId = parseInt(id);

    //Validate ID
    if (isNaN(personId)) {
        return res.status(400).json({ error: "Invalid ID format." });
    }

    try {
        const { fullName, age } = req.body;

        //Validate Body Data
        if (!fullName || fullName.trim().length === 0) {
            return res.status(400).json({ error: "Name cannot be empty." });
        }

        //Update the record
        const updatedPerson = await prisma.person.update({
            where: { id: personId },
            data: { 
                fullName: fullName.trim(), 
                age: age ? parseInt(age) : null 
            }
        });

        res.json(updatedPerson);

    } catch (err) {
        // Handle specific Prisma error.
        // Prisma error code P2025 is "An operation failed because it depends on one or more nametags that were required but not found."
        if (err.code === 'P2025') {
            return res.status(404).json({ error: "Nametag not found." });
        }

        console.error("Update error:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});

//this deletes nametag from database
app.delete('/api/persons/:id', async (req, res) => {
    const { id } = req.params;
    const personId = parseInt(id);

    //Basic Validation
    if (isNaN(personId)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        await prisma.person.delete({
            where: { id: personId }
        });

        //Success - 204 No Content is standard for successful deletes
        res.status(204).json({ message: "Nametag deleted successfully!" });

    } catch (err) {
        // Handle "Person not found" specifically
        if (err.code === 'P2025') {
            return res.status(404).json({ error: "Nametag not found." });
        }

        // Log actual error for debugging, send generic one to user
        console.error("Delete error:", err);
        res.status(500).json({ error: "Failed to delete nametag." });
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'Production'}`);
});

//gracefully shuts down cloud database neon
// Handles both Ctrl+C and Cloud Provider shutdown signals and prevents "ghost connections"
['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, async () => {
    await prisma.$disconnect();
    console.log(`Received ${signal}. Prisma disconnected. Server closing.`);
    process.exit(0);
  });
});