import { Request, Response } from "express";
import { createTrainerSchema, updateTrainerSchema } from "./trainer.schema";
import {
  createTrainer,
  deleteTrainer,
  getTrainerById,
  getTrainers,
  updateTrainer,
  updateTrainerPhoto,
} from "./trainer.services";
import { uploadToCloudinary } from "../../lib/cloudinary";

export async function createTrainerHandler(req: Request, res: Response) {
  const input = createTrainerSchema.parse(req.body);
  const trainer = await createTrainer(req.user!.gymId!, input);
  res.status(201).json({ trainer });
}

export async function getTrainersHandler(req: Request, res: Response) {
  const trainers = await getTrainers(req.user!.gymId!);
  res.status(200).json({ trainers });
}

export async function getTrainerByIdHandler(
  req: Request<{ trainerId: string }>,
  res: Response,
) {
  const trainer = await getTrainerById(req.user!.gymId!, req.params.trainerId);
  res.status(200).json({ trainer });
}

export async function updateTrainerHandler(
  req: Request<{ trainerId: string }>,
  res: Response,
) {
  const input = updateTrainerSchema.parse(req.body);
  const trainer = await updateTrainer(
    req.user!.gymId!,
    req.params.trainerId!,
    input,
  );
  res.status(200).json({ trainer });
}

export async function updateTrainerPhotoHandler(
  req: Request<{ trainerId: string }>,
  res: Response,
) {
  if (!req.file) return res.status(400).json({ message: "no file was given" });

  const gymId = req.user!.gymId!;
  const trainerId = req.params.trainerId;

  const result = await uploadToCloudinary(
    req.file.buffer,
    "gym-manager/trainers",
  );

  const trainer = await updateTrainerPhoto(gymId, trainerId, result.secure_url);

  res.status(200).json({ trainer });
}

export async function deleteTrainerHandler(
  req: Request<{ trainerId: string }>,
  res: Response,
) {
  const trainer = await deleteTrainer(req.user!.gymId!, req.params.trainerId!);
  res.status(200).json({ trainer });
}
