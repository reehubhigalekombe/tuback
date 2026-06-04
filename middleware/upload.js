import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "tuchat",
        allowed_formats: ["jpg", "png", "mp4", "mp3", "pdf"]
    },
});

const upload = multer({storage})
export default upload;