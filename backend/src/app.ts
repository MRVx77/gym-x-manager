import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import apiRouter from "./routes";
import { HttpError } from "./lib/errors";

export function creatApp() {
  const app = express();

  //middlewares
  app.use(cors());
  app.use(express.json());
  app.use(helmet());

  //routes
  app.use("/api", apiRouter);

  //Global Error Handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ message: err.message ?? null });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  });

  return app;
}
