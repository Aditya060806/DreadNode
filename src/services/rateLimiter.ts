// Rate limiter for Gemini API calls
class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;
  private queue: Array<{ resolve: () => void; timestamp: number }> = [];
  private processing: boolean = false;

  constructor(maxRequests: number = 5, windowMs: number = 60000) {
    this.maxRequests = maxRequests; // 5 requests per minute (very conservative to avoid 429)
    this.windowMs = windowMs;
  }

  async waitForSlot(): Promise<void> {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(timestamp => now - timestamp < this.windowMs);
    
    // If under limit, allow immediately
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return;
    }
    
    // Calculate wait time until oldest request expires
    const oldestRequest = this.requests[0];
    const waitTime = this.windowMs - (now - oldestRequest) + 100; // Add 100ms buffer
    
    // Wait and retry
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return this.waitForSlot();
  }

  recordRequest(): void {
    this.requests.push(Date.now());
  }
}

// Request cache to avoid duplicate API calls
class RequestCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private ttl: number;

  constructor(ttl: number = 30000) {
    this.ttl = ttl; // 30 seconds default
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

// Global rate limiter and cache
export const rateLimiter = new RateLimiter(15, 60000); // 15 requests per minute
export const requestCache = new RequestCache(30000); // 30 second cache

// Generate cache key from request
export function generateCacheKey(type: string, data: any): string {
  return `${type}:${JSON.stringify(data).slice(0, 200)}`;
}

