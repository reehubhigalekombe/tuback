import express from "express";
import Message from "../models/message.js";
import User from "../models/users.js"

const router = express.Router();

router.get("/:chatId",  async (req, res) => {
   try {
     const{chatId} = req.params
    const messages = await Message.find({chatId})
    .sort({createdAt: 1});

    res.json(messages)
   }catch(err) {
    console.error("Failed fetching mesages", err);
    res.status(500).json({error: "Server error please"})
   }
});

router.post("/send", async (req, res) => {
   try {
      const {senderId, receiverId, text, type} = req.body;
      if(!senderId || !receiverId) {
         return res.status(400).json({message: "There is a missing sender or receiver"})
      }
      const chatId = [senderId, receiverId].sort().join("_");

      const message = await Message.create({
         senderId, receiverId, chatId, text, type: type || "text"
      });
      res.json(message);

   }catch(err) {
      console.error(err)
      res.status(500).json({message: "Sorry falailed to send message"});
   }
});

router.get("/conversations/:userId", async (req, res) => {
   try {
      const {userId} = req.params;
      const messages = await Message.find({
         $or: [
            {senderId: userId},
            {receiverId: userId},
         ],

      }).sort({createdAt: -1});
      const chatMap = new Map();
       for (const msg of messages) {
         const otherUserId = msg.senderId === userId? msg.receiverId : msg.senderId;

         if(!chatMap.has(msg.chatId)) {
            const user = await  User.findById(otherUserId).select(
               "name handle avatar isOnline lastSeen"
            );
            chatMap.set(msg.chatId, {
               chatId: msg.chatId,
               user,
               lastMessage: msg.text,
               updatedAt: msg.createdAt,
            });
         }
       }
res.json([...chatMap.values()])
   }  catch(err) {
      console.error(err);
      res.status(500).json({message: "failed to load Converstaions"})
   }
})

export default router;