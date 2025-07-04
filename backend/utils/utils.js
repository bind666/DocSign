import jwt from "jsonwebtoken";
import createError from "http-errors";
import config from "../config/config.js";

const generateCookies = (payload) => {
    if (!payload || typeof payload !== "object") {
        throw createError(422, "Payload required.");
    }

    const token = jwt.sign(payload, config.JWT_ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
    return { token };
};

const verifyToken = async (token) => {
    return await jwt.verify(token, config.JWT_ACCESS_TOKEN_SECRET);
};

const checkTokenExpiry = (time) => {
    const expiryTime = new Date(time * 1000);
    return expiryTime <= new Date();
};

export { generateCookies, verifyToken, checkTokenExpiry };
