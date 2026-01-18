// token creation
import Jwt from "jsonwebtoken";
import { Types } from "mongoose";
export function setUserToken(userId: Types.ObjectId, role: string) {
  return Jwt.sign(
    {
      userId: userId,
      role: role,
    },
    process.env.SECRET_KEY as string
  );
}

export function getUserToken(token: string): string | Jwt.JwtPayload {
  if (!token) throw new Error("Invalid Token");
  try {
    return Jwt.verify(token, process.env.SECRET_KEY as string);
  } catch (err) {
    throw new Error("Invalid Token");
  }
}
