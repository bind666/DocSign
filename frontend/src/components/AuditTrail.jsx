import { useEffect, useState } from "react";
import { getAuditTrail } from "../services/auditService";
import { getSignedDocuments } from "../services/signService";

const AuditTrail = () => {
    const [fileId, setFileId] = useState("");
    const [auditLogs, setAuditLogs] = useState([]);
    const [signedDocs, setSignedDocs] = useState([]);

    useEffect(() => {
        const fetchSignedDocs = async () => {
            try {
                const docs = await getSignedDocuments();
                setSignedDocs(docs);
            } catch (err) {
                console.error("Failed to load signed documents", err);
            }
        };
        fetchSignedDocs();
    }, []);

    const handleFetchAudit = async () => {
        if (!fileId) return;
        try {
            const logs = await getAuditTrail(fileId);
            setAuditLogs(logs);
        } catch (err) {
            console.error("Failed to fetch audit logs", err);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto mt-12 bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 text-white animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center text-teal-300 drop-shadow">
                🕵️‍♂️ Audit Trail Viewer
            </h2>

            {/* File Selection */}
            <div className="mb-6">
                <label className="block mb-2 font-medium text-lg">📄 Select a signed document:</label>
                <select
                    className="w-full p-3 bg-white/10 text-white rounded shadow border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    value={fileId}
                    onChange={(e) => setFileId(e.target.value)}
                >
                    <option disabled value="" className="bg-black text-white">-- Select Document --</option>
                    {signedDocs.map((doc) => (
                        <option key={doc._id} value={doc._id} className="bg-gray-900 text-white">
                            {doc.originalName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Button */}
            <button
                onClick={handleFetchAudit}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-blue-600 hover:to-indigo-500 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                disabled={!fileId}
            >
                🔍 View Audit Logs
            </button>

            {/* Audit Logs */}
            {auditLogs.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-teal-200">📝 Audit Logs</h3>
                    <ul className="grid gap-4">
                        {auditLogs.map((log, index) => (
                            <li
                                key={index}
                                className="p-4 bg-gradient-to-br from-black via-gray-800 to-gray-900 border border-white/20 rounded-xl shadow-lg hover:shadow-teal-500/40 transition duration-300"
                            >
                                <p><span className="font-bold text-teal-300">👤 Signer:</span> {log.signer}</p>
                                <p><span className="font-bold text-yellow-300">🌐 IP:</span> {log.ip}</p>
                                <p><span className="font-bold text-pink-300">⏰ Time:</span> {new Date(log.timestamp).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* No logs found */}
            {auditLogs.length === 0 && fileId && (
                <p className="mt-6 text-center text-gray-300 italic">🚫 No logs found for this document.</p>
            )}
        </div>
    );
};

export default AuditTrail;
