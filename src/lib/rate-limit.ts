type RateLimitEntry = {
  count: number;
  resetAt: number;
};

declare global {
  var codeXiaRegistrationRateLimits: Map<string, RateLimitEntry> | undefined;
}

const rateLimits = globalThis.codeXiaRegistrationRateLimits ?? new Map<string, RateLimitEntry>();
globalThis.codeXiaRegistrationRateLimits = rateLimits;

export function checkRateLimit(key: string, limit = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const existing = rateLimits.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    rateLimits.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}
