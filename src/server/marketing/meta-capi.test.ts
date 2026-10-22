import { describe, expect, it } from "vitest";
import { buildMetaPayload, metaEventSchema } from "./meta-capi";

describe("buildMetaPayload", () => {
  const input = metaEventSchema.parse({
    eventName: "Lead",
    eventId: "abc-123",
    sourceUrl: "https://site.test/",
    fbp: "fb.1.2.3",
    customData: {
      content_name: "WhatsApp",
      utm_source: "facebook",
      utm_medium: undefined,
      utm_campaign: "",
    },
  });

  it("builds the Conversions API event with the shared event id (for de-duplication)", () => {
    const payload = buildMetaPayload(
      input,
      { ip: "1.2.3.4", userAgent: "UA" },
      1_700_000_000_000,
    );
    const [event] = payload.data;

    expect(event.event_name).toBe("Lead");
    expect(event.event_id).toBe("abc-123");
    expect(event.event_time).toBe(1_700_000_000);
    expect(event.action_source).toBe("website");
    expect(event.user_data).toMatchObject({
      client_ip_address: "1.2.3.4",
      client_user_agent: "UA",
      fbp: "fb.1.2.3",
    });
  });

  it("drops empty custom fields", () => {
    const [event] = buildMetaPayload(input, {}).data;
    expect(event.custom_data).toEqual({
      content_name: "WhatsApp",
      utm_source: "facebook",
    });
  });

  it("only includes test_event_code when testing", () => {
    expect(buildMetaPayload(input, {})).not.toHaveProperty("test_event_code");
    expect(buildMetaPayload(input, {}, Date.now(), "TEST123")).toMatchObject({
      test_event_code: "TEST123",
    });
  });

  it("accepts only the events the site is allowed to forward", () => {
    expect(metaEventSchema.safeParse({ eventName: "Purchase" }).success).toBe(
      false,
    );
  });
});
