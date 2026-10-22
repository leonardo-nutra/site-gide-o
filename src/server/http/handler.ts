import "server-only";
import type { ZodType, z } from "zod";
import { logger } from "../observability/logger";
import { AppError, RateLimitError, ValidationError } from "./errors";

/** Best-effort client address (behind Vercel's proxy, the first x-forwarded-for entry). */
export function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  );
}

/** Reads a JSON body and validates it; bad input becomes a clear 400. */
export async function parseJson<T extends ZodType>(
  request: Request,
  schema: T,
): Promise<z.output<T>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new ValidationError("Corpo da requisição inválido.");
  }

  const result = schema.safeParse(body);
  if (!result.success)
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Dados inválidos.",
    );
  return result.data;
}

/**
 * Wraps a route handler so every endpoint answers errors the same way:
 * expected errors (AppError) with their own status and message, anything else
 * logged in full and answered with a generic 500.
 */
export function apiHandler(
  name: string,
  handler: (request: Request) => Promise<Response>,
) {
  return async function route(request: Request): Promise<Response> {
    try {
      return await handler(request);
    } catch (error) {
      if (error instanceof AppError) {
        if (error.status >= 500) logger.error(`${name}.failed`, error);
        const headers: HeadersInit = {};
        if (error instanceof RateLimitError)
          headers["Retry-After"] = String(error.retryAfterSeconds);
        return Response.json(
          { error: { code: error.code, message: error.message } },
          { status: error.status, headers },
        );
      }

      logger.error(`${name}.unexpected`, error);
      return Response.json(
        {
          error: {
            code: "internal_error",
            message: "Erro inesperado. Tente de novo.",
          },
        },
        { status: 500 },
      );
    }
  };
}
