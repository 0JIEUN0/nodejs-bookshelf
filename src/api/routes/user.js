import { Router } from "express";
import middlewares from '../middleware/index.js';
import UserService from "../../services/user.js";
const router = Router();

router.post('/register', async (req, res) => {
    try {
        const registerDto = req.body;
        return await UserService.registerUser(res, registerDto);
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
})

router.post('/login', async (req, res) => {
    try {
        const userEmail = req.body.email;
        const userPassword = req.body.password;
        return await UserService.loginUser(res, userEmail, userPassword);
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
})

router.get('/auth', middlewares.auth, (req, res) => {
    // Authentication is True
    res.status(200).json({
        isAuth: true,
        id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        email: req.user.email,
    })
})

router.get('/logout', middlewares.auth, async (req, res) => {
    try {
        const userId = req.user._id;
        return await UserService.logoutUser(res, userId);
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
})

export default router;
