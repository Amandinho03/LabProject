import pkg from "jsonwebtoken";
import { AppError } from "./utils/AppError.js";
const { verify } = pkg;

const isAuth = (req) => {
  const authorization = req.headers["authorization"];
  if (!authorization) throw new AppError("You need to login!", 401);

  const token = authorization.split(" ")[1];
  try {
    return verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new AppError("Invalid or expired token. Please log in.", 401);
  }
};

const requireAuth = (req, res, next) => {
  req.user = isAuth(req);
  next();
};

export { isAuth, requireAuth };
