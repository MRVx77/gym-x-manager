import jwt from "jsonwebtoken";
import { env } from "process";

export interface JWTPlayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: JWTPlayload): string {
  return jwt.sign(payload, env.JWT_SECRET as any, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
}

export function verifyToken(token: string): JWTPlayload {
  return jwt.verify(token, env.JWT_SECRET as string) as JWTPlayload;
}
