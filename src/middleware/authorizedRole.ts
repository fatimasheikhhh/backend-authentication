import { unauthorizedResponse } from "../utils/response.js";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!allowedRoles.includes(req.user.role)) {
      return unauthorizedResponse(res, "Access denied");
    }
    next();
  };
};
