const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Get all books
let GetBooks = new Promise((resolve,reject) => {
  resolve(books);
});

public_users.get("/", (req,res) => {
  GetBooks.then((books) => {
    res.send(JSON.stringify(books,null,4));
  });
});

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if(username && password){
    // Check if username already exists
    if(isValid(username)){
      // Add user to users array
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User registered successfully"});
    }
    else {
      return res.status(400).json({message: "Username already exists"});
    }
  }
  return res.status(400).json({message: "Username and password are required"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  // Get book details based on ISBN
  let GetBookByISBN = new Promise((resolve,reject) => {
    let book = books[isbn];
    if(book)
    {
      resolve(book);
    } else {
      reject("Book not found for given ISBN");
    }
  });

  GetBookByISBN.then((book) => {
    res.send(JSON.stringify(book,null,4));
  }).catch((error) => {
    res.status(404).json({ message: error });
  });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;

  // Get book details based on author
  let GetBookByAuthor = new Promise((resolve,reject) => {
    let bookKeys = Object.keys(books); // Get all keys from books object

    let matchingBooks = bookKeys
      .map(key=>books[key])
      .filter(book => book.author.toLowerCase() === author.toLowerCase());
    
    if(matchingBooks.length>0)
    {
      resolve(matchingBooks);
    } else {
      reject("No books found for the given author");
    }
  });

  GetBookByAuthor.then((matchingBooks) => {
    res.send(JSON.stringify(matchingBooks,null,4));
  }).catch((error) => {
    res.status(404).json({ message: error });
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;

  // Get book details based on title
  let GetBookByTitle = new Promise((resolve,reject) => {
    let bookKeys = Object.keys(books); // Get all keys from books object

    let matchingBooks = bookKeys
      .map(key=>books[key])
      .filter(book => book.title.toLowerCase() === title.toLowerCase());
    
    if(matchingBooks.length>0)
    {
      resolve(matchingBooks);
    } else {
      reject("No books found for the given title");
    }
  });

  GetBookByTitle.then((matchingBooks) => {
    res.send(JSON.stringify(matchingBooks,null,4));
  }).catch((error) => {
    res.status(404).json({ message: error });
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn =  req.params.isbn;
  let book = books[isbn];
  if(book)
  {
    res.send(JSON.stringify(book.reviews,null,4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
