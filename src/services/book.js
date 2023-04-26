import { Book } from "../models/Book.js";
import { Shelf } from "../models/Shelf.js";

const findShelf = async (userId, shelfId) => {
    if (shelfId == undefined) throw {status: 400, message: "ShelfID must be provided."}
    
    const shelf = await Shelf.findById(shelfId);
    if (shelf.userId.toString() != userId) throw {status: 403, message: `This shelf ${shelfId} does not belong to user ${userId}`};

    return shelf;
}

export default {
    addNewBook: async (userId, shelfId, bookDto) => {
        const shelf = await findShelf(userId, shelfId);
        if (bookDto.title == undefined) throw { status: 400, message: "Title must be provided." }
        if (shelf.books.length >= 5) throw {status: 400, message: 'Shelf can only have five books.'};

        const book = new Book(bookDto);
        shelf.books.push(book);
        shelf.save();

        return {bookId: book._id};
    },
    updateBook: async (userId, shelfId, bookId, content) => {
        const shelf = await findShelf(userId, shelfId);
        const book = shelf.books.find((book) => book._id.toString() == bookId);
        if (!book) throw {status: 404, message: `There is no book ${bookId} in ${shelfId}`};
        book.content = content;

        await shelf.save();
        return {};
    },
    deleteBook: async (userId, shelfId, bookId) => {
        const shelf = await findShelf(userId, shelfId);
        const bookIdx = shelf.books.findIndex((book) => book._id.toString() == bookId);
        if (bookIdx < 0) throw {status: 404, message: `There is no book ${bookId} in ${shelfId}`};
        shelf.books.splice(bookIdx, 1);
        
        await shelf.save();
        return {};
    }
}
