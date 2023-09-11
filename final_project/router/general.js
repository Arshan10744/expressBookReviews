const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios')

public_users.post("/register", (req,res) => {
  const { username, password } = req.body; 
  
  if (username && password) {
    if (!isValid(username)) {
      // Check if the username is not already in use
      users.push({ username, password }); // Push the new user to the users array
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(400).json({ message: "User already exists!" }); // Use 400 status code for user already exists
    }
  }

  return res.status(400).json({ message: "Unable to register user." }); // Use 400 status code for bad request
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const bookList = Object.values(books);

    // Check if there are books available
    if (bookList.length === 0) {
      return res.status(404).json({ message: 'No books available in the shop' });
    }

    // Stringify the JSON response
    const jsonString = JSON.stringify({ books: bookList });

    // Set the response content type to JSON
    res.setHeader('Content-Type', 'application/json');

    // Send the stringified JSON response
    return res.status(200).send(jsonString);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;

    // Look up the book in the `books` object based on the ISBN
    const book = Object.values(books).find(book => book.isbn === isbn);

    // Check if the book was found
    if (book) {
      return res.status(200).json({ book });
    } else {
      return res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;

    // Look up the book in the `books` object based on the author
    const book = Object.values(books).find(book => book.author === author);

    // Check if the book was found
    if (book) {
      return res.status(200).json({ book });
    } else {
      return res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;

    // Look up the book in the `books` object based on the title
    const book = Object.values(books).find(book => book.title === title);

    // Check if the book was found
    if (book) {
      return res.status(200).json({ book });
    } else {
      return res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  // Look up the book in the `books` object based on the ISBN
  const book = Object.values(books).find(book => book.isbn === isbn);
  const reviews  = book.reviews;
  // Check if the book was found
  if (book) {
    return res.status(200).json({ reviews });
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

module.exports.general = public_users;
