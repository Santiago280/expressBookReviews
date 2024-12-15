const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Filter the users array to check if the username already exists
  let usersWithSameName = users.filter((user) => {
    return user.username === username;
  });

  // If the length of the filtered array is greater than 0, then the username already exists
  if(usersWithSameName.length > 0){
    return false;
  }
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Filter the users array to check if the username and password match
  let validUser = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  // If the length of the filtered array is greater than 0, then the user is authenticated
  if(validUser.length > 0){
    return true;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  console.log(req.body); // Log the request body
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if(!username || !password){
    return res.status(400).json({message: "Username and password are required"});
  }

  // Authenticate user
  if(authenticatedUser(username,password)){
    // Generate a JWT token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60*60 });

    // Store the token in session
    req.session.authorization = { 
      accessToken, username
    };
    return res.status(200).send({message: "User logged in successfully"});
  }
  else {
    return res.status(400).json({message: "Invalid login. Please check your username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization.username;

  if (!review) {
    return res.status(400).json({message: "Review is required"});
  }

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({message: "Review added/modified successfully"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({message: "Review not found"});
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({message: "Review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
