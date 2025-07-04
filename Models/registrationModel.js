import mongoose from "mongoose";


const registrationSchema = new mongoose.Schema({

    studentId: String,
    eventId: String,

    registrationDate: {
        type: Date,
        default: Date.now
    },
})

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;