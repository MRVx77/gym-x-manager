import z from "zod";

export const createPaymentSchema = z.object({
  amount: z.number().positive(),
  membershipId: z.uuid().optional(), // can be membership or not membership fee, that's why optional
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
