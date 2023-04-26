import { User } from "../models/User.js";
import ShelfService from "./shelf.js";

export default {
    registerUser: async (registerDto) => {
        if (registerDto.name == undefined) throw { status: 400, message: "User name must be provided." }
        if (registerDto.email == undefined) throw { status: 400, message: "User email must be provided." }
        if (registerDto.password == undefined) throw { status: 400, message: "User password must be provided." }

        const user = new User(registerDto) // using body-parser

        // check duplication by email
        const userInfo = await User.findOne({ email: registerDto.email })
        if (userInfo) { // already registerd
            throw { // conflict
                status: 409,
                message: `User email [${registerDto.email}] is already registered.`
            }
        }

        // add default bookeshelf
        ShelfService.addNewShelf(user._id, { name: "basic" });

        await user.save() // mongoDB function
        return {}
    },
    loginUser: async (userEmail, userPassword) => {
        if (userEmail == undefined) throw {status: 400, message: "User email must be provided."}
        if (userPassword == undefined) throw {status: 400, message: "User password must be provided."}

        // find user by email
        const userInfo = await User.findOne({ email: userEmail })
        if (!userInfo) { // not registerd
            throw {
                status: 409,
                message: `User [${userEmail}] was not registered.`
            }
        }

        // check password
        const isMatch = await userInfo.comparePassword(userPassword)
        if (!isMatch) {
            throw {
                status: 404,
                message: `User email or password was wrong.`
            }
        }

        // generate token
        const token = await userInfo.generateToken();
        return token;
    },
    logoutUser: async (userId) => {
        await User.findOneAndUpdate({ _id: userId }, { token: "" }); // delete token
        return {}
    }
}
