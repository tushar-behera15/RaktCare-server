import mongoose from "mongoose";

export interface ISession {
    userId: mongoose.Types.ObjectId;
    refreshTokenHash: string;
    ip: string;
    userAgent: string;
    revoked: Boolean;
}

const sessionSchema = new mongoose.Schema<ISession>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "user id is required"]
    },
    refreshTokenHash: {
        type: String,
        required: [true, "refresh token is required"],
    },
    ip: {
        type: String,
        required: [true, "ip is required"],
    },
    userAgent: {
        type: String,
        required: [true, "user agent is required"],
    },
    revoked: {
        type: Boolean,
        default: false,
    }

}, {
    timestamps: true
})

const sessionModel = mongoose.model("sessions", sessionSchema);
export default sessionModel;