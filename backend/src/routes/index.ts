import { Router } from "express";
import authRouter from "./auth.routes";
import gymRouter from "./gym.routes";
import planRouter from "./plan.routes";
import trainerRouter from "./trainer.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/gym", gymRouter);
apiRouter.use("/membership-plan", planRouter);
apiRouter.use("/trainer", trainerRouter);

export default apiRouter;
