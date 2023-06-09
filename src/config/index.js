import dotenv from 'dotenv';
// config() will read your .env file, parse the contents, assign it to process.env.
dotenv.config();

export default {
    databaseURL: process.env.MONGODB_CONNECT,
}
