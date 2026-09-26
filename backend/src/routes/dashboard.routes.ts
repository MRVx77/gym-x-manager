import { Router } from "express";
import { getDashboardSummaryHandler } from "../modules/dashboard/dashboard.controller";
import { authenticate } from "../middleware/auth.middleware";

const dashboardRouter = Router();

dashboardRouter.use(authenticate);
dashboardRouter.get("/", getDashboardSummaryHandler);

export default dashboardRouter;
