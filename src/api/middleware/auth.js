import { User } from '../../models/User.js';

let auth = async (req, res, next) => {
    try {
        const token = req.cookies.x_access_token;
        
        const userInfo = await User.findByToken(token);
        if (!userInfo) return res.status(404).json({ isAuth: false })

        req.user = userInfo;
        next();
    } catch (err) {
        res.status(400).json({ isAuth: false, message: err.message })
    }
}

export default auth;
