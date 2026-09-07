import z from "zod";

export const assignMembershipSchema = z.object({
  planId: z.uuid(),
  startDate: z.string().optional(),
});

export type AssignMemberShipeInput = z.infer<typeof assignMembershipSchema>;
