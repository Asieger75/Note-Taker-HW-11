const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const fs = require('fs');
const uuid = require('uuid');
let Notes = require('./db/db.json');
const path = require('path');

// blooming-harbor-22256 is the heroku name

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

  app.get('/notes', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/notes.html'));
  });
  


app.get('/api/notes', function (req, res) {
  res.json(Notes);
  //returns all notes
});

app.post('/api/notes', function (req, res) {
  let newNote = req.body;
  newNote.id = uuid();
  Notes.push(newNote);
  res.json(newNote);
  fs.writeFile('db/db.json', JSON.stringify(Notes), err => { if (err){ throw err;} return true; });
  //saves a note
})

app.delete("/api/notes/:id", function (req, res) {
  let id = req.perams.id;
  for (var i = 0; i < Notes.length; i++) {
    if (id === Notes[i].id) {
      Notes.splice(i, 1);
      fs.writeFile('db/db.json', JSON.stringify(Notes), err => { if (err){ throw err;} return true; });
    }
  };
  res.json(Notes);
  //nukes a note
})

app.get('*', function(req,res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
})

app.listen(PORT, function() {console.log("listening on port:" + PORT);});