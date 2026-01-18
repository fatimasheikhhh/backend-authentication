import { type Request, type Response } from "express";
import {
  badRequestResponse,
  conflictResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/response.js";
import Category from "../models/categoryModal.js";
import { Types } from "mongoose";

// create category
export async function createNewCategory(req: Request, res: Response) {
  try {
    const { name, image, description } = req.body;

    const categoryExist = await Category.findOne({ name });

    if (categoryExist) {
      return conflictResponse(res, "Category already exists");
    }

    const category = new Category({ name, image, description });
    await category.save();

    return successResponse(res, "Category created successfully");
  } catch (err: any) {
    console.log(
      "Please check! Error occured while creating the category...",
      err.message
    );
    return serverErrorResponse(res, err);
  }
}

export async function getCategories(req: Request, res: Response) {
  try {
    const search = (req.query.search as string) || "";

    const filter =
      search && typeof search === "string" && search.trim()
        ? {
            $or: [
              { name: new RegExp(search, "i") },
              { description: new RegExp(search, "i") },
            ],
          }
        : {};

    const { page = 1, limit = 5 } = req.query;
    const pageNum = parseInt(page as string);
    const limNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limNum;

    const [category, totalCount] = await Promise.all([
      Category.find(filter).skip(skip).limit(limNum),
      Category.countDocuments(filter),
    ]);

    if (category.length === 0) {
      return notFoundResponse(res, "No categories found");
    }

    return successResponse(res, "Categories fetched successfully", {
      category,
      pagination: {
        currentPage: pageNum,
        limit: limNum,
        totalPages: Math.ceil(totalCount / limNum),
        totalCount,
        hasNextPage: totalCount > pageNum * limNum,
        hasPreviousPage: pageNum > 1,
      },
    });
  } catch (err) {
    return serverErrorResponse(res, err);
  }
}

// get Category by Id
export async function getCategoryById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return badRequestResponse(res, "Id is required");
    }

    if (!Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid Id");
    }

    const category = await Category.findById(id);

    if (!category) {
      return notFoundResponse(res, `No category found with ID : ${id}`);
    }

    return successResponse(res, "Category fetched successfully", category);
  } catch (err: any) {
    console.log(
      "Error occured while fetching the category by Id...",
      err.message
    );
    return serverErrorResponse(res, err);
  }
}

// update Category
export async function updateCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, image, description } = req.body;

    if (!id) {
      return badRequestResponse(res, "Id is required");
    }

    if (!Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid Id");
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { $set: { name, image, description } },
      { new: true }
    );

    if (!category) {
      return notFoundResponse(res, `No category found with ID : ${id}`);
    }
    return successResponse(res, "Category updated successfully", category);
  } catch (err: any) {
    console.log("Error occured while updating the category...", err.message);
    return serverErrorResponse(res, err);
  }
}

// delete Category
export async function deleteCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return badRequestResponse(res, "Id is required");
    }

    if (!Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid Id");
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return notFoundResponse(res, `No category found with ID : ${id}`);
    }
    return successResponse(res, "Category deleted successfully");
  } catch (err) {
    return serverErrorResponse(res, err);
  }
}
