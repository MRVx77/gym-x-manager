import { eq } from "drizzle-orm";
import { db } from "../../db/db";
import { users } from "../../db/schema";
import { BadRequestError } from "../../lib/errors";
import { signToken } from "../../lib/jwt";
import { LoginInput, RegisterInput } from "./auth.schema";
import bcrypt from "bcryptjs";

export async function registerUser(input: RegisterInput) {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email));

  if (existing.length > 0) {
    throw new BadRequestError("Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  const [user] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    });

  const token = signToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  return { token, user };
}

export async function loginUser(input: LoginInput) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email));

  if (!user) {
    throw new BadRequestError("Invalid credentials or user does not exist.");
  }

  const isMath = await bcrypt.compare(input.password, user.password);

  if (!isMath) {
    throw new BadRequestError("Invalid credentials");
  }

  const token = signToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  return { token, user: { id: user.id, email: user.email, role: user.role } };
}
