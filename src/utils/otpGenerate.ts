export function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function OtpHtml(otp: string) {
    return (
        `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 40px 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <div style="background-color: #e53935; padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">Rakt Care</h1>
        </div>
        <div style="padding: 40px 30px;">
            <p style="color: #333333; font-size: 16px; margin-top: 0;">Dear User,</p>
            <p style="color: #555555; font-size: 15px; line-height: 1.6;">Thank you for registering with our Rakt Care. To complete your registration and secure your account, please verify your email address using the One-Time Password (OTP) below.</p>
            
            <div style="background-color: #fcf1f1; border: 1px dashed #e53935; border-radius: 6px; padding: 20px; text-align: center; margin: 30px 0;">
                <span style="display: block; color: #e53935; font-size: 14px; font-weight: 600; text-transform: uppercase; margin-bottom: 10px;">Your Verification Code</span>
                <span style="display: block; font-size: 36px; font-weight: 700; color: #333333; letter-spacing: 4px;">${otp}</span>
            </div>
            
            <p style="color: #555555; font-size: 14px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
                This code is valid for <strong>10 minutes</strong>. Please do not share it with anyone.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
            
            <p style="color: #777777; font-size: 13px; line-height: 1.5; margin-bottom: 0;">If you did not request this verification, please ignore this email.</p>
            <p style="color: #777777; font-size: 13px; line-height: 1.5; margin-top: 5px;">Need help? Contact us at <a href="mailto:support@raktcare.com" style="color: #e53935; text-decoration: none;">support@raktcare.com</a></p>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="color: #999999; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Rakt Care. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`
    );
}