const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({
      message: "Error logging in"
    });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: username
    }, 'access', {
      expiresIn: 60 * 60
    });

    req.session.authorization = {
      accessToken,
      username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({
      message: "Invalid Login. Check username and password"
    });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.data;
  const review = req.query.review;

  if (books[isbn] && username) {
    if (review) {
      books[isbn].reviews[username] = review;
      res.send('Review saved');
    }
    res.status(400).send({
      error: 'Empty message cannot be saved'
    });
  }
  res.status(400).send({
    error: 'Something went wrong. Check data and try again'
  });
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.data;
  if (books[isbn] && username) {
    delete books[isbn].reviews[username];
    res.send('Review deleted');
  }
  res.status(400).send({
    error: 'Something went wrong. Check inserted data and tray again'
  });
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;