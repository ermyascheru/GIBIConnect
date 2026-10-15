import "dotenv/config";
import { z } from "zod";

const databaseUrlSchema = z
  .string()
  .trim()
  .min(1)
  .superRefine((value, context) => {
    if (!value) {
      return;
    }

    try {
      const url = new URL(value);
      const hasPostgresScheme = /^postgres(?:ql)?:\/\//i.test(value);
      const hasPostgresProtocol =
        url.protocol === "postgres:" || url.protocol === "postgresql:";

      if (!hasPostgresScheme || !hasPostgresProtocol || !url.hostname) {
        context.addIssue({
          code: "custom",
          message: "must be a valid PostgreSQL URL with a host",
        });
      }
    } catch {
      context.addIssue({
        code: "custom",
        message: "must be a valid PostgreSQL URL with a host",
      });
    }
  });

const environmentSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  DATABASE_URL: databaseUrlSchema,
  JWT_ACCESS_SECRET: z.string().trim().min(1),
  JWT_REFRESH_SECRET: z.string().trim().min(1),
});

const result = environmentSchema.safeParse(process.env);

if (!result.success) {
  const details = result.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");

  throw new Error(`Invalid environment configuration: ${details}`);
}

const validatedEnv = result.data;

export const env = {
  nodeEnv: validatedEnv.NODE_ENV,
  port: validatedEnv.PORT,
  databaseUrl: validatedEnv.DATABASE_URL,
  jwtAccessSecret: validatedEnv.JWT_ACCESS_SECRET,
  jwtRefreshSecret: validatedEnv.JWT_REFRESH_SECRET,
};