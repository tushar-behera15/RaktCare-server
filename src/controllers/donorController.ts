import { Request, Response } from "express";
import DonorModel from "../models/DonorModel";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";
export async function createDonorProfile(req: Request, res: Response) {
    try {
        const { weight, hemoglobin, diseases, isAvailableForDonation, lastDonationDate } = req.body;

        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const decodedToken = jwt.decode(token) as { userId: string };
        const userId = decodedToken.userId;
        const existingDonor = await DonorModel.findOne({ userId });

        if (existingDonor) {
            return res.status(409).json({
                success: false,
                message: "Donor profile already exists.",
            });
        }
        const donor = await DonorModel.create({
            userId,
            weight,
            hemoglobin,
            diseases,
            isAvailableForDonation,
            lastDonationDate
        })

        return res.status(201).json({
            success: true,
            message: "Donor profile created successfully",
            data: donor
        })
    } catch (error) {

        return res.status(500).json({
            success: false,

            message: "Internal server error while creating donor profile",

            error: error
        })
    }
}


export async function updateDonorProfile(req: Request, res: Response) {
    try {
        const userId = (req as any).user.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const {
            fullName,
            phone,
            dateOfBirth,
            gender,
            weight,
            hemoglobin,
            diseases,
            isAvailableForDonation,
        } = req.body;

        const donor = await DonorModel.findOne({ userId });

        if (!donor) {
            return res.status(404).json({
                success: false,
                message: "Donor profile not found",
            });
        }

        await UserModel.findByIdAndUpdate(
            userId,
            {
                fullName,
                phone,
                dateOfBirth,
                gender,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        await DonorModel.findOneAndUpdate(
            { userId },
            {
                weight,
                hemoglobin,
                diseases,
                isAvailableForDonation,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        const updatedProfile = await DonorModel.findOne({ userId }).populate({
            path: "userId",
            select:
                "fullName email phone bloodGroup gender dateOfBirth",
        });

        return res.status(200).json({
            success: true,
            message: "Donor profile updated successfully.",
            data: updatedProfile,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error while updating donor profile.",
        });
    }
}

export async function getDonorById(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const existingDonor = await DonorModel.findOne({ _id: id });

        if (!existingDonor) {
            return res.status(404).json({
                success: false,
                message: "Donor profile not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Donor profile found successfully",
            data: existingDonor,
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching donor profile",
            error: error,
        });
    }
}

export async function getAllDonors(req: Request, res: Response) {
    try {
        const donors = await DonorModel.find();
        if (!donors) {
            return res.status(404).json({
                success: false,
                message: "Donors not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Donors found successfully",
            data: donors,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching donors",
            error: error,
        });
    }
}
