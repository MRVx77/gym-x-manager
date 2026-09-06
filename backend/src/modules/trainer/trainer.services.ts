import { and, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { trainers } from "../../db/schema";
import { CreateTrainerSchema, UpdateTrainerSchema } from "./trainer.schema";
import { NotFoundError } from "../../lib/errors";

export async function createTrainer(gymId: string, input: CreateTrainerSchema) {
  const [trainer] = await db
    .insert(trainers)
    .values({
      gymId,
      name: input.name,
      gender: input.gender,
      specialization: input.specialization,
      experienceYears: input.experienceYears,
      pricing: input.pricing?.toString(),
    })
    .returning();

  return trainer;
}

export async function getTrainers(gymId: string) {
  const trainerList = await db
    .select()
    .from(trainers)
    .where(eq(trainers.gymId, gymId));

  return trainerList; // empty array is valid
}

export async function getTrainerById(gymId: string, trainerId: string) {
  const [trainer] = await db
    .select()
    .from(trainers)
    .where(and(eq(trainers.id, trainerId), eq(trainers.gymId, gymId)));

  if (!trainer) {
    throw new NotFoundError("Trainer not found");
  }

  return trainer;
}

export async function updateTrainer(
  gymId: string,
  trainerId: string,
  input: UpdateTrainerSchema,
) {
  const [updatedTrainer] = await db
    .update(trainers)
    .set({
      ...input,
      pricing:
        input.pricing !== undefined ? input.pricing.toString() : undefined,
    })
    .where(and(eq(trainers.id, trainerId), eq(trainers.gymId, gymId)))
    .returning();

  if (!updatedTrainer) throw new NotFoundError("Trainer not found");

  return updatedTrainer;
}

export async function updateTrainerPhoto(
  gymId: string,
  trainerId: string,
  imageUrl: string,
) {
  const [updatedTrainer] = await db
    .update(trainers)
    .set({ profileImage: imageUrl })
    .where(and(eq(trainers.id, trainerId), eq(trainers.gymId, gymId)))
    .returning();

  if (!updatedTrainer) throw new NotFoundError("Trainer not found");

  return updatedTrainer;
}

export async function deleteTrainer(gymId: string, trainerId: string) {
  const [trainer] = await db
    .delete(trainers)
    .where(and(eq(trainers.id, trainerId), eq(trainers.gymId, gymId)))
    .returning();

  if (!trainer) throw new NotFoundError("Trainer not found");

  return trainer;
}
