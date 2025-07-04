// routes/auditRoutes.js
import express from "express";
import Audit from "../models/Audit.js";

const router = express.Router();

router.get("/:fileId", async (req, res) => {
    try {
        const logs = await Audit.find({ fileId: req.params.fileId }).sort({ timestamp: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch audit logs" });
    }
});

export default router;
