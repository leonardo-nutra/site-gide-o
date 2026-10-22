import { afterEach, describe, expect, it, vi } from "vitest";
import { logger } from "./logger";

afterEach(() => vi.restoreAllMocks());

describe("logger", () => {
  it("writes one JSON object per line with level, time and event", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("orders.created", { count: 2 });

    const line = JSON.parse(spy.mock.calls[0][0] as string);
    expect(line).toMatchObject({
      level: "info",
      event: "orders.created",
      count: 2,
    });
    expect(typeof line.time).toBe("string");
  });

  it("redacts anything that looks like a credential", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("meta.failed", new Error("boom"), {
      access_token: "EAAF-secret",
      status: 400,
    });

    const text = spy.mock.calls[0][0] as string;
    expect(text).not.toContain("EAAF-secret");
    expect(JSON.parse(text)).toMatchObject({
      access_token: "[redacted]",
      status: 400,
      errorMessage: "boom",
    });
  });
});
