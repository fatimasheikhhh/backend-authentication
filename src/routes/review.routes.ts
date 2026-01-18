import { Router } from "express";
import {
  createReview,
  deleteReviewById,
  getAllReviews,
  getReviewById,
  updateReviewById,
} from "../controllers/review.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizedRole.js";
import { validate } from "../middleware/validate.js";
import {
  reviewSchemaValidation,
  updateReviewSchemaValidation,
} from "../utils/validation.js";

const reviewRouter = Router();

reviewRouter.post(
  "/create",
  protect,
  authorizeRoles("user"),
  validate(reviewSchemaValidation),
  createReview
);
reviewRouter.get("/all", protect, authorizeRoles("admin"), getAllReviews);
reviewRouter.get("/:id", protect, getReviewById);
reviewRouter.put(
  "/update/:id",
  protect,
  authorizeRoles("admin", "user"),
  validate(updateReviewSchemaValidation),
  updateReviewById
);

reviewRouter.delete(
  "/delete/:id",
  protect,
  authorizeRoles("admin", "user"),
  deleteReviewById
);

export default reviewRouter;
