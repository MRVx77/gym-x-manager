import { Request, Response } from "express";
import { getDashboardSummary } from "./dashboard.services";

export async function getDashboardSummaryHandler(req: Request, res: Response) {
  const summary = await getDashboardSummary(req.user?.gymId!);
  res.status(200).json(summary);
}
