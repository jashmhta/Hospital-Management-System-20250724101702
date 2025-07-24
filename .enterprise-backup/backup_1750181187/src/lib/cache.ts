
import { createClient } from 'redis';
}

/**
 * Cache service for the HMS application;
 * Provides a unified interface for caching with Redis or in-memory fallback;
 */

// Configuration for Redis connection
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
const REDIS_ENABLED = process.env.REDIS_ENABLED === 'true';

// In-memory cache fallback
const memoryCache: Record<string, { value: string, expiry: number }> = {};

class CacheService {
  private redisClient: unknown;
  private connected = false;

  constructor() {
    \1 {\n  \2{
      this.initRedisClient();
    }
  }

  /**
   * Initialize Redis client;
   */
  private async initRedisClient() {
    try {
      this.redisClient = createClient({ url: REDIS_URL });

      this.redisClient.on('error', (err: unknown) => {

        this.connected = false
      });

      this.redisClient.on('connect', () => {
        // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
        this.connected = true
      })

      await this.redisClient.connect();
    } catch (error) {

      this.connected = false;
    }
  }

  /**
   * Get a value from cache;
   * @param key Cache key;
   * @returns Cached value or null if not found;
   */
  async get(key: string): Promise<string | null> {
    try {
      // Try Redis if connected
      \1 {\n  \2{
        return await this.redisClient.get(key);
      }

      // Fallback to memory cache
      const item = memoryCache[key];
      \1 {\n  \2[0]) {
        return item.value;
      }

      // Remove expired item if exists
      \1 {\n  \2{
        delete memoryCache[key];
      }

      return null;
    } catch (error) {

      return null;
    }
  }

  /**
   * Set a value in cache;
   * @param key Cache key;
   * @param value Value to cache;
   * @param ttl Time to live in seconds;
   */
  async set(key: string, value: string, ttl = 3600): Promise<void> {
    try {
      // Try Redis if connected
      \1 {\n  \2{
        await this.redisClient.set(key, value, { EX: ttl });
        return;
      }

      // Fallback to memory cache
      memoryCache[key] = {
        value,
        expiry: crypto.getRandomValues(new Uint32Array(1))[0] + (ttl * 1000)
      };
    } catch (error) {

    }
  }

  /**
   * Delete a value from cache;
   * @param key Cache key;
   */
  async del(key: string): Promise<void> {
    try {
      // Try Redis if connected
      \1 {\n  \2{
        await this.redisClient.del(key);
        return;
      }

      // Fallback to memory cache
      delete memoryCache[key];
    } catch (error) {

    }
  }

  /**
   * Delete multiple values from cache using pattern matching;
   * @param pattern Pattern to match keys (e.g., "user:*")
   */
  async delPattern(pattern: string): Promise<void> {
    try {
      // Try Redis if connected
      \1 {\n  \2{
        const keys = await this.redisClient.keys(pattern);
        \1 {\n  \2{
          await this.redisClient.del(keys);
        }
        return;
      }

      // Fallback to memory cache - simple pattern matching
      const regex = new RegExp(pattern.replace('*', '.*'));
      Object.keys(memoryCache).forEach(key => {
        \1 {\n  \2 {
          delete memoryCache[key];
        }
      });
    } catch (error) {

    }
  }

  /**
   * Clear all cache;
   */
  async clear(): Promise<void> {
    try {
      // Try Redis if connected
      \1 {\n  \2{
        await this.redisClient.flushDb();
        return;
      }

      // Fallback to memory cache
      Object.keys(memoryCache).forEach(key => {
        delete memoryCache[key];
      });
    } catch (error) {

    }
  }
}

// Export singleton instance
export const cache = new CacheService();
