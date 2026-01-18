import { type Request, type Response } from "express";
import {
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/response.js";
import Order from "../models/orderModal.js";
import { Types } from "mongoose";

export async function createOrder(req: Request, res: Response) {
  try {
    const { userId, items, status, orderDate, deliveryDate, totalPrice } =
      req.body;

    if (!userId) {
      return badRequestResponse(res, "User Id is required");
    }

    if (!Array.isArray(items) || items.length === 0) {
      return badRequestResponse(res, "Atleast one item is required");
    }

    const order = new Order({
      userId,
      items,
      status,
      orderDate,
      deliveryDate,
      totalPrice,
    });

    await order.save();
    return successResponse(res, "Order created successfully");
  } catch (err: any) {
    console.log("Error occured while creating the order...", err.message);
    return serverErrorResponse(res, err);
  }
}

// get all orders

export async function getAllOrders(req: Request, res: Response) {
  try {
    const { status, orderDate } = req.query;
    const search = (req.query.search as string) || "";

    const { page = 1, limit = 5 } = req.query;
    const pageNum = parseInt(page as string);
    const limNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limNum;

    const filter: any = {};

    if (search) {
      filter.$or = [
        {
          "items.name": new RegExp(search, "i"),
        },
        {
          "items.description": new RegExp(search, "i"),
        },
      ].filter(Boolean);
    }

    if (status && typeof status === "string") {
      filter.status = status;
    }

    if (orderDate && typeof orderDate === "string") {
      filter.orderDate = orderDate;
    }

    const [order, totalCount] = await Promise.all([
      Order.find(filter).skip(skip).limit(limNum),
      Order.countDocuments(filter),
    ]);

    if (order.length === 0) {
      return notFoundResponse(res, "No orders found");
    }

    return successResponse(res, "Orders fetched successfully", {
      order,
      pagination: {
        currentPage: pageNum,
        limit: limNum,
        totalPages: Math.ceil(totalCount / limNum),
        totalItems: totalCount,
        hasNextPage: totalCount > pageNum * limNum,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (err: any) {
    console.log("error occured while getting all orders...", err.message);
    return serverErrorResponse(res, err);
  }
}

// get order by id
export async function getOrderById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return badRequestResponse(res, "Id is required");
    }

    if (!Types.ObjectId.isValid(id as string)) {
      return badRequestResponse(res, "Invalid Order Id");
    }

    const order = await Order.findById(id);

    if (!order) {
      return notFoundResponse(res, "Order not found");
    }

    return successResponse(res, "Order fetched successfully", order);
  } catch (err: any) {
    console.log("Error occured while fetching order by id...", err.message);
    return serverErrorResponse(res, err);
  }
}

// update order by id
export async function updateOrderById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { items, status, deliveryDate, totalPrice } = req.body;

    if (!id) {
      return badRequestResponse(res, "Id is required");
    }

    if (!Types.ObjectId.isValid(id as string)) {
      return badRequestResponse(res, "Invalid Order Id");
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: { items, status, deliveryDate, totalPrice } },
      { new: true }
    );

    if (!order) {
      return notFoundResponse(res, "Order not found");
    }

    return successResponse(res, "Order updated successfully");
  } catch (err: any) {
    console.log("Error occured while updating order...", err.message);
    return serverErrorResponse(res, err);
  }
}

// delete order by id
export async function deleteOrderById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return badRequestResponse(res, "Id is required");
    }

    if (!Types.ObjectId.isValid(id as string)) {
      return badRequestResponse(res, "Invalid Order Id");
    }

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return notFoundResponse(res, "Order not found");
    }

    return successResponse(res, "Order deleted successfully");
  } catch (err: any) {
    console.log("Error occured while deleting order...", err.message);
    return serverErrorResponse(res, err);
  }
}
