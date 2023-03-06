require("dotenv").config();

const express = require('express');
const app = express();
const port = 5000

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_CONNECT, {
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('hello world');
});

app.listen(port, () => console.log(`Example app listening on port ${port}`))
