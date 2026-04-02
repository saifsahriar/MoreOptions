import { headers } from 'next/headers';

interface RateLimitEntry {
  count: number;
  lastReset: number;
}

const STORAGE = new Map<string, RateLimitEntry>();
const WINDOW_SIZE_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 20; // 20 requests per minute

/**
 * Basic in-memory rate limiter for server actions.
 * In production, this should use Redis (e.g. Upstash) for distributed persistence.
 */
export async function checkRateLimit(actionName: string) {
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for') || 'anonymous';
  const key = `${actionName}:${ip}`;
  
  const now = Date.now();
  const entry = STORAGE.get(key) || { count: 0, lastReset: now };

  if (now - entry.lastReset > WINDOW_SIZE_MS) {
    entry.count = 1;
    entry.lastReset = now;
  } else {
    entry.count++;
  }

  STORAGE.set(key, entry);

  if (entry.count > MAX_REQUESTS) {
    throw new Error(`Rate limit exceeded for ${actionName}. Please try again later.`);
  }
}
