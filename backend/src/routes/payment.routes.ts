import { Router } from "express";
import {
  getGymPaymentsHandler,
  getMemberPaymentHistoryHandler,
  getRevenueForMonthHandler,
  recordPaymentHandler,
} from "../modules/payment/payment.controller";
import { authenticate } from "../middleware/auth.middleware";
import { tenantMiddleware } from "../middleware/tenant.middleware";

export const memberPaymentRouter = Router({ mergeParams: true });

memberPaymentRouter.use(authenticate, tenantMiddleware);

memberPaymentRouter.post("/", recordPaymentHandler);
memberPaymentRouter.get("/", getMemberPaymentHistoryHandler);

export const gymPaymentRouter = Router();

gymPaymentRouter.use(authenticate, tenantMiddleware);

gymPaymentRouter.get("/", getGymPaymentsHandler);
gymPaymentRouter.get("/revenue", getRevenueForMonthHandler);
