import userModel from "../models/User.js";
import ApiResponse from "../utils/ApiResponse.js";
import createError from "http-errors";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { generateCookies } from "../utils/utils.js";

const registerUser = asyncHandler(async (req, res, next) => {
    const isUser = await userModel.findOne({ email: req.body.email });
    if (isUser) return next(createError(422, "User already exists"));

    const user = await userModel.create(req.body);
    res.status(200).json(new ApiResponse(user, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {

    const user = await userModel.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "Invalid credentials"));

    const isPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isPassword) return next(createError(401, "Invalid credentials"));

    const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
    };

    const { token } = generateCookies(payload);

    user.token = token;
    await user.save();

    const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: user.token
    };

    res
        .status(200)
        .cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
        })
        .json(new ApiResponse(userData, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res, next) => {
    try {
        const { _id } = req.user;
        await userModel.findByIdAndUpdate(_id, { token: null });

        res.status(200)
            .clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            })
            .json(new ApiResponse(null, "Logout successfully"));
    } catch (err) {
        return next(createError(500, "Logout failed"));
    }
});

const getAllUsers = asyncHandler(async (req, res) => {
    // Fetch all users, exclude sensitive info like password & token
    const users = await userModel.find({}, { password: 0, token: 0, __v: 0 });
    res.status(200).json(new ApiResponse(users, "Users fetched successfully"));
});

export { registerUser, loginUser, logoutUser, getAllUsers };
