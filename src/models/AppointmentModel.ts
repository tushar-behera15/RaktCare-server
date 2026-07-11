import mongoose, { Document } from "mongoose";

export interface IAppointment extends Document {
  donorId: mongoose.Types.ObjectId;
  hospitalId: mongoose.Types.ObjectId;

  appointmentDate: Date;

  status:
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "cancelled";

  remarks?: string;
}

const appointmentSchema = new mongoose.Schema<IAppointment>(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "donors",
      required: true,
    },

    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hospitals",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const AppointmentModel = mongoose.model<IAppointment>(
  "appointments",
  appointmentSchema
);

export default AppointmentModel;
