import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { getSignaturesByFileId } from "../services/signService";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js`;

const PDFWithSignature = ({ filePath, fileId }) => {
    const [numPages, setNumPages] = useState(null);
    const [signatures, setSignatures] = useState([]);

    useEffect(() => {
        if (!fileId) return;
        const fetch = async () => {
            const data = await getSignaturesByFileId(fileId);
            setSignatures(data);
        };
        fetch();
    }, [fileId]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div className="relative border rounded p-4 mt-4">
            <Document file={filePath} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (_, index) => (
                    <div key={index} className="relative">
                        <Page pageNumber={index + 1} width={600} />
                        {signatures
                            .filter((sig) => sig.page === index + 1)
                            .map((sig, i) => (
                                <div
                                    key={i}
                                    className="absolute text-blue-600 font-semibold border border-blue-400 bg-white px-2 py-1 rounded"
                                    style={{
                                        top: sig.y,
                                        left: sig.x,
                                        position: "absolute",
                                    }}
                                >
                                    {sig.signer}
                                </div>
                            ))}
                    </div>
                ))}
            </Document>
        </div>
    );
};

export default PDFWithSignature;
