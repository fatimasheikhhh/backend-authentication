import { Types } from "mongoose";
import Review from "../models/reviewModal.js";
import Product from "../models/productModal.js";

export async function recalcProductRating(productId: string) {
  const stats = await Review.aggregate([
    { $match: { productId: new Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$productId",
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  const avg = stats.length > 0 ? stats[0].avgRating : 0;
  await Product.findByIdAndUpdate(productId, { rating: avg });
}
