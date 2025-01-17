import mongoose from 'mongoose';

const RegisterSchema = new mongoose.Schema({
    _id:{
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Register', RegisterSchema);