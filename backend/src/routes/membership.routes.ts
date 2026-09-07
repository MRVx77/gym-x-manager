import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  assignMembershipHandler,
  getCurrentMembershipHandler,
  getMembershipHistoryHandler,
  renewMembershipHandler,
} from "../modules/membership/membership.controller";

const membershipRouter = Router();

membershipRouter.use(authenticate);

membershipRouter.post("/:memberId/assign", assignMembershipHandler);
membershipRouter.post("/:memberId/renew", renewMembershipHandler);
membershipRouter.get("/:memberId/history", getMembershipHistoryHandler);
membershipRouter.get("/:memberId/current", getCurrentMembershipHandler);

export default membershipRouter;
