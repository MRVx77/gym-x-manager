import { Router } from "express";
import authRouter from "./auth.routes";
import gymRouter from "./gym.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/gym", gymRouter);

export default apiRouter;
