import { Router } from "express";
import {
  createNewCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.contoller.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { categorySchemaValidation } from "../utils/validation.js";
import { authorizeRoles } from "../middleware/authorizedRole.js";

const categoryRouter = Router();

categoryRouter.post(
  "/create",
  protect,
  authorizeRoles("admin"),
  validate(categorySchemaValidation),
  createNewCategory
);
categoryRouter.get("/all", protect, getCategories);
categoryRouter.get("/:id", protect, getCategoryById);
categoryRouter.put(
  "/update/:id",
  protect,
  authorizeRoles("admin"),
  validate(categorySchemaValidation),
  updateCategory
);
categoryRouter.delete("/:id", protect, authorizeRoles("admin"), deleteCategory);
export default categoryRouter;
