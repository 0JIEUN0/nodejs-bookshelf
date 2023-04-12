import { Router } from "express";
import middlewares from '../middleware/index.js';
import UserService from "../../services/user.js";
const router = Router();

router.post('/register', async (req, res) => {
    try {
        const registerDto = req.body;
        const result = await UserService.registerUser(registerDto);
        return res.status(200).json({ success: true, ...result})
    } catch (err) {
        if (err.status == undefined) err.status = 500;
        return res.status(err.status).json({ success: false, message: err.message })
    }
})

router.post('/login', async (req, res) => {
    try {
        const userEmail = req.body.email;
        const userPassword = req.body.password;
        const token = await UserService.loginUser(userEmail, userPassword);
        res.cookie('x_access_token', token, { httpOnly: true })
            .status(200).json({
                success: true,
                token: token
            })
    } catch (err) {
        if (err.status == undefined) err.status = 500;
        return res.status(err.status).json({ success: false, message: err.message })
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
        const result = await UserService.logoutUser(userId);
        return res.status(200).json({ success: true, ...result})
    } catch (err) {
        if (err.status == undefined) err.status = 500;
        return res.status(err.status).json({ success: false, message: err.message })
    }
})

export default router;
