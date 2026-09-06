import { Router } from "express";

import {
  createTrainerHandler,
  deleteTrainerHandler,
  getTrainerByIdHandler,
  getTrainersHandler,
  updateTrainerHandler,
  updateTrainerPhotoHandler,
} from "../modules/trainer/trainer.controller";
import { authenticate } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";

const trainerRouter = Router();

trainerRouter.use(authenticate);

trainerRouter.post("/", createTrainerHandler);
trainerRouter.get("/", getTrainersHandler);
trainerRouter.get("/:trainerId", getTrainerByIdHandler);
trainerRouter.patch("/:trainerId", updateTrainerHandler);
trainerRouter.patch(
  "/:trainerId/photo",
  upload.single("photo"),
  updateTrainerPhotoHandler,
);
trainerRouter.delete("/:trainerId", deleteTrainerHandler);

export default trainerRouter;
