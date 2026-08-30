import { Router } from "express";
import authRouter from "./auth.routes";
import gymRouter from "./gym.routes";
import planRouter from "./plan.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/gym", gymRouter);
apiRouter.use("/membership-plan", planRouter);

export default apiRouter;
