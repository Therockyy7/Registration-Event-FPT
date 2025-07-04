import mongoose from "mongoose";

export const connectToMongoDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://HoangPhuc:phuctran2004%40@cluster0.5z1efea.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        console.log("Connect to MongoDB");

    } catch (error) {
        console.log("Error connecting to MongoDB", error.message);

    }
}