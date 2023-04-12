import { User } from "../models/User.js";

export default {
    registerUser: async (res, registerDto) => {
        const user = new User(registerDto) // using body-parser

        // check duplication by email
        const userInfo = await User.findOne({ email: registerDto.email })
        if (userInfo) { // already registerd
            return res.status(409).json({ // conflict
                success: false,
                message: `User email [${registerDto.email}] is already registered.`
            })
        }

        await user.save() // mongoDB function
        return res.status(200).json({
            success: true
        })
    },
    loginUser: async (res, userEmail, userPassword) => {
        // find user by email
        const userInfo = await User.findOne({ email: userEmail })
        if (!userInfo) { // not registerd
            return res.status(409).json({ // conflict
                loginSuccess: false,
                message: `User [${userEmail}] was not registered.`
            })
        }

        // check password
        const isMatch = await userInfo.comparePassword(userPassword)
        if (!isMatch) {
            return res.status(404).json({
                loginSuccess: false,
                message: `User email or password was wrong.`
            })
        }

        // generate token
        const token = await userInfo.generateToken();
        res.cookie('x_access_token', token, { httpOnly: true })
            .status(200).json({
                loginSuccess: true,
                token: token
            })
    },
    logoutUser: async (res, userId) => {
        await User.findOneAndUpdate({ _id: userId }, { token: "" }); // delete token
        return res.status(200).json({ success: true })
    }
}
