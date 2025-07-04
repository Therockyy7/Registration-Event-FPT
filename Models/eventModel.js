
import mongoose from "mongoose";


const eventSchema = new mongoose.Schema({

    description: String,
    date: Date,
    location: String,
    capacity: Number,
    name: String,
    numberOfRegister: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Event = mongoose.model('Event', eventSchema);

export default Event;