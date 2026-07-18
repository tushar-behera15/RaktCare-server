import { Request, Response } from "express";
import BloodStockModel from "../models/BloodStockModel";
import HospitalModel from "../models/HospitalModel";

export async function addBloodStock(req: Request, res: Response) {
    try {
        const userId = (req as any).user.userId;

        const hospital = await HospitalModel.findOne({ userId });

        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: "Hospital profile not found.",
            });
        }

        const {
            bloodGroup,
            availableUnits,
            reservedUnits,
        } = req.body;

        const existingStock = await BloodStockModel.findOne({
            hospitalId: hospital._id,
            bloodGroup,
        });

        if (existingStock) {
            return res.status(409).json({
                success: false,
                message: `${bloodGroup} stock already exists.`,
            });
        }

        const bloodStock = await BloodStockModel.create({
            hospitalId: hospital._id,
            bloodGroup,
            availableUnits,
            reservedUnits,
            totalUnits: availableUnits + reservedUnits,
            lastUpdated: new Date(),
        });

        return res.status(201).json({
            success: true,
            message: "Blood stock added successfully.",
            data: bloodStock,
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Failed to add blood stock.",
            error: err,
        });
    }
}

export async function updateBloodStock(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const {
            availableUnits,
            reservedUnits,
        } = req.body;

        const totalUnits = availableUnits + reservedUnits;

        const updatedBloodStock =
            await BloodStockModel.findByIdAndUpdate(
                id,
                {
                    availableUnits,
                    reservedUnits,
                    totalUnits,
                    lastUpdated: new Date(),
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!updatedBloodStock) {
            return res.status(404).json({
                success: false,
                message: "Blood stock not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blood stock updated successfully",
            data: updatedBloodStock,
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Failed to update blood stock",
        });
    }
}

export async function getHospitalBloodStock(req: Request, res: Response) {
    try {
        const userId = (req as any).user.userId;

        const hospital = await HospitalModel.findOne({ userId });

        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: "Hospital profile not found.",
            });
        }
        const hospitalStock = await BloodStockModel.find({ hospitalId: hospital._id });
        if (!hospitalStock) {
            throw new Error("Blood stock not found");
        }
        res.status(200).json({
            success: true,
            message: "Blood stock found successfully",
            data: hospitalStock,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to get blood stock",
            error: err,
        });
    }
}

export async function getBloodStockByGroup(req: Request, res: Response) {
    try {
        const { bloodGroup } = req.params;

        const bloodStock = await BloodStockModel.find({
            bloodGroup: bloodGroup as any,
        }).populate("hospitalId");

        if (bloodStock.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No blood stock found for this blood group.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blood stock retrieved successfully.",
            data: bloodStock,
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Failed to get blood stock.",
        });
    }
}