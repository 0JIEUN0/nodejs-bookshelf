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
  res.send('hello world!');
});

app.post('/register', async (req, res) => {
  // get information from client
  const user = new User(req.body) // using body-parser

  try {
    // check duplication by email
    const userInfo = await User.findOne({ email: req.body.email })
    if (userInfo) { // already registerd
      return res.status(409).json({ // conflict
        loginSuccess: false,
        message: `User email [${req.body.email}] is already registered.`
      })
    }

    const result = await user.save() // mongoDB function
    return res.status(200).json({
      success: true
    })
  } catch (err) {
    return res.status(400).json({ success: false, err })
  }
})

app.post('/login', async (req, res) => {
  try {
  // find user by email
  const userInfo = await User.findOne({ email: req.body.email })
  if (!userInfo) { // already registerd
    return res.status(409).json({ // conflict
      loginSuccess: false,
      message: `User [${req.body.email}] was not registered.`
    })
  }

  // check password
  const isMatch = await userInfo.comparePassword(req.body.password)
  if(!isMatch)
    return res.status(404).json({
      loginSuccess: false,
      message: `User email or password was wrong.`
    })
  
  // generate token
  const token = await userInfo.generateToken();
  res.status(200).json({
    loginSuccess: true,
    token: token
  })

  } catch (err) {
    return res.status(400).json({ success: false, err })
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}`))
