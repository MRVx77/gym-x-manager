import z from "zod";

export const createMemeberShipPlanSchema = z.object({
  name: z.string().min(2),
  durationDays: z.number().int().positive(),
  price: z.number().positive(),
});

export const updateMembershipPlanSchema = createMemeberShipPlanSchema.partial();

export type CreateMemebershipPlan = z.infer<typeof createMemeberShipPlanSchema>;
export type UpdateMembershipPlan = z.infer<typeof updateMembershipPlanSchema>;
