require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL  // ← Add this line!
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes...
app.get('/api/persons', async (req, res) => {
    try {
        const persons = await prisma.person.findMany();
        res.json(persons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/persons', async (req, res) => {
    try {
        const { fullName, age } = req.body;
        const newPerson = await prisma.person.create({
            data: { fullName, age: age || null }
        });
        res.status(201).json(newPerson);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/persons/:id', async (req, res) => {
    try {
        const { fullName, age } = req.body;
        const updatedPerson = await prisma.person.update({
            where: { id: parseInt(req.params.id) },
            data: { fullName, age: age || null }
        });
        res.json(updatedPerson);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/persons/:id', async (req, res) => {
    try {
        await prisma.person.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Person deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
});