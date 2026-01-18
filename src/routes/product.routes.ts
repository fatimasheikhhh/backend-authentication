import { Router } from "express";
import {
  createNewProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  productSchemaValidation,
  updateProductSchemaValidation,
} from "../utils/validation.js";
import { authorizeRoles } from "../middleware/authorizedRole.js";

const productRouter = Router();

productRouter.post(
  "/create",
  protect,
  authorizeRoles("admin", "user"),
  validate(productSchemaValidation),
  createNewProduct
);
productRouter.get("/all", protect, getAllProducts);
productRouter.get("/:id", protect, getProductById);
productRouter.put(
  "/update/:id",
  protect,
  authorizeRoles("admin", "user"),
  validate(updateProductSchemaValidation),
  updateProduct
);
productRouter.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "user"),
  deleteProduct
);

export default productRouter;
