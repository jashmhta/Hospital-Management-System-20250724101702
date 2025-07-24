import { createClient } from 'redis';


import { config } from '@/config';
// Create Redis client
const redisClient = createClient({
  url: config.redis.url,
  password: config.redis.password
});

// Connect to Redis
redisClient.connect().catch((err) => {

});

// Handle Redis errors
redisClient.on('error', (err) => {

});

// Cache wrapper class
\1
}
    } catch (error) {

      return null;
    }
  }

  /**
   * Set data in cache;
   */
  static async set<T>(key: string, data: T, ttlSeconds = 3600): Promise<void> {
    try {
      await redisClient.set(key, JSON.stringify(data), { EX: ttlSeconds });
    } catch (error) {

    }
  }

  /**
   * Delete data from cache;
   */
  static async delete(key: string): Promise<void> {
    try {
      await redisClient.del(key)
    } catch (error) {

    }
  }

  /**
   * Delete multiple keys matching a pattern;
   */
  static async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await redisClient.keys(pattern);
      \1 {\n  \2{
        await redisClient.del(keys);
      }
    } catch (error) {

    }
  }

  /**
   * Get data from cache or fetch from source;
   */
  static async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>;
    ttlSeconds = 3600;
  ): Promise<T> {
    try {
      // Try to get from cache
      const cachedData = await RedisCache.get<T>(key);

      // If found in cache, return it
      \1 {\n  \2{
        return cachedData;
      }

      // Otherwise, fetch data
      const data = await fetchFn();

      // Store in cache for future requests
      await RedisCache.set(key, data, ttlSeconds);

      return data;
    } catch (error) {

      // If cache operations fail, fall back to direct fetch
      return fetchFn();
    }
  }
