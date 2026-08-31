import { Router } from "express";
import {
  createMembershipHandler,
  getPlanByIdHandler,
  updatePlanHandler,
  deletePlanHandler,
  getAllPlansHandler,
} from "../modules/membership/membership.controller";
import { authenticate } from "../middleware/auth.middleware";

const planRouter = Router();

planRouter.use(authenticate);

planRouter.post("/", createMembershipHandler);
planRouter.get("/all", getAllPlansHandler);
planRouter.get("/:planId", getPlanByIdHandler);
planRouter.patch("/:planId", updatePlanHandler);
planRouter.delete("/:planId", deletePlanHandler);

export default planRouter;
