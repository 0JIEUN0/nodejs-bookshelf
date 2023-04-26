import mongoose from 'mongoose';
import { Book } from './Book.js';

const shelfSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 20,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    books: [Book.schema],
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
    }
})

const Shelf = mongoose.model('Shelf', shelfSchema)

export { Shelf };
