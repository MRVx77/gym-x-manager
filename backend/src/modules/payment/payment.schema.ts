import z from "zod";

export const createPaymentSchema = z.object({
  amount: z.number().positive(),
  membershipId: z.uuid().optional(), //can be mebership or not mebership fee thats why optinal
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
