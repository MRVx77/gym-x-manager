import { Request, Response } from "express";
import {
  createMemeberShipPlanSchema,
  updateMembershipPlanSchema,
} from "./membershipPlan.schema";
import {
  createMembershipPlan,
  deletePlan,
  getAllPlans,
  getPlanById,
  updatePlan,
} from "./membershipPlan.services";

export async function createMembershipHandler(req: Request, res: Response) {
  const input = createMemeberShipPlanSchema.parse(req.body);
  const plan = await createMembershipPlan(req.user!.gymId!, input);

  res.status(201).json({ plan });
}

export async function getPlanByIdHandler(
  req: Request<{ planId: string }>,
  res: Response,
) {
  const { planId } = req.params;
  const plan = await getPlanById(req.user!.gymId!, planId);

  res.status(200).json({ plan });
}

export async function getAllPlansHandler(req: Request, res: Response) {
  const gymId = req.user!.gymId!;
  const plans = await getAllPlans(gymId);

  res.status(200).json({ plans });
}

export async function updatePlanHandler(
  req: Request<{ planId: string }>,
  res: Response,
) {
  const { planId } = req.params;
  const gymId = req.user!.gymId!;
  const input = updateMembershipPlanSchema.parse(req.body);

  const updatedPlan = await updatePlan(gymId, planId, input);

  res.status(200).json({ updatedPlan });
}

export async function deletePlanHandler(
  req: Request<{ planId: string }>,
  res: Response,
) {
  const { planId } = req.params;
  const gymId = req.user!.gymId!;

  const deletedPlan = await deletePlan(gymId, planId);

  res.status(204).json({ deletedPlan });
}
