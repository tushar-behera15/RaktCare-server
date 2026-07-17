import { Request, Response } from "express";
import recipientModel from "../models/RecipientModel";
import DonorModel from "../models/DonorModel";
import HospitalModel from "../models/HospitalModel";
import jwt from "jsonwebtoken";

export async function createRecipient(req: Request, res: Response) {
    try {
        const { patientName, age, gender, contactNo, bloodGroup, unitNeeded, urgency, diseases } = req.body;

        const decodedToken = jwt.decode(req.cookies.refreshToken) as { userId: string };
        const userId = decodedToken.userId;

        const hospital = await HospitalModel.findOne({ userId });

        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: "Hospital profile not found"
            });
        }

        const newRecipient = await recipientModel.create({
            hospitalId: hospital._id,
            patientName,
            age,
            gender,
            contactNo,
            bloodGroup,
            unitNeeded,
            urgency,
            diseases
        });

        return res.status(201).json({
            success: true,
            message: "Recipient request created successfully",
            data: newRecipient
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while creating recipient request",
            error: error
        });
    }
}

export async function getAllRecipient(req: Request, res: Response) {
    try {
        const decodedToken = jwt.decode(req.cookies.refreshToken) as { userId: string };
        const userId = decodedToken.userId;

        const hospital = await HospitalModel.findOne({ userId });
        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: "Hospital profile not found",
            });
        }

        const recipients = await recipientModel
            .find({
                hospitalId: hospital._id,
            })
            .populate({
                path: "assignedDonorId",
                populate: {
                    path: "userId",
                    select: "fullName email phone bloodGroup"
                }
            });

        return res.status(200).json({
            success: true,
            message: "Recipients found successfully",
            data: recipients
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching recipients",
            error: error
        })
    }

}

export async function getRecipientById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const recipient = await recipientModel.findById(id);
        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: "Recipient not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Recipient found successfully",
            data: recipient
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching recipient",
            error: error
        })
    }
}

export async function deleteRecipientById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const recipient = await recipientModel.findByIdAndDelete({ _id: id });
        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: "Recipient not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Recipient deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting recipient",
            error: error
        })
    }
}

export async function updateRecipientById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { patientName, age, gender, contactNo, bloodGroup, unitNeeded, urgency, diseases, status, assignedDonorId } = req.body;
        const recipient = await recipientModel.findByIdAndUpdate(id,
            {
                patientName,
                age,
                gender,
                contactNo,
                bloodGroup,
                unitNeeded,
                urgency,
                diseases,
                status,
                assignedDonorId
            }, {
            new: true,
            runValidators: true
        });
        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: "Recipient not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Recipient updated successfully",
            data: recipient
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating recipient",
            error: error
        })
    }
}

export async function findMatchingDonors(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const recipient = await recipientModel.findById(id);
        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: "Recipient not found"
            });
        }


        const donors = await DonorModel.find({
            isAvailableForDonation: true,
            weight: { $gte: 45 },
            hemoglobin: { $gte: 10 },
            diseases: { $size: 0 }
        }).populate({
            path: 'userId',
            match: { bloodGroup: recipient.bloodGroup },
            select: 'fullName email phone bloodGroup city state'
        });


        const matchingDonors = donors.filter(donor => donor.userId !== null);

        return res.status(200).json({
            success: true,
            message: "Matching donors found successfully",
            data: matchingDonors
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while finding matching donors",
            error: error
        });
    }
}

export async function confirmDonation(req: Request, res: Response) {
    try {
        const { recipientId, donorId } = req.body;

        const recipient = await recipientModel.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: "Recipient not found"
            });
        }

        const donor = await DonorModel.findById(donorId);
        if (!donor) {
            return res.status(404).json({
                success: false,
                message: "Donor not found"
            });
        }

        recipient.status = "completed";
        recipient.assignedDonorId = donor._id as any;
        await recipient.save();

        donor.isAvailableForDonation = false;
        donor.lastDonationDate = new Date();
        await donor.save();

        return res.status(200).json({
            success: true,
            message: "Donation confirmed successfully",
            data: {
                recipient,
                donor
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while confirming donation",
            error: error
        });
    }
}
