import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createGymController,
  getMyGymController,
  updateGymController,
} from "../modules/gym/gym.controller";

const gymRouter = Router();

gymRouter.use(authenticate);

gymRouter.post("/create", createGymController);
gymRouter.put("/update", updateGymController);
gymRouter.get("/get-my-gym", getMyGymController);

export default gymRouter;
