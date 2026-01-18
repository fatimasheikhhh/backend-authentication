import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTransaction,
  deleteTransactionById,
  getAllTransactions,
  getTransactionById,
  updateTransactionById,
} from "../controllers/transaction.controller.js";
import { validate } from "../middleware/validate.js";
import {
  transactionSchemaValidation,
  updateTransactionSchemaValidation,
} from "../utils/validation.js";
import { authorizeRoles } from "../middleware/authorizedRole.js";

const transactionRouter = Router();

transactionRouter.post(
  "/create",
  protect,
  authorizeRoles("user"),
  validate(transactionSchemaValidation),
  createTransaction
);
transactionRouter.get(
  "/all",
  protect,
  authorizeRoles("admin"),
  getAllTransactions
);
transactionRouter.get(
  "/:id",
  protect,
  authorizeRoles("user"),
  getTransactionById
);
transactionRouter.put(
  "/update/:id",
  protect,
  authorizeRoles("admin"),
  validate(updateTransactionSchemaValidation),
  updateTransactionById
);
transactionRouter.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteTransactionById
);
export default transactionRouter;
