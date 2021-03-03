const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const { nanoid } = require('nanoid');

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

// GET "*" returns index.html.
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
            if (err) {
                console.log(err)
            }
        });
    });
    res.sendFile(path.join(__dirname, './db/db.json'));    
});


app.listen(PORT, () => console.log(`Server started on ${PORT}`));



// const html = fs.readFileSync( __dirname + '/main.html' );
// res.json({html: html.toString(), data: obj});