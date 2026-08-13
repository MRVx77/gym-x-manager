import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.string().default("5000"),
  DB_HOST: z
    .string()
    .default("ep-cold-frog-axjui88t-pooler.c-4.us-east-2.aws.neon.tech"),
  DB_PORT: z.string().default("5432"),
  DB_NAME: z.string().default("neondb"),
  DB_USER: z.string().default("neondb_owner"),
  DB_PASSWORD: z.string().default("npg_8XJ1nvDldHfK"),
  DB_SSL: z.string().optional().default("false"),
});

const parse = EnvSchema.safeParse(process.env);

if (!parse.success) {
  process.exit(1);
}

export const env = parse.data;
