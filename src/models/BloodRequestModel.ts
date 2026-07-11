import mongoose, { Document } from "mongoose";

export interface IBloodRequest extends Document {
    hospitalId: mongoose.Types.ObjectId;
    recipientId: mongoose.Types.ObjectId;

    bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

    unitsRequired: number;

    urgency: "low" | "medium" | "high" | "critical";

    status: "pending" | "approved" | "rejected" | "completed";

    reason: string;

    requiredDate: Date;

    remarks?: string;
}

const bloodRequestSchema = new mongoose.Schema<IBloodRequest>(
    {
        hospitalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "hospitals",
            required: true,
        },

        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "recipients",
            required: true,
        },

        bloodGroup: {
            type: String,
            required: true,
            enum: [
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-",
            ],
        },

        unitsRequired: {
            type: Number,
            required: true,
            min: 1,
        },

        urgency: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "medium",
        },

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected",
                "completed",
            ],
            default: "pending",
        },

        reason: {
            type: String,
            required: true,
            trim: true,
        },

        requiredDate: {
            type: Date,
            required: true,
        },

        remarks: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const BloodRequestModel = mongoose.model<IBloodRequest>(
    "bloodrequests",
    bloodRequestSchema
);

export default BloodRequestModel;