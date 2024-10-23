import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    _id:{
        type: int,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Message', MessageSchema);