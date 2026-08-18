import { query } from "../../db/db";
import { BadRequestError } from "../../lib/errors";
import { signToken } from "../../lib/jwt";
import { LoginInput, RegisterInput } from "./auth.schema";
import bcrypt from "bcryptjs";

export async function registerUser(input: RegisterInput) {
  const existing = await query(
    `
        select id from users where email = $1
        `,
    [input.email],
  );

  if (existing.rows.length > 0) {
    throw new BadRequestError("Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  const result = await query(
    `
        insert into users (name, email, password, role)
        values($1, $2, $3, $4)
        returning id, email, role
        `,
    [input.name, input.email, hashedPassword, input.role],
  );

  const user = result.rows[0];

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { token, user };
}

export async function loginUser(input: LoginInput) {
  const result = await query(
    `
      select id, email, password, role from users where email = $1
    `,
    [input.email],
  );

  if (result.rows.length === 0) {
    throw new BadRequestError("Invalid credentials or user does not exist.");
  }

  const user = result.rows[0];

  const isMath = await bcrypt.compare(input.password, user.password);

  if (!isMath) {
    throw new BadRequestError("Invalid credentials");
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { token, user: { id: user.id, email: user.email, role: user.role } };
}
