/**
 * Application errors. Anything that extends AppError carries a status and a
 * stable `code`, and its message is safe to show to the person who triggered it.
 * Any other error is treated as a bug: logged in full, answered generically.
 */
export class AppError extends Error {
  constructor(
    message: string,
    readonly status = 500,
    readonly code = "internal_error",
  ) {
    super(message);
    this.name = new.target.name;
  }
}

/** The request is well-formed but its data is not acceptable (HTTP 400). */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "validation_error");
  }
}

/** Raised by admin forms; shown to the admin next to the form. */
export class ActionError extends ValidationError {}

export class NotFoundError extends AppError {
  constructor(message = "Não encontrado.") {
    super(message, 404, "not_found");
  }
}

export class RateLimitError extends AppError {
  constructor(readonly retryAfterSeconds: number) {
    super(
      "Muitas tentativas em pouco tempo. Aguarde um pouco e tente de novo.",
      429,
      "rate_limited",
    );
  }
}

/** A service we depend on (database, Meta...) failed (HTTP 502). */
export class UpstreamError extends AppError {
  constructor(message = "Serviço indisponível no momento.") {
    super(message, 502, "upstream_error");
  }
}

/** Environment variables are missing or malformed (a deployment problem, not a user one). */
export class ConfigError extends AppError {
  constructor(message: string) {
    super(message, 500, "config_error");
  }
}
