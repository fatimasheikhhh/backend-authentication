import { Request, Response } from "express";
import Product from "../models/productModal.js";
import {
  badRequestResponse,
  conflictResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/response.js";
import Category from "../models/categoryModal.js";
import { Types } from "mongoose";

export async function createNewProduct(req: Request, res: Response) {
  try {
    const {
      categoryId,
      userId,
      name,
      quantity,
      price,
      discountPrice,
      rating,
      image,
      description,
    } = req.body;

    const productExist = await Product.findOne({ name });
    if (productExist) {
      return conflictResponse(res, "Product already exists");
    }

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return badRequestResponse(res, "Invalid categoryId");
    }

    const product = new Product({
      categoryId,
      userId,
      name,
      quantity,
      price,
      discountPrice,
      rating,
      image,
      description,
    });

    await product.save();

    return successResponse(res, "Product created successfully");
  } catch (err: any) {
    console.log("Error occured while creating the product...", err.message);
    return serverErrorResponse(res, err);
  }
}

export async function getAllProducts(req: Request, res: Response) {
  try {
    const { name, minPrice, maxPrice, quantity, rating } = req.query;
    const { page = 1, limit = 5 } = req.query;

    const pageNum = parseInt(page as string);
    const limNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limNum;

    const filter: any = {};
    if (name && typeof name === "string" && name.trim()) {
      filter.name = new RegExp(name, "i");
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    if (quantity) {
      filter.quantity = { $gte: Number(quantity) };
    }

    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    const [products, totalCount] = await Promise.all([
      Product.find(filter).skip(skip).limit(limNum),
      Product.countDocuments(filter),
    ]);

    if (products.length === 0) {
      return successResponse(res, "No products found");
    }

    return successResponse(res, "Products fetched successfully", {
      products,
      pagination: {
        currentPage: pageNum,
        limit: limNum,
        totalPages: Math.ceil(totalCount / limNum),
        totalCount,
        hasNextPage: totalCount > pageNum * limNum,
        hasPreviousPage: pageNum > 1,
      },
    });
  } catch (err: any) {
    console.log("Error occured while fetching all products...", err.message);
    return serverErrorResponse(res, err);
  }
}

// get product by id
export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return badRequestResponse(res, "Product Id is required");
    }

    if (!Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid Product Id");
    }

    const product = await Product.findById(id);

    if (!product) {
      return notFoundResponse(res, `No product found with ID : ${id}`);
    }

    return successResponse(res, "Product fetched successfully", product);
  } catch (err: any) {
    console.log("Error occured while fetching product by id...", err.message);
    return serverErrorResponse(res, err);
  }
}

// update existing product
export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, price, quantity, discountPrice, image, description } =
      req.body;

    if (!id) {
      return badRequestResponse(res, "Product Id is required");
    }

    if (!Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid Product Id");
    }

    const product = await Product.findById(id);

    if (!product) {
      return notFoundResponse(res, `No product found with ID : ${id}`);
    }

    if (
      product?.userId !== (req as any).user._id &&
      (req as any).user.role !== "admin"
    ) {
      return conflictResponse(res, "You can only update your own product");
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.quantity = quantity ?? product.quantity;
    product.discountPrice = discountPrice ?? product.discountPrice;
    product.image = image ?? product.image;
    product.description = description ?? product.description;

    await product.save();

    return successResponse(res, "Product updated successfully", product);
  } catch (err: any) {
    console.log("Error occured while updating product...", err.message);
    return serverErrorResponse(res, err);
  }
}

// delete product
export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return badRequestResponse(res, "Product Id is required");
    }

    if (!Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid Product Id");
    }

    const product = await Product.findById(id);

    if (!product) {
      return notFoundResponse(res, `No product found with ID : ${id}`);
    }

    if (
      product?.userId !== (req as any).user._id &&
      (req as any).user.role !== "admin"
    ) {
      return conflictResponse(res, "You can only delete your own product");
    }

    await product.deleteOne();

    return successResponse(res, "Product deleted successfully", product);
  } catch (err: any) {
    console.log("Error occured while deleting product...", err.message);
    return serverErrorResponse(res, err);
  }
}
