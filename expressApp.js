import express from 'express';

const app = express();

// Middleware to read JSON data
app.use(express.json());

// B1: Sample book records
let books = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 350,
        category: "Fiction"
    },
    {
        id: 2,
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        price: 400,
        category: "Finance"
    },
    {
        id: 3,
        title: "Clean Code",
        author: "Robert C. Martin",
        price: 550,
        category: "Programming"
    }
];

// B2: GET all books
app.get('/books', (req, res) => {

    res.status(200).json(books);

});

// GET book by ID
app.get('/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    res.status(200).json(book);

});

// POST: Add a new book
app.post('/books', (req, res) => {

    const { id, title, author, price, category } = req.body;

    if (
        id == null ||
        !title ||
        !author ||
        price == null
    ) {
        return res.status(400).json({
            message: 'All required book details must be provided'
        });
    }

    if (books.some(b => b.id === Number(id))) {
        return res.status(400).json({
            message: 'Book ID already exists'
        });
    }

    const newBook = {
        id: Number(id),
        title,
        author,
        price: Number(price),
        category: category || 'General'
    };

    books.push(newBook);

    res.status(201).json({
        message: 'Book added successfully',
        book: newBook
    });

});

// PUT: Update existing book
app.put('/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    books[index] = {
        ...books[index],
        ...req.body,
        id: id
    };

    res.status(200).json({
        message: 'Book updated successfully',
        book: books[index]
    });

});

// DELETE: Remove book
app.delete('/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    const deletedBook = books.splice(index, 1);

    res.status(200).json({
        message: 'Book deleted successfully',
        book: deletedBook[0]
    });

});

// Invalid routes
app.use((req, res) => {

    res.status(404).json({
        message: 'Route not found'
    });

});

// Start Express server
app.listen(4000, () => {

    console.log('Express Server running at http://localhost:4000');

});