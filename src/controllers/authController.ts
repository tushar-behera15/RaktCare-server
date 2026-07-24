import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/email";
import { generateOtp, OtpHtml } from "../utils/otpGenerate";
import otpModel from "../models/Otp";
import DonorModel from "../models/DonorModel";
import HospitalModel from "../models/HospitalModel";
import { create } from "node:domain";

export async function signup(req: Request, res: Response) {
    try {
        const { fullName, email, phone, password, role, bloodGroup, gender, dateOfBirth, address, city, state, pincode, profileImage, isVerified } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" })
        }

        const existingPhone = await UserModel.findOne({ phone });

        if (existingPhone) {
            return res.status(409).json({
                success: false,
                message: "Phone number already exists.",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({
            fullName,
            email,
            phone,
            password: hashedPassword,
            role,
            bloodGroup,
            gender,
            dateOfBirth,
            address,
            city,
            state,
            pincode,
            profileImage,
            isVerified,

        });

        const otp = generateOtp();
        const html = OtpHtml(otp);
        const otpHash = await bcrypt.hash(otp, 10);

        await otpModel.create({
            email,
            user: newUser._id,
            otpHash
        })

        await sendEmail(email, "OTP Verification", "", html);

        const userObj = newUser.toObject();
        const { password: _, ...userWithoutPassword } = userObj;

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: userWithoutPassword
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error", error: err });
    }

}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "User doesn't exist" })
        }

        if (!user.isVerified) {
            return res.status(401).json({ success: false, message: "Email is not verified. Please verify your email first" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        const refreshToken = jwt.sign({
            userId: user._id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET!, { expiresIn: "7d" })


        // const session = await sessionModel.create({
        //     userId: user._id,
        //     refreshTokenHash,
        //     ip: req.ip,
        //     userAgent: req.headers["user-agent"]
        // })

        // const accessToken = jwt.sign({
        //     sessionId: session._id,
        //     userId: user._id,
        //     email: user.email,
        //     role: user.role
        // }, process.env.JWT_SECRET!, { expiresIn: "15m" })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            // token: accessToken,
            user: {
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            }
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error", error: err });
    }

}

export async function getMe(req: Request & { user?: { userId: string; email?: string; role?: string } }, res: Response) {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const decodedToken = jwt.decode(token) as { userId: string };
        const userId = decodedToken.userId;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user?.role == 'donor') {
            const donor = await DonorModel.findOne({ userId: user!._id });
            return res.status(200).json({
                success: true,
                message: "User fetched successfully",
                user: {
                    userId: user?._id,
                    email: user?.email,
                    role: user?.role,
                    fullName: user?.fullName,
                    phone: user?.phone,
                    bloodGroup: user?.bloodGroup,
                    gender: user?.gender,
                    dateOfBirth: user?.dateOfBirth,
                    address: user?.address,
                    createdAt: user?.createdAt
                },
                donor: {
                    weight: donor?.weight,
                    hemoglobin: donor?.hemoglobin,
                    diseases: donor?.diseases,
                    donationCount: donor?.donationCount,
                    isAvailableForDonation: donor?.isAvailableForDonation,
                    lastDonationDate: donor?.lastDonationDate
                }
            });
        }
        else if (user?.role == 'hospital') {
            const hospital = await HospitalModel.findOne({ userId: user!._id });
            return res.status(200).json({
                success: true,
                message: "User fetched successfully",
                user: {
                    userId: user?._id,
                    email: user?.email,
                    role: user?.role,
                    createdAt: user?.createdAt,
                },
                hospital: {
                    hospitalName: hospital?.hospitalName,
                    registrationNumber: hospital?.registrationNumber,
                    licenseNumber: hospital?.licenseNumber,
                    address: hospital?.address,
                    city: hospital?.city,
                    state: hospital?.state,
                    pincode: hospital?.pincode,
                    emergencyContact: hospital?.emergencyContact,
                    openingTime: hospital?.openingTime,
                    closingTime: hospital?.closingTime,
                    isVerified: hospital?.isVerified
                }
            });
        }
        else {
            return res.status(200).json({
                success: true,
                message: "User fetched successfully",
                user: {
                    userId: user._id,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                },

            });
        }


    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error", error: err });
    }
}

