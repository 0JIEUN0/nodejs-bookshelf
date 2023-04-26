import { Router } from "express";
import middlewares from '../middleware/index.js';
import BookService from "../../services/book.js";

const router = Router();

router.post('/', middlewares.auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const shelfId = req.body.shelfId;
        const newBookDto = req.body.bookInfo;
        const result = await BookService.addNewBook(userId, shelfId, newBookDto);
        return res.status(200).json({ success: true, ...result})
    } catch (err) {
        if (err.status == undefined) err.status = 500;
        return res.status(err.status).json({ success: false, message: err.message })
    }
})

router.put('/', middlewares.auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const shelfId = req.body.shelfId;
        const bookID = req.body.bookId;
        const content = req.body.content;
        const result = await BookService.updateBook(userId, shelfId, bookID, content);
        return res.status(200).json({ success: true, ...result})
    } catch (err) {
        if (err.status == undefined) err.status = 500;
        return res.status(err.status).json({ success: false, message: err.message })
    }
})

router.delete('/', middlewares.auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const shelfId = req.body.shelfId;
        const bookID = req.body.bookId;
        const result = await BookService.deleteBook(userId, shelfId, bookID);
        return res.status(200).json({ success: true, ...result})
    } catch (err) {
        if (err.status == undefined) err.status = 500;
        return res.status(err.status).json({ success: false, message: err.message })
    }
})

export default router;
