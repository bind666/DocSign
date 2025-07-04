import bcrypt, { hash } from "bcrypt";
import createError from "http-errors";
import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    token: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) next()
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)
        next()

    } catch (error) {
        return next(createError(500, error.message))
    }
})

const userModel = model("userModel", userSchema);

export default userModel