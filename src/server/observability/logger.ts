import "server-only";

type Level = "debug" | "info" | "warn" | "error";
type Fields = Record<string, unknown>;

const SECRET_KEYS =
  /token|secret|password|authorization|apikey|api_key|cookie/i;

/** Drops anything that looks like a credential before it reaches the logs. */
function scrub(fields: Fields): Fields {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      SECRET_KEYS.test(key) ? "[redacted]" : value,
    ]),
  );
}

function write(level: Level, event: string, fields: Fields = {}) {
  const line = JSON.stringify({
    level,
    time: new Date().toISOString(),
    event,
    ...scrub(fields),
  });
  // One JSON object per line: easy to search in the Vercel logs.
  (level === "error"
    ? console.error
    : level === "warn"
      ? console.warn
      : console.log)(line);
}

function describe(error: unknown) {
  if (error instanceof Error)
    return {
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
    };
  return { errorMessage: String(error) };
}

/** Structured logging: `logger.error("orders.create_failed", error, { orderId })`. */
export const logger = {
  debug: (event: string, fields?: Fields) => write("debug", event, fields),
  info: (event: string, fields?: Fields) => write("info", event, fields),
  warn: (event: string, fields?: Fields) => write("warn", event, fields),
  error: (event: string, error?: unknown, fields?: Fields) =>
    write("error", event, {
      ...(error === undefined ? {} : describe(error)),
      ...fields,
    }),
};