// export async function refreshToken(req: Request, res: Response) {
//     try {
//         const refreshToken = req.cookies.refreshToken;
//         if (!refreshToken) {
//             return res.status(401).json({ success: false, message: "Refresh token not found" });
//         }
//         const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET!) as { userId: string, email: string, role: string };

//         const sessions = await sessionModel.find({ userId: decodedToken.userId, revoked: false });
//         let session = null;
//         for (const s of sessions) {
//             const isValid = await bcrypt.compare(refreshToken, s.refreshTokenHash);
//             if (isValid) {
//                 session = s;
//                 break;
//             }
//         }

//         if (!session) {
//             return res.status(404).json({ success: false, message: "Session not found" });
//         }
//         const accessToken = jwt.sign({
//             email: decodedToken.email,
//             userId: decodedToken.userId,
//             role: decodedToken.role,


//         }, process.env.JWT_SECRET!, { expiresIn: "15m" })

//         const newrefreshToken = jwt.sign({
//             email: decodedToken.email,
//             userId: decodedToken.userId,
//             role: decodedToken.role,


//         }, process.env.JWT_SECRET!, { expiresIn: "7d" })

//         const newrefreshTokenHash = await bcrypt.hash(newrefreshToken, 10);
//         session.refreshTokenHash = newrefreshTokenHash;
//         await session.save();

//         res.cookie("refreshToken", newrefreshToken, {
//             httpOnly: true,
//             secure: true,
//             sameSite: "strict",
//             maxAge: 7 * 24 * 60 * 60 * 1000, //1 week
//         });


//         return res.status(200).json({
//             success: true,
//             message: "Access token refreshed successfully",
//             token: accessToken,
//         });
//     } catch (err) {
//         return res.status(500).json({ success: false, message: "Internal server error", error: err });
//     }
// }

// export async function logout(req: Request, res: Response) {
//     try {
//         const refreshToken = req.cookies.refreshToken;
//         if (!refreshToken) {
//             return res.status(401).json({ success: false, message: "Refresh token not found" });
//         }

//         const decodedToken = jwt.decode(refreshToken) as { userId: string } | null;
//         if (!decodedToken || !decodedToken.userId) {
//             return res.status(401).json({ success: false, message: "Invalid refresh token" });
//         }

//         const sessions = await sessionModel.find({ userId: decodedToken.userId, revoked: false });
//         let session = null;
//         for (const s of sessions) {
//             const isValid = await bcrypt.compare(refreshToken, s.refreshTokenHash);
//             if (isValid) {
//                 session = s;
//                 break;
//             }
//         }

//         if (!session) {
//             return res.status(404).json({ success: false, message: "Session not foundhhhh" });
//         }
//         session.revoked = true;
//         await session.save();
//         res.clearCookie("refreshToken");
//         return res.status(200).json({
//             success: true,
//             message: "User logged out successfully",
//         });
//     } catch (err) {
//         return res.status(500).json({ success: false, message: "Internal server error", error: err });
//     }
// }

export async function logout(req: Request, res: Response) {
    try {
        res.clearCookie("refreshToken", {
            maxAge: 0
        });
        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error", error: err });
    }
}

export async function verifyOtp(req: Request, res: Response) {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }

        const otpRecord = await otpModel.findOne({ email }).sort({ createdAt: -1 });
        if (!otpRecord) {
            return res.status(404).json({ success: false, message: "OTP not found or expired" });
        }

        const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
        if (!isValid) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        const user = await UserModel.findByIdAndUpdate(otpRecord.user, {
            isVerified: true,
        }, { new: true });

        await otpModel.deleteMany({ email });
        const refreshToken = jwt.sign({
            userId: user?._id,
            email: user?.email,
            role: user?.role
        }, process.env.JWT_SECRET!, { expiresIn: "7d" });


        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                fullName: user?.fullName,
                email: user?.email,
                role: user?.role,
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error", error: err });
    }
}
