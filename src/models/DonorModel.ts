import mongoose, { Document } from "mongoose";

export interface IDonor extends Document {
    userId: mongoose.Types.ObjectId;
    weight?: number;
    hemoglobin?: number;
    diseases: string[];
    isAvailableForDonation: boolean;
    lastDonationDate?: Date;
    donationCount: number;
}

const donorSchema = new mongoose.Schema<IDonor>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        unique: true
    },

    weight: {
        type: Number,
        nullable: true,
    },
    hemoglobin: {
        type: Number,
        nullable: true,
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
    donationCount: {
        type: Number,
        default: 0,
        min: 0,
    },
}, {
    timestamps: true
})

const DonorModel = mongoose.model<IDonor>("donors", donorSchema);
export default DonorModel;