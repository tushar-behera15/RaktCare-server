import mongoose, { Document, Schema } from "mongoose";

export interface IHospital extends Document {
    userId: mongoose.Types.ObjectId;
    hospitalName: string;
    registrationNumber: string;
    licenseNumber: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    emergencyContact: string;
    openingTime: string;
    closingTime: string;
    isVerified: boolean;
}

const hospitalSchema = new Schema<IHospital>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
            unique: true,
        },

        hospitalName: {
            type: String,
            required: true,
            trim: true,
        },

        registrationNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        licenseNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },

        city: {
            type: String,
            required: true,
            trim: true,
        },

        state: {
            type: String,
            required: true,
            trim: true,
        },

        pincode: {
            type: String,
            required: true,
        },

        emergencyContact: {
            type: String,
            required: true,
        },

        openingTime: {
            type: String,
            required: true,
        },

        closingTime: {
            type: String,
            required: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const HospitalModel = mongoose.model<IHospital>(
    "hospitals",
    hospitalSchema
);

export default HospitalModel;