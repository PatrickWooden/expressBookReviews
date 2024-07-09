const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    
    res.send(JSON.stringify(books,null,4));
    console.log("Get all called");
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn",function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  res.send(books[isbn]);
});

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
     let authorBooks = [];
     let author = req.params.author;
    // Loop through books to find any written by the author
    Object.keys(books).forEach(isbn => {
        if (books[isbn].author === author) {
            authorBooks.push(books[isbn]);
        }
    });

    //send response
    if (authorBooks.length > 0) {
        return res.status(200).json(authorBooks);
    } else {
        return res.status(404).json({ message: "No books found for the author!" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let foundBooks = [];
    let title = req.params.title;
   // Loop through books to find any written by the author
   Object.keys(books).forEach(isbn => {
       if (books[isbn].title === title) {
           foundBooks.push(books[isbn]);
       }
   });

   //send response
   if (foundBooks.length > 0) {
       return res.status(200).json(foundBooks);
   } else {
       return res.status(404).json({ message: "No books found with this title!" });
   }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews) {
    const reviews = books[isbn].reviews;
    return res.status(200).json({ reviews });
   } else {
    return res.status(404).json({ message: "Reviews not found for the book" });
}
});

module.exports.general = public_users;
