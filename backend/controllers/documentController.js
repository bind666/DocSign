// controllers/uploadController.js
import Document from "../models/Document.js";
import path from "path";

export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const doc = await Document.create({
      user: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: fileUrl,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    res.status(201).json({ message: "PDF uploaded successfully", document: doc });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};





export const getUserDocs = async (req, res) => {
    try {
        const documents = await Document.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(documents);
    } catch (error) {
        console.error(11, error);
        res.status(500).json({ message: "Failed to fetch documents" });
    }
};

