import { Request, Response } from "express";
import { assignMembershipSchema } from "./membership.schema";
import {
  assignMembership,
  getCurrentMembership,
  getMembershipHistory,
  renewMembership,
} from "./membership.services";

export async function assignMembershipHandler(
  req: Request<{ memberId: string }>,
  res: Response,
) {
  const gymId = req.user!.gymId!;
  const memberId = req.params.memberId;
  const input = assignMembershipSchema.parse(req.body);

  const membership = await assignMembership(gymId, memberId, input);
  res.status(201).json({ membership });
}

export async function renewMembershipHandler(
  req: Request<{ memberId: string }>,
  res: Response,
) {
  const input = assignMembershipSchema.parse(req.body);
  const gymId = req.user!.gymId!;
  const memberId = req.params.memberId;
  const membership = await renewMembership(gymId, memberId, input);
  return res.status(200).json({ membership });
}

export async function getMembershipHistoryHandler(
  req: Request<{ memberId: string }>,
  res: Response,
) {
  const gymId = req.user!.gymId!;
  const memberId = req.params.memberId;

  const history = await getMembershipHistory(gymId, memberId);
  return res.status(200).json({ membershipHistory: history });
}

export async function getCurrentMembershipHandler(
  req: Request<{ memberId: string }>,
  res: Response,
) {
  const gymId = req.user!.gymId!;
  const memberId = req.params.memberId;

  const current = await getCurrentMembership(gymId, memberId);
  return res.status(200).json({ membership: current });
}
