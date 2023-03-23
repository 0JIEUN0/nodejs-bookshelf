const { User } = require('../models/User');

let auth = async (req, res, next) => {
    const token = req.body.token;
    try {
        const userInfo = await User.findByToken(token);
        console.log(userInfo)
        if (!userInfo) return res.status(404).json({ isAuth: false })
        req.user = userInfo;
        next();
    } catch (err) {
        console.log("errrrrrr", err)
        res.status(400).json({ isAuth: false, message: err.message })
    }
}

module.exports = { auth };
