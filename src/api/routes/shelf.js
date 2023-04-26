import { Router } from "express";
import middlewares from '../middleware/index.js';
import ShelfService from "../../services/shelf.js";

const router = Router();

router.post('/', middlewares.auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const newShelfDto = req.body;
        const result = await ShelfService.addNewShelf(userId, newShelfDto);
        return res.status(200).json({ success: true, ...result})
    } catch (err) {
        if (err.status == undefined) err.status = 500;
        return res.status(err.status).json({ success: false, message: err.message })
    }
})

export default router;
