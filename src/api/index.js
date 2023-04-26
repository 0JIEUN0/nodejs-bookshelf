import { Router } from "express";
import userRouter from "./routes/user.js";
import shelfRouter from "./routes/shelf.js";
import bookRouter from "./routes/book.js";

const router = Router();

router.use('/user', userRouter);
router.use('/shelf', shelfRouter);
router.use('/book', bookRouter);

export default router;
