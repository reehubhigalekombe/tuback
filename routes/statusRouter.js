import express from "express";
import multer from "multer";
import Status from "../models/status.js"

const router = express.Router();
const upload = multer({dest: "uploads/"});

router.post("/upload", upload.single("media"), async (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded yet"
            })
        }
const newStatus = new Status({
    mediaUrl: `http://10.0.2.2:3000/uploads/${req.file.filename}`,
    userId: req.body.userId,
    createdAt: new Date()
});

await newStatus.save();

res.json({ success: true, 
    mediaUrl: newStatus.mediaUrl})

    } catch(err) {
console.error(" Hello status upload erroe:", err);
res.status(500).json({success: false, message: " Sorryupload failed"})
    }
});

router.post("/upload-multiple", upload.array("media", 10), async(req, res) => {
    try {
        if(!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }
        const savedStatuses = [];
        for(const file of req.files) {
            const newStatus = new Status({
                mediaUrl: `http://10.0.2.2:3000/uploads/${file.filename}`,
                userId:  req.body.userId,
                createdAt: new Date(),
            });
            await newStatus.save();
            savedStatuses.push(newStatus.mediaUrl)
        };
res.json({
    success: true,
    mediaUrl: savedStatuses
})
    } catch(err) {
   console.error("Uploadd of multiples files failed:", err)
    res.status(500).json({
        success: false,
        message: "Uploads failed"
    })
    }
 
});

router.get("/", async(req, res) => {
    try {
const statuses = (await Status.find())
.slice()
.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
res.json({
    success: true,
    statuses,

})
    }catch(err) {
        console.error("Error while fetching status:", err);
        res.status(500).json({
            success: false,
            message: "Sorry Failedd to fetch Status"
        })
    }
})



export default router

 
      