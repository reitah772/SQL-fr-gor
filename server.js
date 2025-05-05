const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();  // Om du använder SQLite

const app = express();
const port = 3000;

// Middleware för att kunna ta emot formulärdata (POST)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sätt EJS som vy-motor
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Starta SQLite-databas
const db = new sqlite3.Database('./db/database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Database connected');
  }
});

// Huvudsida
app.get('/', (req, res) => {
  res.render('index');  // Renderar index.ejs
});

// Hantera POST-förfrågningar till /submit
app.post('/submit', (req, res) => {
  const { name, age } = req.body;

  // Lägg till data i databasen (förutsatt att det finns en tabell 'students')
  db.run('INSERT INTO students (name, age) VALUES (?, ?)', [name, age], function(err) {
    if (err) {
      console.error('Error inserting data:', err.message);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/');
    }
  });
});

// Starta servern
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
