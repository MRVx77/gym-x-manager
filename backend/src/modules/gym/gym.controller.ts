import { Request, Response } from "express";
import { createGymSchema, updateGymSchema } from "./gym.schema";
import { createGym, getMyGym, updateGym } from "./gym.services";

export async function createGymController(req: Request, res: Response) {
  const input = createGymSchema.parse(req.body);
  const result = await createGym(req.user!.userId, input);

  res.status(201).json(result);
}

export async function updateGymController(req: Request, res: Response) {
  const input = updateGymSchema.parse(req.body);
  const result = await updateGym(req.user!.gymId!, input);

  res.status(200).json(result);
}

export async function getMyGymController(req: Request, res: Response) {
  const gymId = req.user!.gymId!;
  const gym = await getMyGym(gymId);

  res.status(200).json({ gym });
}
