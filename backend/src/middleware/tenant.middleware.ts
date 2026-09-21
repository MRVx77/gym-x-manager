import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../lib/errors";

export function tenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.user!.role === "SUPER_ADMIN") {
    return next(); // not scoped to a single gym — allowed through without gymId
  }

  if (!req.user!.gymId) {
    throw new ForbiddenError(
      "Onboarding incomplete — please finish setting up your gym",
    );
  }

  next();
}
