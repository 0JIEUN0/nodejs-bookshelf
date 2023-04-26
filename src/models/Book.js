import mongoose from 'mongoose';

const bookSchema = mongoose.Schema({
    shelfId: { // TODO id of shelf
        type: String,
        // required: true,
    },
    title: { // title of book
        type: String,
        trim: true,
        maxlength: 100,
    },
    content: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
    }
})

const Book = mongoose.model('Book', bookSchema)

export { Book };
