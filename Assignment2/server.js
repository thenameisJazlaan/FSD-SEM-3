const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


let books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' }
];

app.get('/api/books', (req, res) => {
  res.json(books);
});


app.post('/api/books', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: 'Title aur Author dono zaroori hain.' });
  }
  const newBook = { id: Date.now(), title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});


app.put('/api/books/:id', (req, res) => {
  const bookId = Number(req.params.id);
  const { title, author } = req.body;
  const bookIndex = books.findIndex(b => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book nahi mili.' });
  }

  books[bookIndex] = { ...books[bookIndex], title, author };
  res.json(books[bookIndex]);
});


app.delete('/api/books/:id', (req, res) => {
  const bookId = Number(req.params.id);
  books = books.filter(b => b.id !== bookId);
  res.json({ message: 'Book successfully delete ho gayi.' });
});


app.listen(PORT, () => {
  console.log(`Server chalu ho gaya hai: http://localhost:${PORT}`);
});