// Simple in-memory rate limiter for MVP
// For production, consider using Upstash Redis or a similar solution

// Rate limiting utility for API protection
const rateLimit = require('express-rate-limit');

const rateLimits = new Map();

export function rateLimit(identifier, limit, windowMs) {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Clean up old entries
  for (const [key, data] of rateLimits.entries()) {
    if (data.windowStart < windowStart) {
      rateLimits.delete(key);
    }
  }

  const key = identifier;
  const data = rateLimits.get(key);

  if (!data || data.windowStart < windowStart) {
    // New window
    rateLimits.set(key, {
      count: 1,
      windowStart: now,
    });
    return { success: true, remaining: limit - 1 };
  }

  if (data.count >= limit) {
    return { success: false, remaining: 0 };
  }

  data.count++;
  return { success: true, remaining: limit - data.count };
}

export function getRateLimitKey(request, identifier) {
  if (identifier) {
    return identifier;
  }

  // Use IP address as fallback
  const ip = request.headers.get("x-forwarded-for") || 
             request.headers.get("x-real-ip") || 
             "unknown";
  return ip;
}
