import mongoose from 'mongoose';

const RegisterSchema = new mongoose.Schema({
    _id:{
        type: String,
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

export default mongoose.model('Register', RegisterSchema);