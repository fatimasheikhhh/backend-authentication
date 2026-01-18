import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "admin";
  otp?: string;
  otpExpiry?: Date;
  isEmailVerified: boolean;
  isOtpVerified: boolean;
}

// Employee Types

export interface IEmployee extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dob: Date;
}

export interface ICategory extends Document {
  name: string;
  image: string;
  description: string;
}

export interface IProduct extends Document {
  categoryId: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  discountPrice: number;
  rating: number;
  image: string;
  description: string;
}

// order types

export interface OrderItems {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  description: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  items: OrderItems[];
  status: OrderStatus;
  orderDate: Date;
  deliveryDate: Date;
  totalPrice: number;
}

// transaction types

export interface ITransaction extends Document {
  _id: Types.ObjectId;
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  paymentDate: Date;
}

export interface IReview extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  rating: number;
  comment: string;
}
export interface IMail {
  to: string;
  subject: string;
  text: string;
}
