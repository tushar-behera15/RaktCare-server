import { Request, Response } from "express";
import AppointmentModel from "../models/AppointmentModel";
import DonorModel from "../models/DonorModel";
import UserModel from "../models/UserModel";
import BloodStockModel, { IBloodStock } from "../models/BloodStockModel";

export async function createAppointment(req: Request, res: Response) {
    try {
        const { donorId, hospitalId, appointmentDate, remarks } = req.body;

        const pendingExists = await AppointmentModel.findOne({
            donorId,
            status: "pending",
        });

        if (pendingExists) {
            return res.status(409).json({
                success: false,
                message: "Donor already has a pending appointment. Please wait for it to be resolved before booking another.",
            });
        }


        if (new Date(appointmentDate) <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Appointment date must be in the future",
            });
        }

        const appointment = await AppointmentModel.create({
            donorId,
            hospitalId,
            appointmentDate: new Date(appointmentDate),
            remarks,
        });

        return res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            data: appointment,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while creating appointment",
            error,
        });
    }
}

export async function getAllAppointments(req: Request, res: Response) {
    try {
        const { status, donorId, hospitalId } = req.query;

        const filter: Record<string, any> = {};
        if (status) filter.status = status;
        if (donorId) filter.donorId = donorId;
        if (hospitalId) filter.hospitalId = hospitalId;

        const appointments = await AppointmentModel.find(filter)
            .populate("donorId", "userId isAvailableForDonation lastDonationDate donationCount")
            .populate("hospitalId", "name address contactNo")
            .sort({ appointmentDate: 1 });

        return res.status(200).json({
            success: true,
            message: "Appointments fetched successfully",
            count: appointments.length,
            data: appointments,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching appointments",
            error,
        });
    }
}

export async function getAppointmentById(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const appointment = await AppointmentModel.findById(id)
            .populate("donorId", "userId isAvailableForDonation lastDonationDate donationCount")
            .populate("hospitalId", "name address contactNo");

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Appointment fetched successfully",
            data: appointment,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching appointment",
            error,
        });
    }
}

export async function updateAppointment(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { appointmentDate, remarks } = req.body;

        const existing = await AppointmentModel.findById(id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        if (existing.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: `Cannot reschedule an appointment that is already "${existing.status}"`,
            });
        }

        const updated = await AppointmentModel.findByIdAndUpdate(
            id,
            {
                ...(appointmentDate && { appointmentDate: new Date(appointmentDate) }),
                ...(remarks !== undefined && { remarks }),
            },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Appointment updated successfully",
            data: updated,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating appointment",
            error,
        });
    }
}

export async function updateAppointmentStatus(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;

        const appointment = await AppointmentModel.findById(id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        const requestingHospitalId = (req as any).user?.hospitalId;
        if (
            requestingHospitalId &&
            appointment.hospitalId.toString() !== requestingHospitalId.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorised to update this appointment",
            });
        }

        appointment.status = status;
        if (remarks !== undefined) appointment.remarks = remarks;
        await appointment.save();

        if (status === "completed") {
            const donor = await DonorModel.findById(appointment.donorId);

            if (donor) {
                donor.lastDonationDate = new Date();
                donor.donationCount = (donor.donationCount ?? 0) + 1;
                donor.isAvailableForDonation = false;
                await donor.save();

                const donorUser = await UserModel.findById(donor.userId);
                if (donorUser?.bloodGroup) {
                    await BloodStockModel.findOneAndUpdate(
                        {
                            hospitalId: appointment.hospitalId,
                            bloodGroup: donorUser.bloodGroup as IBloodStock["bloodGroup"],
                        },
                        {
                            $inc: {
                                availableUnits: 1,
                                totalUnits: 1,
                            },
                            $set: {
                                lastUpdated: new Date(),
                            },
                        },
                        {
                            new: true,
                            upsert: true,
                            runValidators: true,
                        }
                    );
                }
            }
        }

        return res.status(200).json({
            success: true,
            message: `Appointment status updated to "${status}"`,
            data: appointment,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating appointment status",
            error,
        });
    }
}

export async function deleteAppointment(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const appointment = await AppointmentModel.findById(id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        // Prevent deleting an already-Completed appointment (audit trail)
        if (appointment.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "Completed appointments cannot be deleted",
            });
        }

        await AppointmentModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Appointment deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting appointment",
            error,
        });
    }
}
