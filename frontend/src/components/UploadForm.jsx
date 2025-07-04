import { useState } from "react";
import { uploadDocument } from "../services/docService";

const UploadForm = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.type === "application/pdf") {
            setFile(selected);
            setMessage("");
        } else {
            setMessage("Only PDF files are allowed!");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const uploaded = await uploadDocument(formData);
            setMessage("✅ PDF uploaded successfully!");
            setFile(null);

            // 🔔 Notify parent to update list
            if (onUploadSuccess) {
                onUploadSuccess(uploaded);
            }
        } catch (err) {
            console.error("Upload failed", err);
            setMessage("❌ Upload failed. Try again.");
        }
    };

    return (
        <div className="p-6 bg-transparent border border-gray-300 rounded-lg shadow-md w-full max-w-xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-4">📤 Upload PDF Document</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
                />
                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                    📎 Upload
                </button>
            </form>
            {message && <p className="mt-4 text-sm font-medium text-blue-600">{message}</p>}
        </div>

    );
};

export default UploadForm;
