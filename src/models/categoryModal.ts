import { model, Schema } from "mongoose";
import { ICategory } from "../types/index.js";

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Category = model<ICategory>("Category", categorySchema);
export default Category;
