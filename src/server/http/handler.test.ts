import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { NotFoundError, RateLimitError, UpstreamError } from "./errors";
import { apiHandler, clientIp, parseJson } from "./handler";

afterEach(() => vi.restoreAllMocks());

const request = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("https://site.test/api/x", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

describe("apiHandler", () => {
  it("passes successful responses through", async () => {
    const route = apiHandler("test", async () => Response.json({ ok: true }));
    expect((await route(request({}))).status).toBe(200);
  });

  it("turns expected errors into their own status and message", async () => {
    const route = apiHandler("test", async () => {
      throw new NotFoundError("Sem isso aqui.");
    });
    const response = await route(request({}));
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: { code: "not_found", message: "Sem isso aqui." },
    });
  });

  it("adds Retry-After on rate limiting", async () => {
    const route = apiHandler("test", async () => {
      throw new RateLimitError(42);
    });
    const response = await route(request({}));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("42");
  });

  it("hides the details of unexpected bugs", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const route = apiHandler("test", async () => {
      throw new Error("database password is hunter2");
    });
    const response = await route(request({}));
    const text = await response.text();
    expect(response.status).toBe(500);
    expect(text).not.toContain("hunter2");
  });

  it("logs upstream failures but still answers 502", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const route = apiHandler("test", async () => {
      throw new UpstreamError();
    });
    expect((await route(request({}))).status).toBe(502);
    expect(spy).toHaveBeenCalled();
  });
});

describe("parseJson", () => {
  const schema = z.object({ qty: z.number().positive("Quantidade inválida.") });

  it("returns valid data", async () => {
    expect(await parseJson(request({ qty: 2 }), schema)).toEqual({ qty: 2 });
  });

  it("rejects malformed JSON and invalid data with a 400-style error", async () => {
    await expect(parseJson(request("{nope"), schema)).rejects.toMatchObject({
      status: 400,
    });
    await expect(parseJson(request({ qty: -1 }), schema)).rejects.toMatchObject(
      {
        status: 400,
        message: "Quantidade inválida.",
      },
    );
  });
});

describe("clientIp", () => {
  it("uses the first address of x-forwarded-for", () => {
    expect(
      clientIp(request({}, { "x-forwarded-for": "1.2.3.4, 10.0.0.1" })),
    ).toBe("1.2.3.4");
    expect(clientIp(request({}))).toBe("unknown");
  });
});
