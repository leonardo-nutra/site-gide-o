import { afterEach, describe, expect, it, vi } from "vitest";
import { randomId } from "./random-id";

afterEach(() => vi.unstubAllGlobals());

describe("randomId", () => {
  it("returns different ids each time", () => {
    expect(randomId()).not.toBe(randomId());
  });

  it("still works on browsers without crypto.randomUUID", () => {
    vi.stubGlobal("crypto", {
      getRandomValues: (bytes: Uint8Array) => bytes.fill(7),
    });
    expect(randomId()).toBe("07".repeat(16));
  });

  it("still works with no crypto at all", () => {
    vi.stubGlobal("crypto", undefined);
    expect(randomId()).toMatch(/^[0-9a-f]{32}$/);
  });
});
