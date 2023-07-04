const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.port || 3001;
const app = express()

// parsing Json and urlencoded for data
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static('public'));

// HTML ROUTE
app.get('/note', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// wildcard
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
    const notes = getNotes();
    res.json(notes);
});

// generates a unique ID 
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4(); 

    const notes = getNotes();
    notes.push(newNote);
    saveNotes(notes);

    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;

    let notes = getNotes();
    notes = notes.filter((note) => note.id !== id);
    saveNotes(notes);

    res.sendStatus(204);
});

const getNotes = () => {
    const data = fs.readFileSync(path.join(__dirname, 'db', 'db.json'));
    return JSON.parse(data);
};

const saveNotes = (notes) => {
    fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes));
};

// start server
app.listen(PORT, () => {
    console.log('App listening at http://localhost:${PORT} 🚀');
});

