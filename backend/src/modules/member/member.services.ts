import {
  and,
  desc,
  eq,
  ilike,
  inArray,
  isNotNull,
  isNull,
  or,
  sql,
} from "drizzle-orm";
import { db } from "../../db/db";
import { members, memberships } from "../../db/schema";
import { CreateMemberSchema, UpdateMemberSchema } from "./member.schema";
import { NotFoundError } from "../../lib/errors";
import { getRemainingDaysAndColor } from "../membership/membership.services";

export async function createMember(gymId: string, input: CreateMemberSchema) {
  const [member] = await db
    .insert(members)
    .values({
      gymId,
      name: input.name,
      phone: input.phone,
      emergencyContact: input.emergencyContact,
      dateOfBirth: input.dateOfBirth,
      trainerId: input.trainerId,
    })
    .returning();

  return member;
}

export async function getMembers(gymId: string, search?: string) {
  const memberRows = await db
    .select()
    .from(members)
    .where(
      search
        ? and(
            eq(members.gymId, gymId),
            isNull(members.deletedAt),
            or(
              ilike(members.name, `%${search}%`),
              ilike(members.phone, `%${search}%`),
              ilike(sql`${members.id}::text`, `%${search}%`),
            ),
          )
        : and(eq(members.gymId, gymId), isNull(members.deletedAt)),
    );

  if (memberRows.length === 0) return [];

  const membershipRows = await db
    .select()
    .from(memberships)
    .where(
      inArray(
        memberships.memberId,
        memberRows.map((m) => m.id),
      ),
    )
    .orderBy(desc(memberships.createdAt));

  const latestByMember = new Map<string, (typeof membershipRows)[number]>();

  for (const row of membershipRows) {
    if (!latestByMember.has(row.memberId))
      latestByMember.set(row.memberId, row);
  }

  return memberRows.map((m) => {
    const current = latestByMember.get(m.id);
    return {
      ...m,
      membership: current
        ? { ...current, ...getRemainingDaysAndColor(current.endDate) }
        : null,
    };
  });
}

export async function getMemberById(gymId: string, memberId: string) {
  const [member] = await db
    .select()
    .from(members)
    .where(
      and(
        eq(members.id, memberId),
        eq(members.gymId, gymId),
        isNull(members.deletedAt),
      ),
    );

  if (!member) throw new NotFoundError("Member Not Found");

  return member;
}

export async function updateMember(
  gymId: string,
  memberId: string,
  input: UpdateMemberSchema,
) {
  const [updateMember] = await db
    .update(members)
    .set(input)
    .where(and(eq(members.id, memberId), eq(members.gymId, gymId)))
    .returning();

  if (!updateMember) throw new NotFoundError("Member Not Found");

  return updateMember;
}

export async function deleteMember(memberId: string, gymId: string) {
  const [member] = await db
    .update(members)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(members.id, memberId),
        eq(members.gymId, gymId),
        isNull(members.deletedAt), // only soft-delete once
      ),
    )
    .returning();

  if (!member) throw new NotFoundError("Member Not Found");

  return member;
}

export async function restoreMember(gymId: string, memberId: string) {
  const [member] = await db
    .update(members)
    .set({ deletedAt: null })
    .where(
      and(
        eq(members.id, memberId),
        eq(members.gymId, gymId),
        isNotNull(members.deletedAt),
      ),
    )
    .returning();

  if (!member) throw new NotFoundError("Member Not found");

  return member;
}

export async function updateMemberPhoto(
  memberId: string,
  gymId: string,
  imageUrl: string,
) {
  const [member] = await db
    .update(members)
    .set({ profilePhotoUrl: imageUrl })
    .where(and(eq(members.id, memberId), eq(members.gymId, gymId)))
    .returning();

  if (!member) throw new NotFoundError("Member Not Found");

  return member;
}
