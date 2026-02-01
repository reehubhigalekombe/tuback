import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
    userId: {
        type: String, 
        required: true
    },
    mediaUrl: {
         type: String, 
        required: true
    },
    createdAt: {
type: Date,
default: Date.now,
expires: 86400
    }
})

const Status = mongoose.model("Status", statusSchema);
export default Status