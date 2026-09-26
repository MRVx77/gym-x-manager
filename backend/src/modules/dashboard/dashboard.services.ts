import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "../../db/db";
import { members, memberships } from "../../db/schema";
import { getRevenueForMonth } from "../payment/payment.services";

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfNextMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

export async function getDashboardSummary(gymId: string) {
  const now = new Date();
  const in7days = new Date();
  in7days.setDate(in7days.getDate() + 7);

  const monthStart = startOfMonth(now);
  const nextMonthStart = startOfNextMonth(now);

  //total member in the gym
  const [{ total: totalMember }] = await db
    .select({ total: count() })
    .from(members)
    .where(eq(members.gymId, gymId));

  //Active members - has at least one active membership row
  const [{ total: activeMembers }] = await db
    .select({ total: sql<number>`count(distinct ${memberships.memberId})` })
    .from(memberships)
    .innerJoin(members, eq(memberships.memberId, members.id))
    .where(and(eq(members.gymId, gymId), eq(memberships.status, "ACTIVE")));

  //Membership expiring in next 7 days
  const [{ total: expiringSoon }] = await db
    .select({ total: sql<number>`count(distinct ${memberships.memberId})` })
    .from(memberships)
    .innerJoin(members, eq(memberships.memberId, members.id))
    .where(
      and(
        eq(members.gymId, gymId),
        eq(memberships.status, "ACTIVE"),
        gte(memberships.endDate, now.toISOString().split("T")[0]),
        lte(memberships.endDate, in7days.toISOString().split("T")[0]),
      ),
    );

  //new members this month - join Date falls in current month
  const [{ total: newThisMonth }] = await db
    .select({ total: count() })
    .from(members)
    .where(
      and(
        eq(members.gymId, gymId),
        gte(members.joinDate, monthStart.toISOString().split("T")[0]),
        lte(members.joinDate, nextMonthStart.toISOString().split("T")[0]),
      ),
    );

  //Revenue this month - reuse the from payment.services.ts
  const revenueThisMonth = await getRevenueForMonth(
    gymId,
    now.getFullYear(),
    now.getMonth() + 1,
  );

  return {
    totalMember,
    activeMembers,
    expiringSoon,
    newThisMonth,
    revenueThisMonth,
  };
}
