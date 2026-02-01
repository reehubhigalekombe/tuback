import express from "express";
import Message from "../models/message.js";

const router = express.Router();

router.get("/:chatId",  async (req, res) => {
   try {
     const{chatId} = req.params
    const messages = await Message.find({chatId: req.params.chatId})
    .sort({createdAt: 1});

    res.json(messages)
   }catch(err) {
    console.error("Failed fetching mesages", err);
    res.status(500).json({error: "Server error please"})
   }
})

export default router;