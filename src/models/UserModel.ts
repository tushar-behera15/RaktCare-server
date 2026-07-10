import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: "admin" | "donor" | "hospital" | "recipient";
    bloodGroup: string;
    gender: "male" | "female" | "other";
    dateOfBirth: Date;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    profileImage?: string;
    isAvailable?: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        phone: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["admin", "donor", "hospital", "recipient"],
            default: "recipient",
        },

        bloodGroup: {
            type: String,
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

        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },

        dateOfBirth: {
            type: Date,
            required: true,
        },

        address: String,

        city: String,

        state: String,

        pincode: String,

        profileImage: {
            type: String,
            default: "",
        },

        isAvailable: {
            type: Boolean,
            default: true,
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

const UserModel = mongoose.model<IUser>("users", userSchema);
export default UserModel;