import { Document, Page, pdfjs } from "react-pdf";
import { getSignedDocuments, getSignaturesByFileId } from "../services/signService";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js`;

const SignedPdfList = ({ refreshTrigger }) => {
    const [docs, setDocs] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [signedPdfUrl, setSignedPdfUrl] = useState(null);
    const [signatures, setSignatures] = useState([]);
    const [numPages, setNumPages] = useState(null);
    const pdfWrapperRef = useRef();

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const documents = await getSignedDocuments(); // ✅ Only signed ones
                setDocs(documents);
            } catch (err) {
                console.error("Failed to fetch signed documents:", err);
            }
        };
        fetchDocs();
    }, [refreshTrigger]);

    const loadSignatures = async (fileId) => {
        try {
            const data = await getSignaturesByFileId(fileId);
            setSignatures(data);
        } catch (err) {
            console.error("Failed to fetch signatures:", err);
        }
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleViewSignedPdf = async (doc) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/signatures/generate/${doc._id}`, {
                withCredentials: true,
            });
            setSignedPdfUrl(res.data.signedUrl);
            setSelectedDoc(doc);
            loadSignatures(doc._id);
        } catch (err) {
            console.error("Error generating signed PDF", err);
            alert("Failed to generate signed PDF");
        }
    };

    const handleDownloadSignedPdf = () => {
        if (!signedPdfUrl) return;
        const link = document.createElement("a");
        link.href = signedPdfUrl;
        link.download = `signed-${selectedDoc.originalName}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Signed PDFs</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {docs.map((doc) => (
                    <div key={doc._id} className="border rounded-lg p-4 shadow">
                        <p className="text-sm font-semibold">{doc.originalName}</p>
                        <button
                            className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded"
                            onClick={() => handleViewSignedPdf(doc)}
                        >
                            View Signed PDF
                        </button>
                    </div>
                ))}
            </div>

            {selectedDoc && signedPdfUrl && (
                <div className="mt-8 border rounded-lg p-4 shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                            Signed PDF: {selectedDoc.originalName}
                        </h3>
                        <button
                            onClick={() => {
                                setSelectedDoc(null);
                                setSignedPdfUrl(null);
                                setSignatures([]);
                            }}
                            className="text-red-500 hover:text-red-700 text-sm font-bold"
                        >
                            Close ✖
                        </button>
                    </div>

                    <button
                        onClick={handleDownloadSignedPdf}
                        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        ⬇️ Download Signed PDF
                    </button>

                    <div className="relative inline-block" ref={pdfWrapperRef}>
                        <Document
                            file={signedPdfUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            className="w-full flex justify-center"
                        >
                            <Page pageNumber={1} width={600} />
                        </Document>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignedPdfList;
