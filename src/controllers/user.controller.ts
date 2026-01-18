import User from "../models/userModal.js";
import { type Request, type Response } from "express";
import { generateOTP } from "../utils/generateOtp.js";
import { sendMail } from "../services/mailService.js";
import {
  badRequestResponse,
  conflictResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "../utils/response.js";
import { setUserToken } from "../services/auth.js";
import { compare } from "bcrypt";

// Register User
export async function register(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return conflictResponse(res, "Email already exists");
    }

    const otp = await generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user = new User({
      firstName,
      lastName,
      email,
      password,
      otp,
      role,
      otpExpiry,
    });

    await user.save();

    await sendMail({
      to: email,
      subject: "Verify Your Account",
      text: `Your verification code is ${otp}`,
    });

    return successResponse(
      res,
      "Your account registered successful. Please  verify your email to continue"
    );
  } catch (err: any) {
    console.log("error in register :", err.message);
    return serverErrorResponse(res, err);
  }
}

export async function verifyOtp(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return notFoundResponse(res, "User not found");
    }

    const isOtpExpired = (user.otpExpiry?.getTime() ?? 0) < Date.now();

    if (user.otp !== otp) {
      return badRequestResponse(res, "Invalid OTP");
    }

    if (isOtpExpired) {
      return badRequestResponse(res, "OTP expired");
    }

    user.isEmailVerified = true;
    user.isOtpVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    return successResponse(res, "OTP verified successfully");
  } catch (err: any) {
    console.log("error in verify otp :", err.message);
    return serverErrorResponse(res, err);
  }
}

// Resend OTP
export async function resendOTP(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return unauthorizedResponse(res, "User not found");
    }

    if (user.isEmailVerified) {
      return conflictResponse(res, "Account already verified");
    }

    const otp = await generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    await sendMail({
      to: email,
      subject: "Verify Your Account ",
      text: `Your verification code is ${otp}`,
    });

    return successResponse(res, "OTP resent successfully to your email");
  } catch (err) {
    return serverErrorResponse(res, err);
  }
}
// Login User
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return unauthorizedResponse(res, "User not found");
    }

    if (!user.isEmailVerified) {
      const otp = await generateOTP();
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await user.save();

      await sendMail({
        to: email,
        subject: "Verify Your Account",
        text: `Your verification code is ${otp}`,
      });

      return unauthorizedResponse(
        res,
        "Please verify your account before logging in"
      );
    }

    const isMatchPassword = await compare(password, user.password);
    if (!isMatchPassword) {
      return unauthorizedResponse(res, "Invalid Credentials");
    }

    const token = await setUserToken(user._id, user.role);

    return successResponse(res, `Login successful for that email Token`, {
      token,
    });
  } catch (err) {
    return serverErrorResponse(res, err);
  }
}

// forget password
export async function forgetPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return unauthorizedResponse(res, "User not found");
    }

    const otp = await generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.isOtpVerified = false;
    user.isEmailVerified = false;

    await user.save();

    await sendMail({
      to: email,
      subject: "Reset Password",
      text: `Your OTP for resetting password is ${otp}`,
    });

    return successResponse(res, "OTP sent successfully for resetting password");
  } catch (err) {
    return serverErrorResponse(res, err);
  }
}

// verify Forget password OTP
export async function verifyForgetPasswordOTP(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return unauthorizedResponse(res, "User not found");
    }

    const isOtpExpired = (user.otpExpiry?.getTime() ?? 0) < Date.now();
    if (user.otp !== otp || isOtpExpired) {
      return badRequestResponse(res, "Invalid OTP");
    }

    user.isOtpVerified = true;

    await user.save();

    return successResponse(
      res,
      "Forget Password otp verified successfully for your email"
    );
  } catch (err) {
    return serverErrorResponse(res, err);
  }
}

// resend forget password otp
export async function resendForgetPasswordOtp(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return unauthorizedResponse(res, "User not found");
    }

    const otp = await generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const savedUser = await user.save();

    await sendMail({
      to: savedUser.email,
      subject: "Reset Password",
      text: `Your OTP for resetting password is ${otp}`,
    });

    return successResponse(res, "OTP resent successfully");
  } catch (err) {
    return serverErrorResponse(res, err);
  }
}

// set new password

export async function setNewPassword(req: Request, res: Response) {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return unauthorizedResponse(res, "User not found");
    }

    if (!user?.isEmailVerified) {
      return badRequestResponse(res, "Please verify your OTP");
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isOtpVerified = false;

    await user.save();

    return successResponse(res, "Password updated successfully");
  } catch (err) {
    return serverErrorResponse(res, err);
  }
}
