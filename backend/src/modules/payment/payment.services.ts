import { and, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { members, memberships, payments } from "../../db/schema";
import { CreatePaymentInput } from "./payment.schema";
import { NotFoundError } from "../../lib/errors";

export async function recordPayment(
  gymId: string,
  memberId: string,
  input: CreatePaymentInput,
) {
  const [member] = await db
    .select()
    .from(members)
    .where(and(eq(members.id, memberId), eq(members.gymId, gymId)));

  if (!member) {
    throw new NotFoundError("Member Not Found");
  }

  if (input.membershipId) {
    const [membership] = await db
      .select()
      .from(memberships)
      .where(
        and(
          eq(memberships.id, input.membershipId),
          eq(memberships.memberId, memberId),
        ),
      );

    if (!membership) {
      throw new NotFoundError("Membership not Found");
    }
  }

  const [payment] = await db
    .insert(payments)
    .values({
      gymId,
      memberId,
      membershipId: input.membershipId,
      amount: input.amount.toString(),
    })
    .returning();

  return payment;
}
