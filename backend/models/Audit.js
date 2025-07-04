import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true,
    },
    signer: {
        type: String,
        required: true,
    },
    ip: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model("Audit", auditSchema);
