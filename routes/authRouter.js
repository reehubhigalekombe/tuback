import express from "express";
import User from "../models/users.js";
import jwt from "jsonwebtoken"

const router = express.Router();
const JWT_SECRET = process.env.JWT || "supersecret"

router.post("/register", async(req, res) => {
    const{name, handle, phone, password} = req.body;
    try {
        if(!name || !handle || !phone || !password) return res.status(400).json({
            message: "All feilds are required kindly."
        });

        const existingHandle = await User.findOne({handle});
        if (existingHandle) {
            return res.status(400).json({
                message: "Handle already in use"
            });
        }

        const existingPhone  = await User.findOne({phone});
        if(existingPhone) {
            return res.status(400).json({
                message: "Phone Number allready has an account"
            })
        }

        const user = new User({name, handle, phone,  password});
        await user.save();

        const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: "1d"});
        res.status(201).json(
            {user: {
                id: user._id, name, handle,
                phone: user.phone, avatar: user.avatar
            }, token})
    }catch(err) {
console.error(err);
res.status(500).json({message: "Opps we have a Server error"})
    }
});

router.post("/login", async(req, res) => {
    const {handle, password} = req.body;
    try{
        if(!handle || !password) return res.status(400).json({message: "Soryy all fields are required"});
        const user = await User.findOne({handle});
        if(!user) return res.status(404).json({message: "Opps User not found"});

        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(400).json({message: "invalid Credentials"});

        const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: "1d"});
        res.status(200).json({
            user: {
                id: user._id, name: user.name, handle: user.handle, phone: user.phone,
                avatar: user.avatar, isOnline: user.isOnline,
                 lastSeen: user.lastSeen
            }, token});
    }catch(err) {
console.error(err);
res.status(500).json({message: "Opps Server error"})
}
});

router.post("/logout",  async(req, res) => {
    try {
const {userId} = req.body;
if(userId) {
    await User.findByIdAndUpdate(
        userId, {
            isOnline: false,
        lastSeen: new Date()});
}
res.status(200).json({message: "Logout Sucess"})
    }catch(err) {
        console.error("Logout Error:", err);
        res.status(500).json({message: "Server error ocuured during logout"})
    }
})
export default router