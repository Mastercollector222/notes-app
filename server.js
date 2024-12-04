require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const Note = require('./models/Note');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'https://notes-app-xdxo.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// API Routes
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        console.log('Retrieved notes from database:', notes);
        res.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

app.post('/api/notes', async (req, res) => {
    try {
        console.log('Received POST request to /api/notes with body:', req.body);
        const { title, content } = req.body;
        
        if (!title || !content) {
            console.log('Missing title or content in request');
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const note = new Note({ title, content });
        await note.save();
        console.log('Successfully saved note:', note);
        res.status(201).json(note);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Failed to create note' });
    }
});

app.put('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        
        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        
        await note.save();
        console.log('Note updated in database:', note);
        res.json(note);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Failed to update note' });
    }
});

app.delete('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findByIdAndDelete(id);
        
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        console.log('Note deleted from database:', note);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
