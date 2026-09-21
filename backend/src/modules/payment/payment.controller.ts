import { Request, Response } from "express";
import { createPaymentSchema } from "./payment.schema";
import {
  getGymPayments,
  getMemberPaymentHistory,
  getRevenueForMonth,
  recordPayment,
} from "./payment.services";

export async function recordPaymentHandler(
  req: Request<{ memberId: string }>,
  res: Response,
) {
  const input = createPaymentSchema.parse(req.body);
  const gymId = req.user!.gymId!;
  const memberId = req.params.memberId;
  const payment = await recordPayment(gymId, memberId, input);

  res.status(201).json({ message: "Payment recorded successfully", payment });
}

export async function getMemberPaymentHistoryHandler(
  req: Request<{ memberId: string }>,
  res: Response,
) {
  const memberId = req.params.memberId;
  const gymId = req.user!.gymId!;
  const payment = await getMemberPaymentHistory(gymId, memberId);
  res
    .status(200)
    .json({ message: "Payment history fetched successfully", payment });
}

export async function getGymPaymentsHandler(req: Request, res: Response) {
  const gymId = req.user!.gymId!;
  const { from, to } = req.query;

  const payments = await getGymPayments(
    gymId,
    from ? new Date(from as string) : undefined,
    to ? new Date(to as string) : undefined,
  );

  res.status(200).json({ message: "Payments fetched successfully", payments });
}

export async function getRevenueForMonthHandler(req: Request, res: Response) {
  const year = Number(req.query.year) || new Date().getFullYear();
  const month = Number(req.query.month) || new Date().getMonth() + 1;
  const gymId = req.user!.gymId!;

  const revenue = await getRevenueForMonth(gymId, year, month);
  res.status(200).json({ message: "Revenue fetched successfully", revenue });
}
