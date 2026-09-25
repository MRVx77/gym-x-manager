import { and, desc, eq, isNull, or } from "drizzle-orm";
import { db } from "../../db/db";
import { members, notifications } from "../../db/schema";
import { SendNotificationInput } from "./notification.schema";
import { NotFoundError } from "../../lib/errors";

export async function sendNotification(
  gymId: string,
  input: SendNotificationInput,
) {
  if (input.memberId) {
    const [member] = await db
      .select()
      .from(members)
      .where(and(eq(members.id, input.memberId), eq(members.gymId, gymId)));

    if (!member) {
      throw new NotFoundError("Member Not Found");
    }
  }

  const [notification] = await db
    .insert(notifications)
    .values({
      gymId,
      memberId: input.memberId,
      type: input.type,
      message: input.message,
    })
    .returning();

  return notification;
}

export async function getGymNotification(gymId: string) {
  return db.select().from(notifications).where(eq(notifications.gymId, gymId));
}

export async function getMemberNotification(gymId: string, memberId: string) {
  const [member] = await db
    .select()
    .from(members)
    .where(and(eq(members.id, memberId), eq(members.gymId, gymId)));

  if (!member) {
    throw new NotFoundError("Member Not Found");
  }

  return db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.gymId, gymId),
        or(
          eq(notifications.memberId, memberId),
          isNull(notifications.memberId),
        ),
      ),
    )
    .orderBy(desc(notifications.sentAt));
}
