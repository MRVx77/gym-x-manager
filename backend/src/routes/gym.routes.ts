import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createGymController,
  getMyGymController,
  updateGymController,
} from "../modules/gym/gym.controller";

const gymRouter = Router();

gymRouter.post("/create", authenticate, createGymController);

gymRouter.put("/update", authenticate, updateGymController);

gymRouter.get("/get-my-gym", authenticate, getMyGymController);

export default gymRouter;
