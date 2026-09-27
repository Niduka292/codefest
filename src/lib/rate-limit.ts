type RateLimitEntry = {
  count: number;
  resetAt: number;
};

declare global {
  var codeXiaRegistrationRateLimits: Map<string, RateLimitEntry> | undefined;
}

const rateLimits = globalThis.codeXiaRegistrationRateLimits ?? new Map<string, RateLimitEntry>();
globalThis.codeXiaRegistrationRateLimits = rateLimits;

// Immediately clear rate limits on module reload to unblock local testing
rateLimits.clear();

export function checkRateLimit(key: string, limit = 50, windowMs = 10 * 60 * 1000) {
  const isLocal =
    !key ||
    key === "unknown-client" ||
    key === "127.0.0.1" ||
    key === "::1" ||
    key === "localhost" ||
    key.startsWith("192.168.") ||
    key.startsWith("10.");

  const effectiveLimit = isLocal ? 1000 : limit;
  const now = Date.now();
  const existing = rateLimits.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    rateLimits.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: effectiveLimit - 1, resetAt };
  }

  if (existing.count >= effectiveLimit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, remaining: effectiveLimit - existing.count, resetAt: existing.resetAt };
}

export function resetRateLimits() {
  rateLimits.clear();
}
