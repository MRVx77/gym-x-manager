import { NextFunction, Request, Response } from "express";
import { JWTPayload, verifyToken } from "../lib/jwt";
import { UnauthorizedError } from "../lib/errors";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthorizedError("No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;

    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new UnauthorizedError("No permissions");
    }
    next();
  };
}
