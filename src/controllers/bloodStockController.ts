import { Request, Response } from "express";
import BloodStockModel from "../models/BloodStockModel";

export async function addBloodStock(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { bloodGroup, availableUnits, reservedUnits, totalUnits, lastUpdated } = req.body;
        const bloodStock = await BloodStockModel.create({
            hospitalId: id as string,
            bloodGroup,
            availableUnits,
            reservedUnits,
            totalUnits,
            lastUpdated: lastUpdated ? new Date(lastUpdated) : new Date(),
        });
        if (!bloodStock) {
            throw new Error("Blood stock not added");
        }
        res.status(201).json({
            success: true,
            message: "Blood stock added successfully",
            data: bloodStock,
        });

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to add blood stock",
            error: err,
        });
    }
}

export async function updateBloodStock(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { availableUnits, reservedUnits, totalUnits, lastUpdated } = req.body;
        const updateBloodStock = await BloodStockModel.findByIdAndUpdate({ _id: id }, {
            availableUnits,
            reservedUnits,
            totalUnits,
            lastUpdated: lastUpdated ? new Date(lastUpdated) : new Date()
        }, {
            new: true,
            runValidators: true
        })
        if (!updateBloodStock) {
            throw new Error("Blood stock not updated");
        }
        res.status(200).json({
            success: true,
            message: "Blood stock updated successfully",
            data: updateBloodStock,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to update blood stock",
            error: err,
        });
    }
}

export async function getHospitalBloodStock(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const hospitalStock = await BloodStockModel.find({ hospitalId: id });
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