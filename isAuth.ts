import pkg, { JwtPayload } from "jsonwebtoken";
import { AppError } from "./utils/AppError.js";
import { Request, Response, NextFunction } from "express";
const { verify } = pkg;


declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

const isAuth = (req: Request) => {
  const authorization = req.headers["authorization"];
  if (!authorization) throw new AppError("You need to login!", 401);

  const token = authorization.split(" ")[1];
  try {
    return verify(token, process.env.ACCESS_TOKEN_SECRET as string);
  } catch (err) {
    throw new AppError("Invalid or expired token. Please log in.", 401);
  }
};

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  req.user = isAuth(req);
  next();
};

export { isAuth, requireAuth };