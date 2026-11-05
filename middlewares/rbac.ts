import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ROLE_PERMISSIONS, Permission } from "../config/permissions.js";
import { AppError } from "../utils/AppError.js";

interface AuthPayload extends JwtPayload {
  username: string;
  role: string;
}

export const requirePermission = (requiredPermission: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as AuthPayload;
    const userRole = user?.role; 
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    if (!userPermissions.includes(requiredPermission)) {
      throw new AppError("Forbidden! You lack the required permissions.", 403);
    }
    
    next();
  };
};