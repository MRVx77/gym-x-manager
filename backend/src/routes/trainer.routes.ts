import { Router } from "express";

import {
  createTrainerHandler,
  deleteTrainerHandler,
  getTrainerByIdHandler,
  getTrainersHandler,
  updateTrainerHandler,
} from "../modules/trainer/trainer.controller";
import { authenticate } from "../middleware/auth.middleware";

const trainerRouter = Router();

trainerRouter.use(authenticate);

trainerRouter.post("/", createTrainerHandler);
trainerRouter.get("/", getTrainersHandler);
trainerRouter.get("/:trainerId", getTrainerByIdHandler);
trainerRouter.patch("/:trainerId", updateTrainerHandler);
trainerRouter.delete("/:trainerId", deleteTrainerHandler);

export default trainerRouter;
