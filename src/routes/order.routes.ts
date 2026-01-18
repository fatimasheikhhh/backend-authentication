import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createOrder,
  deleteOrderById,
  getAllOrders,
  getOrderById,
  updateOrderById,
} from "../controllers/order.controller.js";
import { validate } from "../middleware/validate.js";
import {
  orderSchemaValidation,
  updateOrderSchemaValidation,
} from "../utils/validation.js";
import { authorizeRoles } from "../middleware/authorizedRole.js";

const orderRouter = Router();

orderRouter.post(
  "/create",
  protect,
  authorizeRoles("user"),
  validate(orderSchemaValidation),
  createOrder
);
orderRouter.get("/all", protect, authorizeRoles("admin"), getAllOrders);
orderRouter.get("/:id", protect, getOrderById);
orderRouter.put(
  "/update/:id",
  protect,
  authorizeRoles("admin"),
  validate(updateOrderSchemaValidation),
  updateOrderById
);

orderRouter.delete("/delete/:id", protect, deleteOrderById);

export default orderRouter;
