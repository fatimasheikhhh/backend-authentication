import { type Request, type Response } from "express";
import Employee from "../models/employeeModal.js";
import {
  badRequestResponse,
  conflictResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/response.js";
import { Types } from "mongoose";

export async function createNewEmployee(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, password, phone, dob } = req.body;

    const employeeExist = await Employee.findOne({ email });

    if (employeeExist) {
      return conflictResponse(res, "Employee already exist for that email");
    }

    const employee = new Employee({
      firstName,
      lastName,
      email,
      password,
      phone,
      dob,
    });

    await employee.save();

    return successResponse(res, "Employee created successfully");
  } catch (err: any) {
    console.log(
      "Please check! error occurred while creating the employee. Details: ",
      err.message
    );
    return serverErrorResponse(res, err);
  }
}
// get all employee
export async function getAllEmployee(req: Request, res: Response) {
  try {
    const search = (req.query.search as string) || "";
    const filter =
      search && typeof search === "string" && search.trim()
        ? {
            $or: [
              { firstName: new RegExp(search, "i") },
              { email: new RegExp(search, "i") },
            ],
          }
        : {};

    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page as string);

    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [employees, totalCount] = await Promise.all([
      Employee.find(filter).skip(skip).limit(limitNum),
      Employee.countDocuments(filter),
    ]);

    if (employees.length === 0) {
      return notFoundResponse(res, "No employee found");
    }

    return successResponse(res, "Employees fetched successfully", {
      employees,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
        hasNextPage: totalCount > pageNum * limitNum,
        hasPreviousPage: pageNum > 1,
      },
    });
  } catch (err: any) {
    console.log(
      "Please check! error occurred while fetching the employee. Details: ",
      err.message
    );
    return serverErrorResponse(res, err);
  }
}

// get employee by id
export async function getEmployeeById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return badRequestResponse(res, "Employee Id is required");
    }

    if (!Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid Employee Id");
    }

    const employees = await Employee.findById(id);

    if (!employees) {
      return notFoundResponse(res, `No employee found with ID : ${id}`);
    }

    return successResponse(res, "Employee fetched successfully", employees);
  } catch (err: any) {
    console.log(
      "Please check! error occurred while fetching the employee by id. Details: ",
      err.message
    );
    return serverErrorResponse(res, err);
  }
}

// update employee
export async function updateEmployee(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const { firstName, lastName, phone } = req.body;

    if (!id) {
      return badRequestResponse(res, "Employee Id is required");
    }

    if (!Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid Employee Id");
    }

    const employee = await Employee.findByIdAndUpdate(
      id,
      { $set: { firstName, lastName, phone } },
      { new: true }
    );

    if (!employee) {
      return notFoundResponse(res, `No employee found with ID : ${id}`);
    }

    return successResponse(res, "Employee updated successfully", employee);
  } catch (err: any) {
    console.log(
      "Please check! error occurred while updating the employee. Details: ",
      err.message
    );
    return serverErrorResponse(res, err);
  }
}

// delete employee
export async function deleteEmployee(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return badRequestResponse(res, "Employee Id is required");
    }

    if (!Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid Employee Id");
    }

    const employee = await Employee.findByIdAndDelete({ _id: id });

    if (!employee) {
      return notFoundResponse(res, `No employee found with ID : ${id}`);
    }

    return successResponse(res, "Employee deleted successfully", employee);
  } catch (err: any) {
    console.log(
      "Please check! error occurred while deleting the employee. Details: ",
      err.message
    );
    return serverErrorResponse(res, err);
  }
}
