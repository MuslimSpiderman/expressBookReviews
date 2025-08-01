const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!users[username] || users[username].password !== password)
    return res.status(401).json({message: "Invalid credentials"});

  let accessToken = jwt.sign({ username }, "access", { expiresIn: 3600 });
  req.session.authorization = { accessToken, username };
  res.json({ message: "Login successful" });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
  books[isbn].reviews[username] = review;
  res.json({ message: "Review added/updated" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.authorization.username;

  if (books[isbn]?.reviews[username]) {
    delete books[isbn].reviews[username];
    res.json({ message: "Review deleted" });
  } else {
    res.status(404).json({ message: "Review not found" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
