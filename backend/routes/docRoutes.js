// routes/docRoutes.js
import express from "express";
import upload from "../middleware/upload.js";
import { getUserDocs, uploadPDF } from "../controllers/documentController.js";
import { auth } from "../middleware/auth.js";

const docRouter = express.Router();

docRouter.post("/upload", auth, upload.single("file"), uploadPDF);
docRouter.get("/", auth, getUserDocs);

export default docRouter;
