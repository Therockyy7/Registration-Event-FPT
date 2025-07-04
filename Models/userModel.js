import mongoose from "mongoose";


const userSchema = new mongoose.Schema({

    username: String,
    password: String,
    role: {
        type: String,
        enum: ['admin', 'student'],
        default: 'student'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;