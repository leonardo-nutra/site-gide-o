import { RateLimitError } from "./errors";

type Bucket = { count: number; resetAt: number };

/**
 * Fixed-window limiter kept in memory. On serverless each instance counts on its
 * own, so this blocks obvious floods and accidental loops, not a determined attacker
 * (that needs an edge/WAF rule). Cheap, dependency-free and good enough for a storefront.
 */
export function createRateLimiter({
  limit,
  windowMs,
}: {
  limit: number;
  windowMs: number;
}) {
  const buckets = new Map<string, Bucket>();

  return {
    /** Throws RateLimitError when `key` has used up its allowance for the current window. */
    check(key: string, now = Date.now()) {
      // Keep memory bounded: forget windows that already ended.
      if (buckets.size > 5_000) {
        for (const [bucketKey, bucket] of buckets)
          if (bucket.resetAt <= now) buckets.delete(bucketKey);
      }

      const bucket = buckets.get(key);
      if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return;
      }

      bucket.count += 1;
      if (bucket.count > limit)
        throw new RateLimitError(Math.ceil((bucket.resetAt - now) / 1000));
    },
  };
}
