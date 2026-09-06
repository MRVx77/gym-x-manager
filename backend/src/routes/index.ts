import { Router } from "express";
import authRouter from "./auth.routes";
import gymRouter from "./gym.routes";
import planRouter from "./plan.routes";
import trainerRouter from "./trainer.routes";
import memberRouter from "./member.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/gym", gymRouter);
apiRouter.use("/membership-plan", planRouter);
apiRouter.use("/trainer", trainerRouter);
apiRouter.use("/member", memberRouter);

export default apiRouter;
