require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const Book = require('./models/books')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: false}))

const secretKey = process.env.JWT_SECRET || 'defaultSecretKey'

const verifyToken = (req, res, next) => {
  const token = req.header('auth-token');
  if(!token) return res.status(401).send('Access Denied');

  try{
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send('Invalid Token')
  }
};

app.get('/', (req, res) => {
  res.send('Hello, MERN CRUD!');
});

app.get('/books',async(req,res) =>{
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

app.get('/books/:id', async(req,res) =>{
  try{
    const {id} = req.params;
    const book = await Book.findById(id);
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

app.use('/books', verifyToken);
app.use('/book/:id', verifyToken);

app.post('/books',async(req,res) =>{
  try{
    const book = await Book.create(req.body)
    res.status(200).json(book)
  } catch (error){
    console.log(error.message); 
    res.status(500).json({message: error.message})
  }
})

app.put('/books/:id', async(req,res) => {
  try{
    const {id} = req.params;
    const book = await Book.findByIdAndUpdate(id, req.body)
    if(!book){
      return res.status(404).json({message: 'cannot find this id'})
    }
    const updatedBook = await Book.findById(id);
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

app.delete('/books/:id', async(req, res) =>{
  try{
    const {id} = req.params;
    const book = await Book.findByIdAndDelete(id);
    if(!book){
      return res.status(404).json({message: 'cannot find book'})
    }
    res.status(200).json(book);
  } catch (error){
    res.status(500).json({message: error.message})
  }
})

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  console.log('connected to MongoDB')
}).catch((error) => {
  console.log(error)
})