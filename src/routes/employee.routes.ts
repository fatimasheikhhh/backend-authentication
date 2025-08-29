import express, {type Router } from "express";
import { createNewEmployee, deleteEmployee, getAllEmployee, getEmployeeById, updateEmployee } from "../controllers/employee.controller.js";

const employeeRoutes: Router= express.Router();

employeeRoutes.get("/employees",getAllEmployee);
employeeRoutes.get("/employees/:id",getEmployeeById);
employeeRoutes.post("/employee/create",createNewEmployee);
employeeRoutes.put("/employee/update/:id",updateEmployee);
employeeRoutes.delete("/employees/:id",deleteEmployee);

export default employeeRoutes;
