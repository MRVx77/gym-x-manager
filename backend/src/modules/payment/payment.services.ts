import { and, eq, gte, lt, lte, sum } from "drizzle-orm";
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

export async function getMemberPaymentHistory(gymId: string, memberId: string) {
  const [member] = await db
    .select()
    .from(members)
    .where(and(eq(members.id, memberId), eq(members.gymId, gymId)));

  if (!member) {
    throw new NotFoundError("Member Not Found");
  }

  return db
    .select()
    .from(payments)
    .where(and(eq(payments.gymId, gymId), eq(payments.memberId, memberId)))
    .orderBy(payments.paidAt);
}

export async function getGymPayments(
  gymId: string,
  fromDate?: Date,
  toDate?: Date,
) {
  const conditions = [eq(payments.gymId, gymId)];

  if (fromDate) conditions.push(gte(payments.paidAt, fromDate));
  if (toDate) conditions.push(lte(payments.paidAt, toDate));

  return db
    .select()
    .from(payments)
    .where(and(...conditions))
    .orderBy(payments.paidAt);
}

export async function getRevenueForMonth(
  gymId: string,
  year: number,
  month: number,
) {
  // month is 1-indexed (1 = January) for readability at the call site
  const fromDate = new Date(year, month - 1, 1);
  const toDate = new Date(year, month, 1);

  const [result] = await db
    .select({ total: sum(payments.amount) })
    .from(payments)
    .where(
      and(
        eq(payments.gymId, gymId),
        gte(payments.paidAt, fromDate),
        lt(payments.paidAt, toDate),
      ),
    );

  return Number(result?.total ?? 0);
}
