const express = require('express');
const authRouter = require('./auth');
const { verifyToken } = authRouter;
const router = express.Router();

// In-memory storage for books
let books = [
  {
    _id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0-7432-7356-5',
    available: true,
    createdAt: new Date()
  },
  {
    _id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0-06-112008-4',
    available: true,
    createdAt: new Date()
  }
];

// Get all books
router.get('/', verifyToken, async (req, res) => {
  try {
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create book
router.post('/', verifyToken, async (req, res) => {
  try {
    const newBook = {
      _id: Date.now().toString(),
      ...req.body,
      createdAt: new Date()
    };
    books.push(newBook);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get book by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const book = books.find(b => b._id === req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;