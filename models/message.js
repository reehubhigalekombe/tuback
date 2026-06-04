import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
chatId: {
    type: String,
    required: true,
},
senderId : {
    type: String,
    required: true
},
receiverId: {
    type: String,
    required: true
},
text: {
    type: String
},
type: {
    type: String, 
    enum: ["text", "image", "audio", "video"], default: "text"
},
fileUrl: {
    type: String
},
fileName: {
    type: String
},
fileSize: {
    type: Number
},
status: {type: String, enum: ["sent", "delivered", "seen"], default: "sent"},
},
{timestamps: true}
);

export default mongoose.model("Message", messageSchema)