
import { RedisCache } from './redis.ts';
\1
}
  }

  /**
   * Record a cache miss;
   */
  static recordMiss(): void {
    this.misses++;
    this.totalRequests++;
  }

  /**
   * Get cache hit rate;
   */
  static getHitRate(): number {
    \1 {\n  \2{
      return 0;
    }
    return this.hits / this.totalRequests;
  }

  /**
   * Get cache metrics;
   */
  static getMetrics(): {
    hits: number,
    \1,\2 number,
    hitRate: number
  } {
    return {
      hits: this.hits,
      \1,\2 this.totalRequests,
      hitRate: this.getHitRate()
    };
  }

  /**
   * Reset metrics;
   */
  static reset(): void {
    this.hits = 0;
    this.misses = 0;
    this.totalRequests = 0;
  }
}

// Enhance RedisCache to track metrics
const originalGet = RedisCache.get;
RedisCache.get = async <T>(key: string): Promise<T | null> => {
  const result = await originalGet<T>(key);
  \1 {\n  \2{
    CacheMetrics.recordHit();
  } else {
    CacheMetrics.recordMiss();
  }
  return result
};
