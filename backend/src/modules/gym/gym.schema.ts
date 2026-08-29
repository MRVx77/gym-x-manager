import z from "zod";

export const createGymSchema = z.object({
  name: z.string().min(2, "Gym name must be at least 2 charters"),
});

export const updateGymSchema = z.object({
  location: z.string().min(3),
  images: z.array(z.string().url()).max(7).optional().default([]),
});

export type CreateGymInput = z.infer<typeof createGymSchema>;
export type UpdateGymInput = z.infer<typeof updateGymSchema>;
