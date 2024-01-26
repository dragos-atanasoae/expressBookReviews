const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooksByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve({
        book
      });
    } else {
      reject({
        msg: `Book with ISBN ${isbn} not found`
      });
    }
  });
};

const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    const filtered_books = Object.values(books).filter(
      (book) => book.title == title
    );
    if (filtered_books.length > 0) {
      resolve({
        books: filteredBooks
      });
    } else {
      reject({
        msg: `Unable to find books for title: ${title}`
      });
    }
  });
};

const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    const filtered_books = Object.values(books).filter(
      (book) => book.author == author
    );
    if (filtered_books.length > 0) {
      resolve({
        books: filtered_books
      });
    } else {
      reject({
        msg: `Unable to find books for author: ${author}`
      });
    }
  });
};


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({
        "username": username,
        "password": password
      });
      return res.status(200).json({
        message: "User successfully registred. Now you can login"
      });
    } else {
      return res.status(404).json({
        message: "User already exists!"
      });
    }
  }
  return res.status(400).json({
    message: "Unable to register user."
  });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    return res.send(JSON.stringify(books));
  } catch (error) {
    return res.status(501).send({
      error
    });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await getBooksByISBN(isbn);
    res.send(book);
  } catch (error) {
    res.status(404).json(error);
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const book = await getBooksByAuthor(author);
    res.send(book);
  } catch (error) {
    res.status(404).send({
      error
    });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const book = await getBooksByTitle(title);
    res.send(book);
  } catch (error) {
    res.status(404).send({
      error
    });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  }
  res.status(404).send({
    error: 'Book not found'
  });
});

module.exports.general = public_users;