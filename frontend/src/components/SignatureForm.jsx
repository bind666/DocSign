import { useState } from "react";
import { saveSignature } from "../services/signService";

const SignatureForm = ({ onSaved }) => {
    const [signer, setSigner] = useState("");
    const [fileId, setFileId] = useState("");
    const [message, setMessage] = useState("");

    const handleSave = async (e) => {
        e.preventDefault();
        if (!signer || !fileId) return setMessage("Signer name and file ID required");

        try {
            const result = await saveSignature({
                signer,
                fileId,
                x: 50,
                y: 50,
                page: 1,
            });
            setMessage("Signature saved!");
            setSigner("");
            setFileId("");
            if (onSaved) onSaved(result.signature);
        } catch (err) {
            console.error("Signature save failed", err);
            setMessage("Failed to save signature");
        }
    };

    return (
        <div className="p-4 border rounded shadow mb-4">
            <h2 className="text-lg font-bold mb-2">Create Signature</h2>
            <form onSubmit={handleSave}>
                <input
                    className="border p-2 mb-2 block w-full"
                    placeholder="Enter your name"
                    value={signer}
                    onChange={(e) => setSigner(e.target.value)}
                />
                <input
                    className="border p-2 mb-2 block w-full"
                    placeholder="Enter File ID"
                    value={fileId}
                    onChange={(e) => setFileId(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Save Signature
                </button>
            </form>
            {message && <p className="mt-2 text-blue-500">{message}</p>}
        </div>
    );
};

export default SignatureForm;
