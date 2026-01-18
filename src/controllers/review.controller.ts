import { Request, Response } from "express";
import {
  badRequestResponse,
  conflictResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/response.js";
import Review from "../models/reviewModal.js";
import Product from "../models/productModal.js";
import { Types } from "mongoose";
import { recalcProductRating } from "../utils/recalculateRating.js";

export async function createReview(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return notFoundResponse(res, "Invalid Product Id");
    }

    const productReviewExist = await Review.findOne({ userId, productId });
    if (productReviewExist) {
      return conflictResponse(res, "You have already reviewed this product");
    }

    const review = new Review({
      userId,
      productId,
      rating,
      comment,
    });

    await review.save();

    await recalcProductRating(productId);

    return successResponse(res, "Review created successfully");
  } catch (err: any) {
    console.log("Error occured while creating the review...", err.message);
    return serverErrorResponse(err, res);
  }
}

// getAll Reviews
export async function getAllReviews(req: Request, res: Response) {
  try {
    const { page = 1, limit = 5 } = req.query;
    const pageNum = parseInt(page as string);
    const limNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limNum;

    const [review, totalCount] = await Promise.all([
      Review.find().skip(skip).limit(limNum),
      Review.countDocuments(),
    ]);

    if (review.length === 0) {
      return notFoundResponse(res, "No reviews found");
    }

    return successResponse(res, "Reviews fetched successfully", {
      review,
      pagination: {
        currentPage: pageNum,
        limit: limNum,
        totalPages: Math.ceil(totalCount / limNum),
        totalItems: totalCount,
        hasNextPage: totalCount > pageNum * limNum,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (err: any) {
    console.log("Error occured while getting all reviews", err.message);
    return serverErrorResponse(err, res);
  }
}

// get Review by id
export async function getReviewById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return badRequestResponse(res, "Id is required");
    }

    if (!Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid Id");
    }

    const review = await Review.findById(id);

    if (!review) {
      return notFoundResponse(res, "Review Not Found");
    }

    return successResponse(res, "Review Fetched Successfully", review);
  } catch (err: any) {
    console.log("Error occured while getting review by id...", err.message);
    return serverErrorResponse(err, res);
  }
}

// update review by id
export async function updateReviewById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = (req as any).user._id;

    if (!id) {
      return badRequestResponse(res, "Id is required");
    }

    if (!Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid Id");
    }

    const review = await Review.findById(id);

    if (!review) {
      return notFoundResponse(res, "Review Not Found");
    }

    if (
      review.userId.toString() !== userId.toString() &&
      (req as any).user.role !== "admin"
    ) {
      return conflictResponse(res, "You can only update your own review");
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    await recalcProductRating(review.productId.toString());

    return successResponse(res, "Review Updated Successfully", review);
  } catch (err: any) {
    console.log("Error occured while updating review by id...", err.message);
    return serverErrorResponse(err, res);
  }
}

export async function deleteReviewById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;

    if (!id) {
      return badRequestResponse(res, "Id is required");
    }

    if (!Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid Id");
    }

    const review = await Review.findById(id);

    if (!review) {
      return notFoundResponse(res, "Review Not Found");
    }

    if (
      review.userId.toString() !== userId.toString() &&
      (req as any).user.role !== "admin"
    ) {
      return conflictResponse(res, "You can only delete your own review");
    }

    await review.deleteOne();

    await recalcProductRating(review.productId.toString());

    return successResponse(res, "Review Deleted Successfully");
  } catch (err: any) {
    console.log("Error occured while deleting review by id...", err.message);
    return serverErrorResponse(err, res);
  }
}
