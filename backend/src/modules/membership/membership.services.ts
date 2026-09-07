import { and, desc, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { members, membershipPlans, memberships } from "../../db/schema";
import { AssignMemberShipeInput } from "./membership.schema";
import { NotFoundError } from "../../lib/errors";

//helper functions
function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getRemainingDaysAndColor(endDate: string) {
  const today = new Date();
  const end = new Date(endDate);

  const diff = end.getTime() - today.setHours(0, 0, 0, 0);
  const remainingDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

  let color: "GREEN" | "YELLOW" | "RED";
  if (remainingDays > 15) color = "GREEN";
  else if (remainingDays >= 7) color = "YELLOW";
  else color = "RED";

  return { remainingDays, color };
}

export async function assignMembership(
  gymId: string,
  memberId: string,
  input: AssignMemberShipeInput,
) {
  const [member] = await db
    .select()
    .from(members)
    .where(and(eq(members.gymId, gymId), eq(members.id, memberId)));

  if (!member) throw new NotFoundError("Member not Found");

  const [existingActive] = await db
    .select()
    .from(memberships)
    .where(
      and(eq(memberships.memberId, memberId), eq(memberships.status, "ACTIVE")),
    );

  if (existingActive)
    throw new Error(
      "Member already has an active membership. Please renew instead.",
    );

  const [plan] = await db
    .select()
    .from(membershipPlans)
    .where(
      and(
        eq(membershipPlans.id, input.planId),
        eq(membershipPlans.gymId, gymId),
      ),
    );

  if (!plan) throw new NotFoundError("Membership plan not Found");

  const startDate = input.startDate ? new Date(input.startDate) : new Date();
  const endDate = addDays(startDate, plan.durationDays);

  const [membership] = await db
    .insert(memberships)
    .values({
      memberId,
      planId: plan.id,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      status: "ACTIVE",
    })
    .returning();

  return membership;
}

export async function renewMembership(
  gymId: string,
  memberId: string,
  input: AssignMemberShipeInput,
) {
  const [member] = await db
    .select()
    .from(members)
    .where(and(eq(members.id, memberId), eq(members.gymId, gymId)));

  if (!member) throw new NotFoundError("Member not found");

  const [plan] = await db
    .select()
    .from(membershipPlans)
    .where(
      and(
        eq(membershipPlans.id, input.planId),
        eq(membershipPlans.gymId, gymId),
      ),
    );

  if (!plan) throw new NotFoundError("Plan not found");

  const [currentMemberShip] = await db
    .select()
    .from(memberships)
    .where(
      and(eq(memberships.memberId, memberId), eq(memberships.status, "ACTIVE")),
    )
    .orderBy(desc(memberships.createdAt))
    .limit(1);

  let startDate: Date;

  if (currentMemberShip) {
    const currentEnd = new Date(currentMemberShip.endDate);
    const today = new Date();

    startDate = currentEnd > today ? currentEnd : today;

    await db
      .update(memberships)
      .set({ status: "EXPIRED" })
      .where(eq(memberships.id, currentMemberShip.id));
  } else {
    startDate = input.startDate ? new Date(input.startDate) : new Date();
  }
  const endDate = addDays(startDate, plan.durationDays);

  const [newMembership] = await db
    .insert(memberships)
    .values({
      memberId,
      planId: plan.id,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      status: "ACTIVE",
    })
    .returning();

  return newMembership;
}

export async function getMembershipHistory(gymId: string, memberId: string) {
  const [member] = await db
    .select()
    .from(members)
    .where(and(eq(members.gymId, gymId), eq(members.id, memberId)));

  if (!member) throw new NotFoundError("Member not Found");

  const history = await db
    .select()
    .from(memberships)
    .where(eq(memberships.memberId, memberId))
    .orderBy(desc(memberships.createdAt));

  return history.map((m, index) => {
    const isCurrent = index === 0;
    return {
      ...m,
      ...(isCurrent ? getRemainingDaysAndColor(m.endDate) : {}),
    };
  });
}

export async function getCurrentMembership(gymId: string, memberId: string) {
  const history = await getMembershipHistory(gymId, memberId);
  return history[0] ?? null;
}
