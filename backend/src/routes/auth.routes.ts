import { Router } from "express";
import { getUser, login, register } from "../modules/auth/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authenticate, getUser);

export default authRouter;
