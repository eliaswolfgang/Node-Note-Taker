const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const { nanoid } = require('nanoid'); // For random ID generation upon save

const PORT = process.env.PORT || 5000;
// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

// GET "/" returns index.html.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

// GET /notes returns the notes.html file.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// API request to retrieve JSON data
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/db/db.json'))
});

// Save a new note 
app.post('/api/notes', (req, res) => {
    const newNote = {
        id: nanoid(5),
        title: req.body.title,
        text: req.body.text,
    };
    fs.readFile('./db/db.json', (err, data) => {
        let notesObj;
        const notesArr = JSON.parse(data);
        if (err) { console.log(err) }
        notesArr.push(newNote);
        notesObj = JSON.stringify(notesArr, null, 2);
        fs.writeFile('./db/db.json', notesObj, (err) => {
            if (err) { console.log(err) }
        });
    });
    res.sendFile(path.join(__dirname, './db/db.json'));
});
// Delete a note
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        const noteID = req.params.id;
        let notesObj;
        let notesArr = JSON.parse(data);
        const note = notesArr.find( ({ id }) => id == noteID);
        if (!note) { res.status(400).send(`The note with the ID of ${id} does not exist`) }
        const index = notesArr.indexOf(note);
        notesArr.splice(index, 1);
        notesObj = JSON.stringify(notesArr, null, 2);
        fs.writeFile('./db/db.json', notesObj, (err) => {
            if (err) { console.log(err) }
        });
    });
    res.sendFile(path.join(__dirname, './db/db.json'));
});

app.listen(PORT, () => console.log(`Server started on ${PORT}`));