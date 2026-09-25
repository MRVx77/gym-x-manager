import { Request, Response } from "express";
import { sendNotificationSchema } from "./notification.schema";
import {
  getGymNotification,
  getMemberNotification,
  sendNotification,
} from "./notification.services";

export async function sendNotificationHandler(req: Request, res: Response) {
  const input = sendNotificationSchema.parse(req.body);
  const gymId = req.user!.gymId!;

  const notification = await sendNotification(gymId, input);

  res.status(201).json({ notification });
}

export async function getGymNotificationHandler(req: Request, res: Response) {
  const gymId = req.user!.gymId!;

  const notifications = await getGymNotification(gymId);

  res.status(200).json({ notifications });
}

export async function getMemberNotificationHandler(
  req: Request<{ memberId: string }>,
  res: Response,
) {
  const memberId = req.params.memberId;
  const gymId = req.user!.gymId!;

  const notifications = await getMemberNotification(gymId, memberId);

  res.status(200).json({ notifications });
}
