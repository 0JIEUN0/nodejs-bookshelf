import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = 10;
const jwtSecretToken = 'dkjsdkfjfdc;acvc.vcjdkhewrsdf';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        minlength: 5,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number,
    },
})

userSchema.pre('save', function( next ){ // mongoose func
    var user = this;
    if (user.isModified('password')) {
        // make a salt
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err);

            // encrypt password
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);

                // Store hash in your password DB.
                user.password = hash
                next()
            });
        });
    } else {
        next()
    }
})

userSchema.statics.findByToken = function(token) {
    const userId = jwt.verify(token, jwtSecretToken)
    return User.findOne({ "_id": userId, "token": token })
}

userSchema.methods.comparePassword = function(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
}

userSchema.methods.generateToken = async function() {
    var user = this;

    // generate token by jsonwebtoken
    var token = jwt.sign(user._id.toHexString(), jwtSecretToken);
    user.token = token;
    await user.save();
    return token;
}

const User = mongoose.model('User', userSchema)

export { User };
