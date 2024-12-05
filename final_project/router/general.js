const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password} = req.body;

  if (!username || !password){
    return res.status(400).json({message: "Missing username or password"});
  }
  const userExists = users.some((user) => user.username === username);

  if (userExists){
    return res.status(404).json({message: "User already exists!"});
  }
  users.push({username, password});

  return res.status(200).json({message: "Succesfully registered. You are now able to login!"});
  
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify({books}, null , 4)));
  });
  get_books.then(() => console.log("Promise for Task 10 completed"));
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getbook = new Promise((resolve, reject) => {
    resolve(res.send(books[isbn]));
  })

  getbook.then(() => console.log("Promise for Task 11 done"));

 });
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
  const author = req.params.author;

  const getBooksByAuthor = new Promise((resolve, reject) => {
    const bookList = Object.values(books);
    const filteredBooks = bookList.filter(
      (book) => book.author && book.author.toLowerCase() === author.toLowerCase()
    );
  
    if(filteredBooks.length > 0){
     resolve(filteredBooks);
    }
    else{
      reject({message: "No books found under that name!"});
    }
  });
 
   getBooksByAuthor.then((filteredBooks) => {
    return res.status(200).json(filteredBooks);
   })
   .catch ((error) => {
    return res.status(404).json(error);
   })

});

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
    const title = req.params.title;

    const getBooksByTitle = new Promise((resolve, reject) => {
        const bookList = Object.values(books);
        const filteredBooks = bookList.filter(
          (book) => book.title && book.title.toLowerCase() === title.toLowerCase()
        );
      
        if(filteredBooks.length > 0){
          resolve(filteredBooks);
        }
        else{
         reject({message: "No books found under that name!"});
        }
    });

    getBooksByTitle.then((filteredBooks) => {
        return res.status(200).json(filteredBooks);
    })
    .catch((error) => {
        return res.status(404).json(error);
    })
   
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if(book.review){
      return res.status(200).json(book.review);
    }
    else{
      return res.status(404).json({message: "No reviews for this book!"});
    }
  
});

module.exports.general = public_users;
