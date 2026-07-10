import mongoose, { Document } from "mongoose";

export interface IDonor extends Document {
    userId: mongoose.Types.ObjectId;
    weight?: number;
    hemoglobin?: number;
    diseases: string[];
    isAvailableForDonation: boolean;
    lastDonationDate?: Date;
}

const donorSchema = new mongoose.Schema<IDonor>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        unique: true
    },

    weight: {
        type: Number,
        min: 45
    },
    hemoglobin: {
        type: Number,
        min: 10
    },
    diseases: {
        type: [String],
        default: []
    },
    isAvailableForDonation: {
        type: Boolean,
        default: false,
    },
    lastDonationDate: {
        type: Date,
        default: null
    },
}, {
    timestamps: true
})

const DonorModel = mongoose.model<IDonor>("donors", donorSchema);
export default DonorModel;