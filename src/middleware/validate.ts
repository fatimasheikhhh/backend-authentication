import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { badRequestResponse } from "../utils/response.js";

export function validate(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    // agar error hai tu ik hi message me sub error show kr dy ga
    if (error) {
      return badRequestResponse(
        res,
        error.details.map((d) => d.message).join(", ")
      );
    }

    next();
  };
}
