require("dotenv").config();

const express = require('express');
const app = express();
const port = 5000
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true})); // application/x-www-form-urlencoded
app.use(bodyParser.json()); // application/json

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_CONNECT, {
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

const { User } = require('./models/User');

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('hello world');
});

app.post('/register', async (req, res) => {
    // get information from client
    const user = new User(req.body) // using body-parser
    try {
      // TODO check duplication/invalid value
      const result = await user.save() // mongoDB function
      return res.status(200).json({
        success: true
      })
    } catch (err) {
      return res.json({ success: false, err })
    }
})


app.listen(port, () => console.log(`Example app listening on port ${port}`))
