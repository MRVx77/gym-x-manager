import { and, eq, ilike, or } from "drizzle-orm";
import { db } from "../../db/db";
import { members } from "../../db/schema";
import { CreateMemberSchema, UpdateMemberSchema } from "./member.schema";
import { NotFoundError } from "../../lib/errors";

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
  if (!search) {
    return db.select().from(members).where(eq(members.gymId, gymId));
  }

  return db
    .select()
    .from(members)
    .where(
      and(
        eq(members.gymId, gymId),
        or(
          ilike(members.name, `%${search}%`),
          ilike(members.phone, `%${search}%`),
          ilike(members.id, `%${search}%`),
        ),
      ),
    );
}

export async function getMemberById(gymId: string, memberId: string) {
  const [member] = await db
    .select()
    .from(members)
    .where(and(eq(members.id, memberId), eq(members.gymId, gymId)));

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
    .delete(members)
    .where(and(eq(members.id, memberId), eq(members.gymId, gymId)))
    .returning();

  if (!member) throw new NotFoundError("Member Not Found");

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
