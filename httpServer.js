import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample books
let books = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 350
    },
    {
        id: 2,
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        price: 400
    },
    {
        id: 3,
        title: "Clean Code",
        author: "Robert C. Martin",
        price: 550
    }
];

// Create HTTP server
const server = http.createServer((req, res) => {

    const url = new URL(req.url, `http://${req.headers.host}`);
    const route = url.pathname;

    // A2: Home route
    if (req.method === 'GET' && route === '/') {

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end('<h1>Welcome to Library Management System</h1>');
    }

    // A2 and A3: GET all books
    else if (req.method === 'GET' && route === '/books') {

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify(books));
    }

    // A2: About route
    else if (req.method === 'GET' && route === '/about') {

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end('<h1>About Library</h1><p>Library Book Management Application</p>');
    }

    // A4: Serve HTML using FS module
    else if (req.method === 'GET' && route === '/home') {

        const filePath = path.join(__dirname, 'public', 'index.html');

        fs.readFile(filePath, 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.end('Error reading HTML file');
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.end(data);
        });
    }

    // A3: POST new book
    else if (req.method === 'POST' && route === '/add-book') {

        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {

            try {
                const book = JSON.parse(body);

                if (
                    book.id == null ||
                    !book.title ||
                    !book.author ||
                    book.price == null
                ) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json'
                    });

                    res.end(JSON.stringify({
                        message: 'All book details are required'
                    }));

                    return;
                }

                if (books.some(b => b.id === book.id)) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json'
                    });

                    res.end(JSON.stringify({
                        message: 'Book ID already exists'
                    }));

                    return;
                }

                books.push(book);

                res.writeHead(201, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    message: 'Book added successfully',
                    book: book
                }));

            } catch (error) {

                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    message: 'Invalid JSON data'
                }));
            }
        });
    }

    // A5: Invalid route
    else {

        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });

        res.end('404 - Page Not Found');
    }

});

// Start server
server.listen(3000, () => {

    console.log('HTTP Server running at http://localhost:3000');

});