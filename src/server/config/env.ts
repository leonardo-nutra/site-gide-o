import "server-only";
import { z } from "zod";
import { ConfigError } from "../http/errors";

/** Empty strings in a .env file count as "not set". */
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    schema.optional(),
  );

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10),
  NEXT_PUBLIC_META_PIXEL_ID: optional(
    z.string().regex(/^\d+$/, "deve ser só números"),
  ),
  /** Secret for the Meta Conversions API. Only ever set on the host, never in code. */
  META_CAPI_TOKEN: optional(z.string().min(20)),
  /** Only while testing in Meta's "Test events" tab. */
  META_TEST_EVENT_CODE: optional(z.string().min(3)),
});

export type ServerEnv = z.infer<typeof schema>;

let cached: ServerEnv | undefined;

/**
 * Validated environment, read once. Fails with the NAMES of the bad variables
 * (never their values) so a misconfigured deploy is obvious in the logs.
 */
export function getServerEnv(): ServerEnv {
  if (cached) return cached;

  const result = schema.safeParse(process.env);
  if (!result.success) {
    const problems = result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`,
    );
    throw new ConfigError(
      `Variáveis de ambiente inválidas — ${problems.join("; ")}`,
    );
  }

  cached = result.data;
  return cached;
}
