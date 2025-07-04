import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useRef, useState } from "react";
import { getUserDocuments } from "../services/docService";
import { saveSignature } from "../services/signService";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js`;

const DocumentList = ({ refreshTrigger, onSigned }) => {
    const [docs, setDocs] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [signerName, setSignerName] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [signaturePosition, setSignaturePosition] = useState(null);
    const [isPlaced, setIsPlaced] = useState(false);
    const pdfWrapperRef = useRef();
    const signatureRef = useRef();

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const documents = await getUserDocuments();
                setDocs(documents);
            } catch (err) {
                console.error("Failed to fetch documents:", err);
            }
        };
        fetchDocs();
    }, [refreshTrigger]);


    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const rect = pdfWrapperRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setSignaturePosition({ x, y });
        setIsDragging(false);
        setIsPlaced(true);
    };

    const handleSaveSignature = async () => {
        if (!signaturePosition || !signerName) {
            alert("Please enter and place your signature.");
            return;
        }

        try {
            await saveSignature({
                fileId: selectedDoc._id,
                signer: signerName,
                x: signaturePosition.x,
                y: signaturePosition.y,
                page: 1,
            });

            alert("✅ Signature saved!");
            setSignaturePosition(null);
            setSignerName("");
            setIsPlaced(false);

            // 🔔 Notify dashboard to refresh signed documents
            if (onSigned) {
                onSigned();
            }
        } catch (err) {
            console.error("Error saving signature", err);
            alert("❌ Failed to save signature.");
        }
    };

    const handleDragStartFromCanvas = () => {
        setIsDragging(true);
    };

    const handleDragEndOnCanvas = (e) => {
        const rect = pdfWrapperRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setSignaturePosition({ x, y });
        setIsDragging(false);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Uploaded Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {docs.map((doc) => (
                    <div key={doc._id} className="border rounded-lg p-4 shadow">
                        <p className="text-sm font-semibold">{doc.originalName}</p>
                        <button
                            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
                            onClick={() => {
                                setSelectedDoc(doc);
                                setSignaturePosition(null);
                                setSignerName("");
                                setIsPlaced(false);
                            }}
                        >
                            Preview & Sign
                        </button>
                    </div>
                ))}
            </div>

            {selectedDoc && (
                <div className="mt-8 border rounded-lg p-4 shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">PDF Editor</h3>
                        <button
                            onClick={() => {
                                setSelectedDoc(null);
                                setSignaturePosition(null);
                                setSignerName("");
                                setIsPlaced(false);
                            }}
                            className="text-red-500 hover:text-red-700 text-sm font-bold"
                        >
                            Close ✖
                        </button>
                    </div>

                    {/* Signature input */}
                    <input
                        type="text"
                        placeholder="Type your signature"
                        value={signerName}
                        onChange={(e) => setSignerName(e.target.value)}
                        className="border p-2 rounded mb-2 w-full max-w-xs bg-transparent"
                    />

                    {/* Drag source */}
                    {!isPlaced && (
                        <div className="mb-2">
                            <div
                                draggable
                                onDragStart={() => setIsDragging(true)}
                                className="inline-block px-2 py-1 bg-yellow-300 text-black font-bold rounded cursor-move"
                            >
                                ✍️ Drag Signature
                            </div>
                        </div>
                    )}

                    {/* PDF wrapper */}
                    <div
                        ref={pdfWrapperRef}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className="relative inline-block"
                    >
                        <Document
                            file={selectedDoc.filePath}
                            onLoadSuccess={onDocumentLoadSuccess}
                            className="w-full flex justify-center"
                        >
                            <Page pageNumber={1} width={600} />
                        </Document>

                        {/* Render the signature over PDF */}
                        {signaturePosition && (
                            <div
                                ref={signatureRef}
                                draggable
                                onDragStart={handleDragStartFromCanvas}
                                onDragEnd={handleDragEndOnCanvas}
                                style={{
                                    position: "absolute",
                                    top: signaturePosition.y,
                                    left: signaturePosition.x,
                                    fontWeight: "bold",
                                    color: "blue",
                                    backgroundColor: "white",
                                    border: "1px solid blue",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    cursor: "grab",
                                }}
                            >
                                {signerName || "Signature"}
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    {signaturePosition && (
                        <button
                            onClick={handleSaveSignature}
                            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                        >
                            ✅ Save Signature
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default DocumentList;