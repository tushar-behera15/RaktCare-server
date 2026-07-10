import mongoose from "mongoose";

export interface IOtp {
    email: string,
    user: mongoose.Types.ObjectId,
    otpHash: string
}

const otpSchema = new mongoose.Schema<IOtp>({
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: [true, "user is reuired"],
        ref: "users"
    },
    otpHash: {
        type: String,
        required: true
    }
}, { timestamps: true })

const otpModel = mongoose.model("otps", otpSchema);
export default otpModel;