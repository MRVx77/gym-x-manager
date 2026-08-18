import { Request, Response } from "express";
import { LoginSchema, RegisterSchema } from "./auth.schema";
import { BadRequestError } from "../../lib/errors";
import { loginUser, registerUser } from "./auth.services";

export async function register(req: Request, res: Response) {
  const parsed = RegisterSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new BadRequestError("Invalid data", parsed.error.flatten());
  }

  const result = await registerUser(parsed.data);

  res.status(201).json({
    message: "User registered successfully",
    token: result.token,
    user: result.user,
  });
}

export async function login(req: Request, res: Response) {
  const parsed = LoginSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new BadRequestError("Invaild credentials", parsed.error.flatten());
  }

  const result = await loginUser(parsed.data);

  res.status(200).json({
    message: "Login successful",
    token: result.token,
    user: result.user,
  });
}

export async function getUser(req: Request, res: Response) {
  res.status(200).json({ user: req.user });
}
