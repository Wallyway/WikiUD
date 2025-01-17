import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // id:{
    //     type: String,
    //     required: true
    // },
    username: {
        type: String,
        required: true,
        trim:true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true,
    },
    password:{
        type: String,
        required: true,
        // minlength: 6  //FIXME: DONT DELETE
    }
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);