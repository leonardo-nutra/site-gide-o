import { describe, expect, it } from "vitest";
import { RateLimitError } from "./errors";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("allows up to the limit, then blocks with the time to wait", () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 60_000 });
    const now = 1_000_000;

    for (let i = 0; i < 3; i++)
      expect(() => limiter.check("ip-1", now)).not.toThrow();

    try {
      limiter.check("ip-1", now + 10_000);
      throw new Error("should have been blocked");
    } catch (error) {
      expect(error).toBeInstanceOf(RateLimitError);
      expect((error as RateLimitError).retryAfterSeconds).toBe(50);
    }
  });

  it("counts each client separately", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });
    limiter.check("a", 0);
    expect(() => limiter.check("b", 0)).not.toThrow();
    expect(() => limiter.check("a", 1)).toThrow(RateLimitError);
  });

  it("starts a fresh window once the old one ends", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1_000 });
    limiter.check("a", 0);
    expect(() => limiter.check("a", 500)).toThrow(RateLimitError);
    expect(() => limiter.check("a", 1_001)).not.toThrow();
  });
});
