import z from "zod";

export const createTrainerSchema = z.object({
  name: z.string().min(2),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  profileImage: z.url().optional(),
  specialization: z.string().optional(),
  experienceYears: z.number().int().nonnegative().optional(),
  pricing: z.number().positive().optional(),
});

export const updateTrainerSchema = createTrainerSchema.partial();

export type CreateTrainerSchema = z.infer<typeof createTrainerSchema>;
export type UpdateTrainerSchema = z.infer<typeof updateTrainerSchema>;
