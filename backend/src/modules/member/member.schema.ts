import z from "zod";

export const createMemberSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  emergencyContact: z.string().optional(),
  dateOfBirth: z.string().optional(),
  trainerId: z.uuid().optional(),
});

export const updateMemberSchema = createMemberSchema.partial();

export type CreateMemberSchema = z.infer<typeof createMemberSchema>;

export type UpdateMemberSchema = z.infer<typeof updateMemberSchema>;
