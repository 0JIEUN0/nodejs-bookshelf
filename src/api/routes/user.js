import { Router } from "express";
import middlewares from '../middleware/index.js';
import { User } from "../../models/User.js";

const router = Router();

router.post('/register', async (req, res) => {
    // get information from client
    const user = new User(req.body) // using body-parser

    try {
        // check duplication by email
        const userInfo = await User.findOne({ email: req.body.email })
        if (userInfo) { // already registerd
            return res.status(409).json({ // conflict
                success: false,
                message: `User email [${req.body.email}] is already registered.`
            })
        }

        const result = await user.save() // mongoDB function
        return res.status(200).json({
            success: true
        })
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
})

router.post('/login', async (req, res) => {
    try {
        // find user by email
        const userInfo = await User.findOne({ email: req.body.email })
        if (!userInfo) { // already registerd
            return res.status(409).json({ // conflict
                loginSuccess: false,
                message: `User [${req.body.email}] was not registered.`
            })
        }

        // check password
        const isMatch = await userInfo.comparePassword(req.body.password)
        if (!isMatch)
            return res.status(404).json({
                loginSuccess: false,
                message: `User email or password was wrong.`
            })

        // generate token
        const token = await userInfo.generateToken();
        res.cookie('x_access_token', token, { httpOnly: true })
            .status(200).json({
                loginSuccess: true,
                token: token
            })

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
        await User.findOneAndUpdate({ _id: req.user._id }, { token: "" }); // delete token
        return res.status(200).json({ success: true })
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
})

export default router;
