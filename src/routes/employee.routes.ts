import { Router } from "express";
import {
  createNewEmployee,
  deleteEmployee,
  getAllEmployee,
  getEmployeeById,
  updateEmployee,
} from "../controllers/employee.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { employeeSchema, updateEmployeeSchema } from "../utils/validation.js";

const employeeRouter = Router();

employeeRouter.post(
  "/create",
  protect,
  validate(employeeSchema),
  createNewEmployee
);
employeeRouter.get("/", protect, getAllEmployee);
employeeRouter.get("/:id", protect, getEmployeeById);
employeeRouter.put(
  "/update/:id",
  protect,
  validate(updateEmployeeSchema),
  updateEmployee
);
employeeRouter.delete("/:id", protect, deleteEmployee);

export default employeeRouter;
