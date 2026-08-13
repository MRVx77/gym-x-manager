import express from "express";
import cors from "cors";
import helmet from "helmet";

export function creatApp() {
  const app = express();

  //middlewares
  app.use(cors());
  app.use(express.json());
  app.use(helmet());

  return app;
}
