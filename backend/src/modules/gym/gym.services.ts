import { eq } from "drizzle-orm";
import { db } from "../../db/db";
import { gyms, users } from "../../db/schema";
import { CreateGymInput, UpdateGymInput } from "./gym.schema";
import { BadRequestError, NotFoundError } from "../../lib/errors";
import { signToken } from "../../lib/jwt";

export async function createGym(userId: string, input: CreateGymInput) {
  const [user] = await db.select().from(users).where(eq(users.id, userId));

  if (!user) {
    throw new NotFoundError("User not Found!");
  }

  if (user.gymId) {
    throw new BadRequestError("You already have a gym registered");
  }

  const [gym] = await db
    .insert(gyms)
    .values({
      name: input.name,
      ownerId: userId,
      onboardingStatus: "PENDING_DETAILS",
    })
    .returning();

  const [updateUser] = await db
    .update(users)
    .set({ gymId: gym.id })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      gymId: users.gymId,
    });

  const token = signToken({
    userId: updateUser.id,
    name: updateUser.name,
    email: updateUser.email,
    role: updateUser.role,
    gymId: updateUser.gymId,
  });

  return { token, gym };
}

export async function updateGym(gymId: string, input: UpdateGymInput) {
  const [gym] = await db
    .update(gyms)
    .set({
      location: input.location,
      images: input.images ?? [],
      onboardingStatus: "ACTIVE",
    })
    .where(eq(gyms.id, gymId))
    .returning();

  if (!gym) {
    throw new BadRequestError("The gym does not exist");
  }

  return gym;
}

export async function getMyGym(gymId: string) {
  const [gym] = await db.select().from(gyms).where(eq(gyms.id, gymId));

  if (!gym) throw new NotFoundError("Gym Not Found");

  return gym;
}
