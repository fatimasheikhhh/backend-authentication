import { Response } from "express";

export const successResponse = <T>(
  res: Response,
  message: string,
  data?: T
) => {
  const payload: {
    success: boolean;
    message: string;
    data?: T;
  } = {
    success: true,
    message,
  };

  if (data !== undefined && data !== null) {
    payload.data = data;
  }

  return res.status(200).json(payload);
};

export const createResponse = (res: Response, message: string, data: {}) => {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
};

export const badRequestResponse = (res: Response, message: string) => {
  return res.status(400).json({
    success: false,
    message,
  });
};

export const unauthorizedResponse = (res: Response, message: string) => {
  return res.status(401).json({
    success: false,
    message,
  });
};

export const notFoundResponse = (res: Response, message: string) => {
  return res.status(404).json({
    success: false,
    message,
  });
};

export const conflictResponse = (res: Response, message: string) => {
  return res.status(409).json({
    success: false,
    message,
  });
};

export const serverErrorResponse = (res: Response, error: any) => {
  return res.status(500).json({
    success: false,
    message: "Server Error",
    error,
  });
};
