import { Request, Response } from "express";
import HospitalModel from "../models/HospitalModel";
import jwt from "jsonwebtoken";

export async function createHospitalProfile(req: Request, res: Response) {
    try {
        const { hospitalName, registrationNumber, licenseNumber, address, city, state, pincode, emergencyContact, openingTime, closingTime, isVerified } = req.body;

        const decodedToken = jwt.decode(req.cookies.refreshToken) as { userId: string };
        const userId = decodedToken.userId;

        const existingHospital = await HospitalModel.findOne({ userId });

        if (existingHospital) {
            return res.status(409).json({
                success: false,
                message: "Hospital profile already exists",

            })
        }

        const hospital = await HospitalModel.create({
            userId,
            hospitalName,
            registrationNumber,
            licenseNumber,
            address,
            city,
            state,
            pincode,
            emergencyContact,
            openingTime,
            closingTime,
            isVerified
        })
        console.log("Hospital User ID:", hospital.userId.toString());

        return res.status(201).json({
            success: true,
            message: "Hospital profile created successfully",
            data: hospital
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while creating hospital profile",
            error: error
        })
    }

}

export async function updateHospitalProfile(req: Request, res: Response) {
    try {
        const { hospitalName, registrationNumber, licenseNumber, address, city, state, pincode, emergencyContact, openingTime, closingTime, isVerified } = req.body;

        const { id } = req.params;
        const existingHospital = await HospitalModel.findOne({ _id: id });

        if (!existingHospital) {
            return res.status(404).json({
                success: false,
                message: "Hospital profile not found",

            })
        }

        const hospital = await HospitalModel.findByIdAndUpdate(existingHospital._id, {
            $set: {
                hospitalName,
                registrationNumber,
                licenseNumber,
                address,
                city,
                state,
                pincode,
                emergencyContact,
                openingTime,
                closingTime,
                isVerified
            }
        }, { new: true, runValidators: true })

        return res.status(200).json({
            success: true,
            message: "Hospital profile updated successfully",
            data: hospital
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating hospital profile",
            error: error
        })
    }
}

export async function getHospitalById(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const existingHospital = await HospitalModel.findOne({ _id: id });

        if (!existingHospital) {
            return res.status(404).json({
                success: false,
                message: "Hospital profile not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Hospital profile found successfully",
            data: existingHospital,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching hospital profile",
            error: error,
        });
    }
}

export async function getAllHospitals(req: Request, res: Response) {
    try {
        const hospitals = await HospitalModel.find();
        if (!hospitals) {
            return res.status(404).json({
                success: false,
                message: "Hospitals not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Hospitals found successfully",
            data: hospitals,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching hospitals",
            error: error,
        });
    }
}


