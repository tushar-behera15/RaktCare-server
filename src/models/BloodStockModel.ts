import mongoose, { Document } from "mongoose";

export interface IBloodStock extends Document {
    hospitalId: mongoose.Types.ObjectId;
    bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    availableUnits: number;
    reservedUnits: number;
    totalUnits: number;
    lastUpdated: Date;
}

const bloodStockSchema = new mongoose.Schema<IBloodStock>(
    {
        hospitalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "hospitals",
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

        availableUnits: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },

        reservedUnits: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalUnits: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },

        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

bloodStockSchema.index(
    { hospitalId: 1, bloodGroup: 1 },
    { unique: true }
);

const BloodStockModel = mongoose.model<IBloodStock>(
    "bloodstocks",
    bloodStockSchema
);

export default BloodStockModel;