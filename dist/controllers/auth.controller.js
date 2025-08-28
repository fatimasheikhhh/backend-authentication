import User from "../model/authModel.js";
import nodemailer from "nodemailer";
import crypto from 'crypto';
// Email Transport setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "fatimaqaswar101@gmail.com",
        pass: "euzlcczskgtqnscb"
    }
});
// Generate OTP function
const generateOTP = () => crypto.randomInt(100000, 999999).toString();
export async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 60 * 1000); // OTP expires in one minute
        user = new User({ name, email, password, otp, otpExpiry });
        await user.save();
        await transporter.sendMail({
            from: "fatimaqaswar101@gmail.com",
            to: email,
            subject: "Verify your account",
            text: `Your verification code is ${otp}`
        });
        res.status(201).json({ message: "Registration successful. Check your email for the verification code." });
    }
    catch (err) {
        res.status(500).json({ message: "Error Registering user", err });
    }
}
//  verify OTP
export async function verifyOtp(req, res) {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or OTP" });
        }
        if (user.isVarified) {
            return res.status(400).json({ message: "Account already verified" });
        }
        const isOtpExpired = (user.otpExpiry?.getTime() ?? 0) < Date.now();
        if (user.otp !== otp || isOtpExpired) {
            return res.status(400).json({ message: "Invalid OTP or OTP expired" });
        }
        user.isVarified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        res.json({ message: "Verification successful" });
    }
    catch (err) {
        res.status(500).json({ message: "Error verifying OTP", err });
    }
}
// Resend OTP
export async function resendOTP(req, res) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (user.isVarified) {
            return res.status(400).json({ message: "Account already verified" });
        }
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 60 * 1000); // OTP expires in one minute
        await user.save();
        await transporter.sendMail({
            from: "fatimaqaswar101@gmail.com",
            to: email,
            subject: "Verify your account",
            text: `Your verification code is ${otp}`
        });
        res.json({ message: "OTP resent successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Error resending OTP", err });
    }
}
// Login User 
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        if (!user.isVarified) {
            return res.status(400).json({ message: "Please verify your account first" });
        }
        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // Ensure session is initialized before using it
        if (!req.session) {
            return res.status(500).json({ message: "Session not initialized" });
        }
        req.session.user = {
            _id: String(user._id),
            email: user.email,
            name: user.name,
        };
        res.json({ message: "Login successful" });
    }
    catch (err) {
        res.status(500).json({ message: "Error logging in", err });
    }
}
// logout User
export async function logout(req, res) {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
            }
            console.log("Session destroyed");
            res.json({ message: "Logout successful" });
        });
    }
    catch (err) {
        res.status(500).json({ message: "Error logging out", err });
    }
}
// Dashoard 
export async function dashboard(req, res) {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const userId = req.session.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Welcome to Dashboard", user: user.toObject() });
    }
    catch (err) {
        res.status(500).json({ message: "Error accessing dashboard", err });
    }
}
