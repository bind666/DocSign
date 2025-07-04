import asyncHandler from "express-async-handler";
import createError from "http-errors";
import { checkTokenExpiry, verifyToken } from "../utils/utils.js";
import userModel from "../models/User.js";

const auth = asyncHandler(async (req, res, next) => {
    const { token } = req.cookies;
    // console.log(token);

    if (!token) return next(createError(422, "Token required."));

    let isvalid;
    try {
        isvalid = await verifyToken(token);
    } catch (err) {
        return next(createError(401, "Invalid token."));
    }

    const isExpired = checkTokenExpiry(isvalid.exp);
    if (isExpired) return next(createError(401, "Token expired."));

    const user = await userModel.findOne({ email: isvalid.email, token });
    if (!user) return next(createError(422, "Invalid user."));

    req.user = user;
    next();
});

export { auth };
