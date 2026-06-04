
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String, required: true
    },
    handle: {
   type: String, required: true, unique: true
    },
    email: {
           type: String, unique: true, sparse: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        type: String,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    lastSeen: {
        type: Date,
        default: null
    },
    password: {   type: String, required: true}
},
{timestamps: true})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}
export default mongoose.model("User", userSchema)