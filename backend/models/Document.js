import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    filePath:{
        type: String,
        required: true
    },
    size:{
        type: Number,
        required: true
    },
    mimetype:{
        type: String,
        required: true
    }

}, { timestamps: true });


export default mongoose.model('Document', documentSchema);
