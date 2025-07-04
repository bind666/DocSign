// middleware/logAudit.js
import Audit from "../models/Audit.js";

export const logAudit = async (req, res, next) => {
    const { fileId, signer } = req.body;
    const ip = req.ip;

    try {
        if (fileId && signer) {
            await Audit.create({ fileId, signer, ip });
        }
    } catch (err) {
        console.error("Audit log failed:", err);
    }

    next();
};
