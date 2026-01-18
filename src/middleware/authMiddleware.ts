import User from "../models/userModal.js";
import { unauthorizedResponse } from "../utils/response.js";
import jwt from "jsonwebtoken";
export async function protect(req: any, res: any, next: any) {
  if (!req.headers.authorization?.startsWith("Bearer")) {
    return unauthorizedResponse(res, "No authorized, please login first!");
  }

  const token = req.headers.authorization.split(" ")[1];
  console.log("recieved token: ", token);

  try {
    const decodedToken = (await jwt.verify(
      token,
      process.env.SECRET_KEY as string
    )) as { userId: string; role: string };
    console.log("decodedToken : ", decodedToken);

    const user = await User.findById(decodedToken.userId).select("-password");

    if (!user) {
      return unauthorizedResponse(res, "No authorized, please login first!");
    }

    (req as any).user = user;

    next();
  } catch (err) {
    return unauthorizedResponse(res, "No authorized, please login first!");
  }
}
