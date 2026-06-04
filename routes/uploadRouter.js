import express from "express";
import upload from "../middleware/upload.js";
import User from "../models/users.js"

const router = express.Router();

router.post("/upload/avatar",  upload.single("avatar"), async (req, res) => {
const {userId} = req.body;
const user = await User.findByIdAndUpdate(
    userId, {avatar: req.file.path},
    {new: true}
);
res.json({
    success: true,
    avatar: user.avatar
});
});

router.post("/upload/media", upload.single("file"),  async (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            })
        }
res.json({
    success: true,
    fileUrl: req.file.path,
    fileName: req.file.originalname,
    fileType: req.file.mimetype
});
    } catch(error) {
res.status(500).json({
    success: false,
    error: error.message})
    }
});

export default router;