import { model, Schema } from "mongoose";
import { IUser } from "../types/index.js";
import { compare, genSalt, hash } from "bcrypt";

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// password hash before sending to the database and make sure that it will not be saved as plain text
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await genSalt(10);
    if (typeof this.password !== "string") {
      throw new Error("Password is undefined or not a string");
    }

    this.password = await hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// compare passowrd to hash password for checking purpose is it correct or not
userSchema.methods.comparePassword = async function (
  userPassowrd: string
): Promise<boolean> {
  return compare(userPassowrd, this.password);
};

const User = model<IUser>("User", userSchema);

export default User;
