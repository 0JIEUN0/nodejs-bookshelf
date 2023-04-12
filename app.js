import env from './config/index.js';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import apiRoute from './api/index.js';

function startServer() {
    const app = express();
    const port = 5000

    app.use(bodyParser.urlencoded({ extended: true })); // application/x-www-form-urlencoded
    app.use(bodyParser.json()); // application/json
    app.use(cookieParser());
    app.use('/api', apiRoute);

    // respond with "hello world" when a GET request is made to the homepage
    app.get('/', function (req, res) {
        res.send('hello world!');
    });

    mongoose.connect(env.databaseURL, {})
        .then(() => console.log('MongoDB Connected...'))
        .catch(err => console.log(err))

    app.listen(port, () => console.log(`Example app listening on port ${port}`))
}

startServer();
