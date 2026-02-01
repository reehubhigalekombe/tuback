import mongoose  from "mongoose";

 const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Yes! MongoDB Compass connected Succesfuly")

    }catch(error) {
        console.error("Hello MongoDB has failed to connect")
    }
}

export default connectDB