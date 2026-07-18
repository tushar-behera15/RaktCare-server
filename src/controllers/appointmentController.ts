import { Request, Response } from "express";
import AppointmentModel from "../models/AppointmentModel";
import DonorModel from "../models/DonorModel";
import UserModel from "../models/UserModel";
import BloodStockModel, { IBloodStock } from "../models/BloodStockModel";
import HospitalModel from "../models/HospitalModel";

export async function createAppointment(req: Request, res: Response) {
    try {
        const userId = (req as any).user.userId;

        const { hospitalId, appointmentDate, remarks } = req.body;

        const donor = await DonorModel.findOne({ userId });

        if (!donor) {
            return res.status(404).json({
                success: false,
                message: "Donor profile not found",
            });
        }

        if (donor.lastDonationDate) {

            const lastDonation = new Date(donor.lastDonationDate);

            const nextEligibleDate = new Date(lastDonation);
            nextEligibleDate.setDate(nextEligibleDate.getDate() + 90);

            if (new Date() < nextEligibleDate) {

                return res.status(400).json({
                    success: false,
                    message: `You are eligible to donate again after ${nextEligibleDate.toDateString()}.`,
                });

            }
        }

        const hospital = await HospitalModel.findById(hospitalId);

        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: "Hospital not found",
            });
        }

        const pendingAppointment = await AppointmentModel.findOne({
            donorId: donor._id,
            status: "pending",
        });

        if (pendingAppointment) {
            return res.status(409).json({
                success: false,
                message:
                    "You already have a pending appointment.",
            });
        }

        const selectedDate = new Date(appointmentDate);

        if (selectedDate <= new Date()) {
            return res.status(400).json({
                success: false,
                message:
                    "Appointment date must be in the future.",
            });
        }

        const appointment = await AppointmentModel.create({
            donorId: donor._id,
            hospitalId,
            appointmentDate: selectedDate,
            remarks,
            status: "pending",
        });

        return res.status(201).json({
            success: true,
            message: "Appointment booked successfully.",
            data: appointment,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message:
                "Internal server error while creating appointment.",
            error,
        });
    }
}

export async function getAllAppointments(req: Request, res: Response) {
    try {
        const userId = (req as any).user.userId;
        // const { status } = req.query;

        const hospital = await HospitalModel.findOne({ userId });

        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: "Hospital profile not found",
            });
        }



        // if (status) {
        //     filter.status = status;
        // }

        // Fetch appointments
        const appointments = await AppointmentModel.find({ hospitalId: hospital._id })
            .populate({
                path: "donorId",
                select:
                    "userId isAvailableForDonation lastDonationDate donationCount",
                populate: {
                    path: "userId",
                    select: "fullName email phone bloodGroup",
                },
            })
            .populate({
                path: "hospitalId",
                select: "name address contactNo",
            })
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

export async function getMyAppointments(req: Request, res: Response) {
    try {
        const userId = (req as any).user.userId;
        const { status } = req.query;

        const donor = await DonorModel.findOne({ userId });

        if (!donor) {
            return res.status(404).json({
                success: false,
                message: "Donor profile not found",
            });
        }

        const filter: Record<string, any> = {
            donorId: donor._id,
        };

        if (status) {
            filter.status = status;
        }

        const appointments = await AppointmentModel.find(filter)
            .populate({
                path: "hospitalId",
                select: "name address contactNo",
            })
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

