import { model, Schema } from "mongoose";
import { IEmployee } from "../types/index.js";
import { compare, genSalt, hash } from "bcrypt";

const EmployeeSchema = new Schema<IEmployee>(
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
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
      unique: true,
    },
    dob: {
      type: Date,
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

EmployeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await genSalt(10);
    if (typeof this.password !== "string") {
      throw new Error("Password must be a string");
    }

    this.password = await hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

EmployeeSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return compare(candidatePassword, this.password);
};

const Employee = model<IEmployee>("Employee", EmployeeSchema);
export default Employee;
