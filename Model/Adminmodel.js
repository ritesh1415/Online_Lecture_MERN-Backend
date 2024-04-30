import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // role: {
    //     type: String,
    //     enum: ['admin', 'instructor'],
    //     required: true
    // },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

const Adminmodel = mongoose.model('User', userSchema);

export default Adminmodel;
