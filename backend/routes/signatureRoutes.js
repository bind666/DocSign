import express from "express";
import { saveSignature, getSignaturesForFile, generateSignedPdf, getSignedDocuments } from "../controllers/signatureController.js";
import { auth } from "../middleware/auth.js";
import { logAudit } from "../middleware/logAudit.js";

const router = express.Router();

router.post("/", auth, logAudit, saveSignature);

// ✅ Put this before :fileId route
router.get("/generate/:fileId", auth, generateSignedPdf);
router.get("/:fileId", auth, getSignaturesForFile);
router.get("/signed-docs/list", auth, getSignedDocuments);


export default router;
