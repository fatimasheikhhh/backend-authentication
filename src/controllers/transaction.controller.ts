import { type Request, type Response } from "express";
import Transaction from "../models/transactionModal.js";
import {
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/response.js";
import { Types } from "mongoose";

export async function createTransaction(req: Request, res: Response) {
  try {
    const {
      orderId,
      userId,
      amount,
      currency,
      status,
      paymentMethod,
      paymentDate,
    } = req.body;

    const transaction = new Transaction({
      orderId,
      userId,
      amount,
      currency,
      status,
      paymentMethod,
      paymentDate,
    });

    await transaction.save();

    return successResponse(res, "Transaction created successfully");
  } catch (err: any) {
    console.log("Error occured while creating the transaction...", err.message);
    return serverErrorResponse(res, err);
  }
}

// get all transactions
export async function getAllTransactions(req: Request, res: Response) {
  try {
    const { status } = req.query;

    const { page = 1, limit = 5 } = req.query;
    const pageNum = parseInt(page as string);
    const limNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limNum;

    const filter: any = {};

    if (status && typeof status === "string" && status !== "") {
      filter.status = status;
    }

    const [transactions, totalCount] = await Promise.all([
      Transaction.find(filter).skip(skip).limit(limNum),
      Transaction.countDocuments(filter),
    ]);

    if (transactions.length === 0) {
      return notFoundResponse(res, "No transactions found");
    }

    return successResponse(res, "Transactions fetched successfully", {
      transactions,
      pagination: {
        currentPage: pageNum,
        limit: limNum,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limNum),
        hasNextPage: totalCount > pageNum * limNum,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (err: any) {
    console.log("Error occured while getting all transactions...", err.message);
    return serverErrorResponse(res, err);
  }
}

// get transaction by id
export async function getTransactionById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return badRequestResponse(res, "Id is required");
    }

    if (!Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid Id");
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return notFoundResponse(res, `No transaction found with ID : ${id}`);
    }

    return successResponse(
      res,
      "Transaction fetched successfully",
      transaction
    );
  } catch (err: any) {
    console.log(
      "Error occured while getting transaction by id...",
      err.message
    );
    return serverErrorResponse(res, err);
  }
}

// update transaction by id
export async function updateTransactionById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return badRequestResponse(res, "Id is required");
    }

    if (!Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid Id");
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!transaction) {
      return notFoundResponse(res, `No transaction found with ID : ${id}`);
    }

    return successResponse(
      res,
      "Transaction updated successfully",
      transaction
    );
  } catch (err: any) {
    console.log(
      "Error occured while updating transaction by id...",
      err.message
    );
    return serverErrorResponse(res, err);
  }
}

export async function deleteTransactionById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return badRequestResponse(res, "Id is required");
    }

    if (!Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid Id");
    }

    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return notFoundResponse(res, `No transaction found with ID : ${id}`);
    }

    return successResponse(res, "Transaction deleted successfully");
  } catch (err: any) {
    console.log(
      "Error occured while deleting transaction by id...",
      err.message
    );
    return serverErrorResponse(res, err);
  }
}
