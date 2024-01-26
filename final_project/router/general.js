const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


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
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const keys = Object.keys(books);
  const author = req.params.author;
  let book_details = null;
  console.log(keys);
  keys.forEach(e => {
    if (books[e].author === author) {
      book_details = books[e];
    }
  });

  if (book_details) {
    res.send(book_details);
  } else {
    res.status(404).send(`Unable to find author: ${author}`);
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let book_details = null;
  Object.keys(books).forEach(e => {
    if (books[e].title === title) {
      book_details = books[e];
    }
  });

  if (book_details) {
    res.send(book_details);
  }
  res.status(404).send(`Unable to find title: ${title}`);
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