const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({message: "Missing fields"});
  if (users[username]) return res.status(409).json({message: "User already exists"});
  users[username] = { password };
  res.json({ message: "User registered successfully" });
});


// Get the book list available in the shop
const axios = require('axios');

public_users.get('/async/books', async (req, res) => {
  try {
    const data = await new Promise((resolve) => resolve(books));
    res.send(JSON.stringify(data, null, 4));
  } catch (e) {
    res.status(500).send("Error");
  }
});

// Get book details based on ISBN
public_users.get('/async/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) resolve(books[isbn]);
    else reject("Book not found");
  })
    .then(data => res.send(data))
    .catch(err => res.status(404).send(err));
});


// Get book details based on author
public_users.get('/async/author/:author', async (req, res) => {
  const author = req.params.author;
  const result = Object.values(books).filter(book => book.author === author);
  res.send(result);
});


// Get all books based on title
public_users.get('/async/title/:title', (req, res) => {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const result = Object.values(books).filter(book => book.title === title);
    result.length ? resolve(result) : reject("Not found");
  })
  .then(data => res.send(data))
  .catch(err => res.status(404).send(err));
});


//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});


module.exports.general = public_users;
