import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 * 7,
  });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, env.JWT_SECRET as string) as JWTPayload;
}
