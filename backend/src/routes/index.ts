import { Router } from "express";
import authRouter from "./auth.routes";
import gymRouter from "./gym.routes";
import planRouter from "./plan.routes";
import trainerRouter from "./trainer.routes";
import memberRouter from "./member.routes";
import membershipRouter from "./membership.routes";
import { memberPaymentRouter, gymPaymentRouter } from "./payment.routes";
import { gymNotiRoutes, memberNotiRoutes } from "./notification";
import dashboardRouter from "./dashboard.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/gym", gymRouter);
apiRouter.use("/membership-plan", planRouter);
apiRouter.use("/trainer", trainerRouter);
apiRouter.use("/member", memberRouter);
apiRouter.use("/membership", membershipRouter);
apiRouter.use("/dashboard", dashboardRouter);

apiRouter.use("/members/:memberId/payments", memberPaymentRouter);

//gym-wide, not tied to one member
apiRouter.use("/payments", gymPaymentRouter);
apiRouter.use("/notifications", gymNotiRoutes);
apiRouter.use("/members/:memberId/notifications", memberNotiRoutes);

export default apiRouter;
