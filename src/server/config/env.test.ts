import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const valid = {
  NEXT_PUBLIC_SUPABASE_URL: "https://abc.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key-1234567890",
};

async function load(env: Record<string, string>) {
  vi.resetModules();
  vi.unstubAllEnvs();
  for (const key of [
    "NEXT_PUBLIC_META_PIXEL_ID",
    "META_CAPI_TOKEN",
    "META_TEST_EVENT_CODE",
  ])
    vi.stubEnv(key, "");
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
  return (await import("./env")).getServerEnv;
}

beforeEach(() => vi.resetModules());
afterEach(() => vi.unstubAllEnvs());

describe("getServerEnv", () => {
  it("accepts the required variables and treats empty optional ones as unset", async () => {
    const getServerEnv = await load(valid);
    const env = getServerEnv();
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe(valid.NEXT_PUBLIC_SUPABASE_URL);
    expect(env.META_CAPI_TOKEN).toBeUndefined();
  });

  it("reads the optional marketing variables when present", async () => {
    const getServerEnv = await load({
      ...valid,
      NEXT_PUBLIC_META_PIXEL_ID: "1076018674840542",
      META_CAPI_TOKEN: "x".repeat(40),
    });
    const env = getServerEnv();
    expect(env.NEXT_PUBLIC_META_PIXEL_ID).toBe("1076018674840542");
    expect(env.META_CAPI_TOKEN).toHaveLength(40);
  });

  it("names the bad variables but never prints their values", async () => {
    const secret = "not-a-url-secret-value";
    const getServerEnv = await load({
      NEXT_PUBLIC_SUPABASE_URL: secret,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "x",
    });

    let message = "";
    try {
      getServerEnv();
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toContain("NEXT_PUBLIC_SUPABASE_URL");
    expect(message).toContain("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    expect(message).not.toContain(secret);
  });
});
