import mongoose, { Document, Schema } from "mongoose";

export interface IRecipient extends Document {
    hospitalId: mongoose.Types.ObjectId;
    patientName: string;
    age: number;
    gender: "male" | "female" | "other";
    contactNo: string;
    bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    unitNeeded: number;
    urgency: "high" | "medium" | "low";
    diseases: string[];
    status: "pending" | "completed";
    assignedDonorId: mongoose.Types.ObjectId;
}

const recipientSchema = new Schema<IRecipient>({
    hospitalId: {
        type: Schema.Types.ObjectId,
        ref: "hospitals",
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true
    },
    contactNo: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        required: true
    },
    unitNeeded: {
        type: Number,
        required: true
    },
    urgency: {
        type: String,
        enum: ["high", "medium", "low"],
        required: true
    },
    diseases: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    },
    assignedDonorId: {
        type: Schema.Types.ObjectId,
        ref: "donors",
        default: null
    }
}, { timestamps: true })

const recipientModel = mongoose.model<IRecipient>("recipients", recipientSchema);
export default recipientModel;