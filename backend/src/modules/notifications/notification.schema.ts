import z from "zod";

export const sendNotificationSchema = z.object({
  memberId: z.uuid().optional(),
  type: z.enum(["EXPIRY_REMINDER", "HOLIDAY", "OFFER", "EVENT", "MAINTENANCE"]),
  message: z.string().min(3),
});

export type SendNotificationInput = z.infer<typeof sendNotificationSchema>;
