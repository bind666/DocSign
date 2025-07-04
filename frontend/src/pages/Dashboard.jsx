import UploadForm from "../components/UploadForm";
import DocumentList from "../components/DocumentList";
import SignedPdfList from "../components/SignedPdfList";
import { useState } from "react";

const Dashboard = () => {
    const [refreshDocs, setRefreshDocs] = useState(false);
    const [refreshSignedDocs, setRefreshSignedDocs] = useState(false); // 🔁 new state

    const triggerRefreshDocs = () => setRefreshDocs((prev) => !prev);
    const triggerRefreshSignedDocs = () => setRefreshSignedDocs((prev) => !prev); // 🔁 toggler

    return (
        <div className="container mx-auto p-4">
            <UploadForm onUploadSuccess={triggerRefreshDocs} />
            <DocumentList refreshTrigger={refreshDocs} onSigned={triggerRefreshSignedDocs} />
            <SignedPdfList refreshTrigger={refreshSignedDocs} />
        </div>
    );
};

export default Dashboard;
