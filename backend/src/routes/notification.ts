import { Router } from "express";
import {
  getGymNotificationHandler,
  getMemberNotificationHandler,
  sendNotificationHandler,
} from "../modules/notifications/notification.controller";
import { authenticate } from "../middleware/auth.middleware";
import { tenantMiddleware } from "../middleware/tenant.middleware";

// Gym-wide — sending (broadcast or targeted via body) and listing everything sent
export const gymNotiRoutes = Router();

gymNotiRoutes.use(authenticate, tenantMiddleware);
gymNotiRoutes.post("/", sendNotificationHandler);
gymNotiRoutes.get("/", getGymNotificationHandler);

// Member-scoped — what a specific member has received (targeted + broadcasts)
export const memberNotiRoutes = Router();
memberNotiRoutes.use(authenticate, tenantMiddleware);
memberNotiRoutes.get("/", getMemberNotificationHandler);
