const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
return users.some((user) => user.username === username && user.password === password);


}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username,password} = req.body;
  if(!username || !password){
    return res.status(400).json({message: "Missing username or password!"});
  }
  if (authenticatedUser(username,password)){
    const payload = {
        username,
    };

    const accessToken = jwt.sign(payload, 'access', {expiresIn: 60 * 60});

    req.session.authorzation = {
        accessToken, username
    };

    return res.status(200).json({message: "User successfully logged in"});
  }

  return res.status(400).json({message: "User not registered"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.username;
    const isbn = req.params.isbn;
    const review = req.body.review;

    if(books[isbn]){
        books[isbn].reviews[username] = review;
        return res.status(200).json({message: "Review added!"});
    }
    else{
        return res.status(404).json({message: "Book not found"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
