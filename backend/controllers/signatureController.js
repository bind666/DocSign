import Signature from "../models/Signature.js";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";
import Document from "../models/Document.js";

export const saveSignature = async (req, res) => {
    try {
        const { fileId, signer, x, y, page = 1 } = req.body;

        if (!fileId || !signer || x == null || y == null) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const saved = await Signature.create({
            fileId,
            signer,
            x,
            y,
            page,
        });

        res.status(201).json({ message: "Signature saved", signature: saved });
    } catch (err) {
        console.error("Signature Save Error:", err);
        res.status(500).json({ message: "Signature save failed", error: err.message });
    }
};

export const getSignaturesForFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const signatures = await Signature.find({ fileId });
        res.json(signatures);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch signatures", error: err.message });
    }
};

export const generateSignedPdf = async (req, res) => {
    try {
        const { fileId } = req.params;

        const fileDoc = await Document.findById(fileId);
        if (!fileDoc) return res.status(404).json({ message: "Document not found" });

        const signatures = await Signature.find({ fileId });
        if (signatures.length === 0) return res.status(400).json({ message: "No signatures to embed" });

        const filePath = path.join(path.resolve(), "uploads", fileDoc.filename);
        const existingPdfBytes = fs.readFileSync(filePath);

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        for (const sig of signatures) {
            const page = pages[sig.page - 1]; // 0-based index
            page.drawText(sig.signer, {
                x: sig.x,
                y: page.getHeight() - sig.y, // convert screen Y to PDF coordinate
                size: 16,
                font,
                color: rgb(0, 0, 1),
            });
        }

        const pdfBytes = await pdfDoc.save();

        const signedPath = path.join("uploads", `signed-${fileDoc.filename}`);
        fs.writeFileSync(signedPath, pdfBytes);

        const signedUrl = `${req.protocol}://${req.get("host")}/uploads/signed-${fileDoc.filename}`;
        res.status(200).json({ message: "Signed PDF generated", signedUrl });
    } catch (err) {
        console.error("Signed PDF generation failed", err);
        res.status(500).json({ message: "Failed to generate signed PDF", error: err.message });
    }
};

export const getSignedDocuments = async (req, res) => {
    try {
        // Get fileIds which have at least one signature
        const signedFileIds = await Signature.distinct("fileId");

        // Fetch only those documents
        const signedDocs = await Document.find({ _id: { $in: signedFileIds } });

        res.status(200).json(signedDocs);
    } catch (err) {
        console.error("Error fetching signed docs", err);
        res.status(500).json({ message: "Error fetching signed documents" });
    }
};
