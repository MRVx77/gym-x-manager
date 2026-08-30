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

planRouter.post("/", authenticate, createMembershipHandler);
planRouter.get("/all", authenticate, getAllPlansHandler);
planRouter.get("/:planId", authenticate, getPlanByIdHandler);
planRouter.patch("/:planId", authenticate, updatePlanHandler);
planRouter.delete("/:planId", authenticate, deletePlanHandler);

export default planRouter;
