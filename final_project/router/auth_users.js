const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Missing username or password" });
    }
  
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,
        username
      };
  
      return res.status(200).json({ message: "User successfully logged in" });
    } else {
      return res.status(401).json({ message: "Invalid login credentials" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Get the ISBN from the route parameters
  const isbn = req.params.isbn;
  
  // Get the review from the query parameters
  const review = req.query.review;

  // Get the username from the session (assuming it's already stored)
  const username = req.session.authorization ? req.session.authorization.username : null;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  // Check if a review by the same user already exists for the same ISBN
  if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
    // Update the existing review
    books[isbn].reviews[username] = review;
  } else {
    // Create a new review entry for the user
    if (!books[isbn]) {
      books[isbn] = { reviews: {} };
    }
    books[isbn].reviews[username] = review;
  }

  return res.status(200).json({ message: "Review submitted successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Get the ISBN from the route parameters
  const isbn = req.params.isbn;

  // Get the username from the session (assuming it's already stored)
  const username = req.session.authorization ? req.session.authorization.username : null;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if there is a review by the same user for the given ISBN
  if (books[isbn].reviews && books[isbn].reviews[username]) {
    // Delete the user's review
    delete books[isbn].reviews[username];
    
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found" });
  }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
