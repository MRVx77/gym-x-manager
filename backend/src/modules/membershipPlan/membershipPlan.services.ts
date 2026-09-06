import { and, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { membershipPlans } from "../../db/schema";
import {
  CreateMemebershipPlan,
  UpdateMembershipPlan,
} from "./membershipPlan.schema";
import { NotFoundError } from "../../lib/errors";

export async function createMembershipPlan(
  gymId: string,
  input: CreateMemebershipPlan,
) {
  const [plan] = await db
    .insert(membershipPlans)
    .values({
      gymId: gymId,
      name: input.name,
      durationDays: input.durationDays,
      price: input.price.toString(),
    })
    .returning();

  return plan;
}

export async function getPlanById(gymId: string, planId: string) {
  const [plan] = await db
    .select()
    .from(membershipPlans)
    .where(
      and(eq(membershipPlans.id, planId), eq(membershipPlans.gymId, gymId)),
    );

  if (!plan) throw new NotFoundError("Plan not found");

  return plan;
}

export async function getAllPlans(gymId: string) {
  const plans = await db
    .select()
    .from(membershipPlans)
    .where(eq(membershipPlans.gymId, gymId));

  return plans;
}

export async function updatePlan(
  gymId: string,
  planId: string,
  input: UpdateMembershipPlan,
) {
  const [plan] = await db
    .update(membershipPlans)
    .set({
      ...input,
      price: input.price !== undefined ? input.price.toString() : undefined,
    })
    .where(
      and(eq(membershipPlans.id, planId), eq(membershipPlans.gymId, gymId)),
    )
    .returning();

  if (!plan) throw new NotFoundError("Plan not found");

  return plan;
}

export async function deletePlan(gymId: string, planId: string) {
  const [plan] = await db
    .delete(membershipPlans)
    .where(
      and(eq(membershipPlans.id, planId), eq(membershipPlans.gymId, gymId)),
    )
    .returning();

  if (!plan) throw new NotFoundError("Plan not found");

  return plan;
}
