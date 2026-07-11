import { Request, Response } from "express";
import BloodRequestModel from "../models/BloodRequestModel";
import recipientModel from "../models/RecipientModel";

export async function createBloodRequest(req: Request, res: Response) {
    try {
        const {
            hospitalId,
            recipientId,
            unitsRequired,
            urgency,
            reason,
            requiredDate,
            remarks,
        } = req.body;

        const recipient = await recipientModel.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: "Recipient not found",
            });
        }

        const existingRequests = await BloodRequestModel.find({
            recipientId: recipientId,
            status: "pending",
        });

        if (existingRequests.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Recipient already has a pending blood request",
            });
        }

        const bloodRequest = await BloodRequestModel.create({
            hospitalId,
            recipientId,
            bloodGroup: recipient.bloodGroup,
            unitsRequired,
            urgency,
            reason,
            requiredDate: new Date(requiredDate),
            remarks,
        });

        return res.status(201).json({
            success: true,
            message: "Blood request created successfully",
            data: bloodRequest,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while creating blood request",
            error,
        });
    }
}

export async function getAllBloodRequests(req: Request, res: Response) {
    try {
        const { bloodGroup, urgency, status, hospitalId, recipientId } = req.query;

        const filter: Record<string, any> = {};
        if (bloodGroup) filter.bloodGroup = bloodGroup;
        if (urgency) filter.urgency = urgency;
        if (status) filter.status = status;
        if (hospitalId) filter.hospitalId = hospitalId;
        if (recipientId) filter.recipientId = recipientId;

        const bloodRequests = await BloodRequestModel.find(filter)
            .populate("hospitalId", "name address contactNo")
            .populate("recipientId", "patientName bloodGroup contactNo")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Blood requests fetched successfully",
            count: bloodRequests.length,
            data: bloodRequests,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching blood requests",
            error,
        });
    }
}

export async function getBloodRequestById(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const bloodRequest = await BloodRequestModel.findById(id)
            .populate("hospitalId", "name address contactNo")
            .populate("recipientId", "patientName bloodGroup contactNo");

        if (!bloodRequest) {
            return res.status(404).json({
                success: false,
                message: "Blood request not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blood request fetched successfully",
            data: bloodRequest,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching blood request",
            error,
        });
    }
}

export async function updateBloodRequest(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const {
            unitsRequired,
            urgency,
            reason,
            requiredDate,
            remarks,
        } = req.body;

        const updated = await BloodRequestModel.findByIdAndUpdate(
            { _id: id },
            {
                unitsRequired,
                urgency,
                reason,
                ...(requiredDate && { requiredDate: new Date(requiredDate) }),
                remarks,
            },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Blood request not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blood request updated successfully",
            data: updated,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating blood request",
            error,
        });
    }
}

export async function updateBloodRequestStatus(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;

        const updated = await BloodRequestModel.findByIdAndUpdate(
            id,
            { status, ...(remarks !== undefined && { remarks }) },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Blood request not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: `Blood request status updated to "${status}"`,
            data: updated,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating blood request status",
            error,
        });
    }
}

export async function deleteBloodRequest(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const deleted = await BloodRequestModel.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Blood request not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blood request deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting blood request",
            error,
        });
    }
}
