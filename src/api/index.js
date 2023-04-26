import { Router } from "express";
import userRouter from "./routes/user.js";
import shelfRouter from "./routes/shelf.js";

const router = Router();

router.use('/user', userRouter);
router.use('/shelf', shelfRouter);

export default router;
