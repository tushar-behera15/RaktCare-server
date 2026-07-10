import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_APP_PASS
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.error("Error connecting to email server", error);
    }
    else {
        console.log("Email server is ready to send emails", success);
    }
});

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
    try {
        await transporter.sendMail({
            from: `"Blood Management System" <${process.env.GOOGLE_USER}>`,
            to,
            subject,
            text,
            html
        });
    } catch (err) {
        console.error("Error sending email:", err);
        throw err;
    }
}