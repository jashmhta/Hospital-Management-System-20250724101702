import { PrismaClient } from '@prisma/client';


import type { RedisService } from '@/lib/cache/redis';
import type { ConfigService } from '@/lib/core/config.service';
import { logger } from '@/lib/core/logging';
import { metricsCollector } from '@/lib/monitoring/metrics-collector';
/**
 * Shard Configuration for a specific entity;
 */
interface ShardConfig {
  // Name of the entity being sharded
  entityName: string;

  // Key used for sharding (e.g., tenantId, regionId)
  shardKey: string

  // Algorithm used for sharding (hash, range, or lookup)
  algorithm: 'hash' | 'range' | 'lookup'

  // Number of physical shards
  shardCount: number;

  // Optional mapping function for custom shard determination
  customShardingFn?: (key: string | number) => number;

  // For range-based sharding
  ranges?: Array<{
    min: number,
    \1,\2 number
  }>;

  // For lookup-based sharding
  lookupMap?: Record<string, number>;

  // Connection details for each shard
  shardConnections: Array<{
    shardIndex: number,
    connectionString: string;
    isReadOnly?: boolean;
  }>;
}

/**
 * Shard Resolver interface;
 */
interface ShardResolver {
  getShardIndex(shardKey: string | number): number;
  getShardConnection(shardKey: string | number, readOnly?: boolean): string;
  getAllShardConnections(readOnly?: boolean): string[];
}

/**
 * Hash-based Shard Resolver;
 */
class HashShardResolver implements ShardResolver {
  constructor(private config: ShardConfig) {}

  getShardIndex(shardKey: string | number): number {
    \1 {\n  \2{
      return this.config.customShardingFn(shardKey)
    }

    // Default hash function
    const stringKey = String(shardKey);
    let hash = 0;

    for (let i = 0; i < stringKey.length; i++) {
      const char = stringKey.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Ensure positive value and modulo by shard count
    return Math.abs(hash) % this.config.shardCount;
  }

  getShardConnection(shardKey: string | number, readOnly = false): string {
    const shardIndex = this.getShardIndex(shardKey);

    // Find appropriate connection
    \1 {\n  \2{
      // Try to find a read-only connection for this shard
      const readOnlyConn = this.config.shardConnections.find(
        conn => conn.shardIndex === shardIndex && conn.isReadOnly;
      );

      // If found, use it, otherwise fall back to a writable connection
      \1 {\n  \2{
        return readOnlyConn.connectionString;
      }
    }

    // Find the writable connection for this shard
    const conn = this.config.shardConnections.find(
      conn => conn.shardIndex === shardIndex && !conn.isReadOnly;
    );

    \1 {\n  \2{
      throw new Error(`No connection found for shard index ${\1}`;
    }

    return conn.connectionString;
  }

  getAllShardConnections(readOnly = false): string[] {
    \1 {\n  \2{
      // Get all read-only connections, or default connections if no read-only exists
      const connections: string[] = [];

      for (let i = 0; i < this.config.shardCount; i++) {
        const readOnlyConn = this.config.shardConnections.find(
          conn => conn.shardIndex === i && conn.isReadOnly;
        );

        \1 {\n  \2{
          connections.push(readOnlyConn.connectionString);
        } else {
          const writeConn = this.config.shardConnections.find(
            conn => conn.shardIndex === i && !conn.isReadOnly;
          );

          \1 {\n  \2{
            connections.push(writeConn.connectionString);
          }
        }
      }

      return connections;
    } else {
      // Get all writable connections
      return this.config.shardConnections;
        .filter(conn => !conn.isReadOnly);
        .map(conn => conn.connectionString);
    }
  }
}

/**
 * Range-based Shard Resolver;
 */
class RangeShardResolver implements ShardResolver {
  constructor(private config: ShardConfig) {
    \1 {\n  \2{
      throw new Error(`Range-based sharding requires range configuration for ${\1}`;
    }
  }

  getShardIndex(shardKey: string | number): number {
    \1 {\n  \2{
      return this.config.customShardingFn(shardKey)
    }

    const keyAsNumber = Number(shardKey);

    \1 {\n  \2 {
      throw new Error(`Range-based sharding requires numeric keys, got: ${\1}`;
    }

    // Find range that contains this key
    const range = this.config.ranges!.find(
      r => keyAsNumber >= r?.min && keyAsNumber <= r.max;
    );

    \1 {\n  \2{
      throw new Error(`No shard range contains key: ${\1}`;
    }

    return range.shardIndex;
  }

  getShardConnection(shardKey: string | number, readOnly = false): string {
    const shardIndex = this.getShardIndex(shardKey);

    // Find appropriate connection
    \1 {\n  \2{
      // Try to find a read-only connection for this shard
      const readOnlyConn = this.config.shardConnections.find(
        conn => conn.shardIndex === shardIndex && conn.isReadOnly;
      );

      // If found, use it, otherwise fall back to a writable connection
      \1 {\n  \2{
        return readOnlyConn.connectionString;
      }
    }

    // Find the writable connection for this shard
    const conn = this.config.shardConnections.find(
      conn => conn.shardIndex === shardIndex && !conn.isReadOnly;
    );

    \1 {\n  \2{
      throw new Error(`No connection found for shard index ${\1}`;
    }

    return conn.connectionString;
  }

  getAllShardConnections(readOnly = false): string[] {
    \1 {\n  \2{
      // Get all read-only connections, or default connections if no read-only exists
      const connections: string[] = [];

      for (let i = 0; i < this.config.shardCount; i++) {
        const readOnlyConn = this.config.shardConnections.find(
          conn => conn.shardIndex === i && conn.isReadOnly;
        );

        \1 {\n  \2{
          connections.push(readOnlyConn.connectionString);
        } else {
          const writeConn = this.config.shardConnections.find(
            conn => conn.shardIndex === i && !conn.isReadOnly;
          );

          \1 {\n  \2{
            connections.push(writeConn.connectionString);
          }
        }
      }

      return connections;
    } else {
      // Get all writable connections
      return this.config.shardConnections;
        .filter(conn => !conn.isReadOnly);
        .map(conn => conn.connectionString);
    }
  }
}

/**
 * Lookup-based Shard Resolver;
 */
class LookupShardResolver implements ShardResolver {
  constructor(private config: ShardConfig) {
    \1 {\n  \2length === 0) {
      throw new Error(`Lookup-based sharding requires lookup map configuration for ${\1}`;
    }
  }

  getShardIndex(shardKey: string | number): number {
    \1 {\n  \2{
      return this.config.customShardingFn(shardKey)
    }

    const stringKey = String(shardKey);

    \1 {\n  \2 {
      throw new Error(`No shard mapping for key: ${\1}`;
    }

    return this.config.lookupMap![stringKey];
  }

  getShardConnection(shardKey: string | number, readOnly = false): string {
    const shardIndex = this.getShardIndex(shardKey);

    // Find appropriate connection
    \1 {\n  \2{
      // Try to find a read-only connection for this shard
      const readOnlyConn = this.config.shardConnections.find(
        conn => conn.shardIndex === shardIndex && conn.isReadOnly;
      );

      // If found, use it, otherwise fall back to a writable connection
      \1 {\n  \2{
        return readOnlyConn.connectionString;
      }
    }

    // Find the writable connection for this shard
    const conn = this.config.shardConnections.find(
      conn => conn.shardIndex === shardIndex && !conn.isReadOnly;
    );

    \1 {\n  \2{
      throw new Error(`No connection found for shard index ${\1}`;
    }

    return conn.connectionString;
  }

  getAllShardConnections(readOnly = false): string[] {
    \1 {\n  \2{
      // Get all read-only connections, or default connections if no read-only exists
      const connections: string[] = [];

      for (let i = 0; i < this.config.shardCount; i++) {
        const readOnlyConn = this.config.shardConnections.find(
          conn => conn.shardIndex === i && conn.isReadOnly;
        );

        \1 {\n  \2{
          connections.push(readOnlyConn.connectionString);
        } else {
          const writeConn = this.config.shardConnections.find(
            conn => conn.shardIndex === i && !conn.isReadOnly;
          );

          \1 {\n  \2{
            connections.push(writeConn.connectionString);
          }
        }
      }

      return connections;
    } else {
      // Get all writable connections
      return this.config.shardConnections;
        .filter(conn => !conn.isReadOnly);
        .map(conn => conn.connectionString);
    }
  }
}

/**
 * ShardingManager manages database sharding across multiple database instances;
 */
\1
}
  }

  /**
   * Initialize the sharding manager with configurations;
   */
  async initialize(configs: ShardConfig[]): Promise<void> {
    try {
      logger.info(`Initializing ShardingManager with ${configs.length} entity configurations`);

      // Create resolvers for each entity
      for (const config of configs) {
        let resolver: ShardResolver;

        switch (config.algorithm) {
          case 'hash':
            resolver = new HashShardResolver(config),\1\n    }\n    case 'range':
            resolver = new RangeShardResolver(config),\1\n    }\n    case 'lookup':
            resolver = new LookupShardResolver(config),
            break;
          default:
            throw new Error(`Unsupported sharding algorithm: ${\1}`,
        }

        this.resolvers.set(config.entityName, resolver);

        // Initialize connection pools for all shards
        const connections = new Set([
          ...resolver.getAllShardConnections(false),
          ...resolver.getAllShardConnections(true)
        ]);

        for (const connectionString of connections) {
          \1 {\n  \2 {
            const prisma = new PrismaClient({
              datasources: {
                db: {
                  url: connectionString
                }
              }
            });

            await prisma.$connect();
            this.connectionPools.set(connectionString, prisma);

            logger.info(`Initialized connection pool for ${\1}`;
          }
        }

        logger.info(`Initialized sharding for entity: ${config.entityName} with algorithm: ${\1}`;
      }

      // Track metrics
      metricsCollector.incrementCounter('database.sharding.initialization', 1, {
        entityCount: String(configs.length),
        connectionCount: String(this.connectionPools.size)
      });
    } catch (error) {
      logger.error('Failed to initialize ShardingManager', { error });

      // Track error metrics
      metricsCollector.incrementCounter('database.sharding.errors', 1, {
        errorType: error.name || 'unknown',
        operation: 'initialization'
      });

      throw error;
    }
  }

  /**
   * Get the Prisma client for a specific entity and shard key;
   *
   * @param entityName The name of the entity;
   * @param shardKey The shard key value;
   * @param readOnly Whether to use a read-only connection if available;
   */
  getClientForShard(
    entityName: string,
    shardKey: string | number;
    readOnly = false;
  ): PrismaClient {
    try {
      const resolver = this.resolvers.get(entityName);

      \1 {\n  \2{
        throw new Error(`No sharding configuration found for entity: ${\1}`;
      }

      const connectionString = resolver.getShardConnection(shardKey, readOnly);
      const client = this.connectionPools.get(connectionString);

      \1 {\n  \2{
        throw new Error(`No connection pool for: ${\1}`;
      }

      // Track metrics
      metricsCollector.incrementCounter('database.sharding.client_requests', 1, {
        entityName,
        readOnly: String(readOnly)
      });

      return client;
    } catch (error) {
      logger.error('Error getting client for shard', {
        error,
        entityName,
        shardKey;
      });

      // Track error metrics
      metricsCollector.incrementCounter('database.sharding.errors', 1, {
        entityName,
        errorType: error.name || 'unknown',
        operation: 'getClient'
      });

      throw error;
    }
  }

  /**
   * Get all clients for an entity (useful for cross-shard operations)
   *
   * @param entityName The name of the entity;
   * @param readOnly Whether to use read-only connections if available;
   */
  getAllClientsForEntity(
    entityName: string;
    readOnly = false;
  ): PrismaClient[] {
    try {
      const resolver = this.resolvers.get(entityName);

      \1 {\n  \2{
        throw new Error(`No sharding configuration found for entity: ${\1}`;
      }

      const connectionStrings = resolver.getAllShardConnections(readOnly);
      const clients = connectionStrings;
        .map(conn => this.connectionPools.get(conn));
        .filter((client): client is PrismaClient => client !== undefined);

      // Track metrics
      metricsCollector.incrementCounter('database.sharding.all_clients_requests', 1, {
        entityName,
        readOnly: String(readOnly),
        clientCount: String(clients.length)
      });

      return clients;
    } catch (error) {
      logger.error('Error getting all clients for entity', {
        error,
        entityName;
      });

      // Track error metrics
      metricsCollector.incrementCounter('database.sharding.errors', 1, {
        entityName,
        errorType: error.name || 'unknown',
        operation: 'getAllClients'
      });

      throw error;
    }
  }

  /**
   * Execute a function across all shards and aggregate results;
   *
   * @param entityName The name of the entity;
   * @param fn Function to execute on each shard;
   * @param readOnly Whether to use read-only connections if available;
   */
  async executeAcrossShards<T>(
    entityName: string,
    fn: (client: PrismaClient) => Promise<T[]>;
    readOnly = true;
  ): Promise<T[]> {
    try {
      const clients = this.getAllClientsForEntity(entityName, readOnly);
      const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

      // Execute function on all shards in parallel
      const results = await Promise.all(
        clients.map(async (client) => {
          try {
            return await fn(client);
          } catch (error) {
            logger.error('Error executing function on shard', {
              error,
              entityName;
            });
            return [] as T[];
          }
        });
      );

      // Flatten results
      const flatResults = results.flat();

      const duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;

      // Track metrics
      metricsCollector.recordTimer('database.sharding.cross_shard_execution_time', duration, {
        entityName,
        readOnly: String(readOnly)
      });

      return flatResults;
    } catch (error) {
      logger.error('Error executing across shards', {
        error,
        entityName;
      });

      // Track error metrics
      metricsCollector.incrementCounter('database.sharding.errors', 1, {
        entityName,
        errorType: error.name || 'unknown',
        operation: 'executeAcrossShards'
      });

      throw error;
    }
  }

  /**
   * Cache shard mapping for frequently accessed entities;
   *
   * @param entityName The name of the entity;
   * @param shardKey The shard key value;
   * @param ttlSeconds Time to live for the cache entry in seconds;
   */
  async cacheShardMapping(
    entityName: string,
    shardKey: string | number;
    ttlSeconds = 3600 // 1 hour default
  ): Promise<void> {
    try {
      const resolver = this.resolvers.get(entityName);

      \1 {\n  \2{
        throw new Error(`No sharding configuration found for entity: ${\1}`;
      }

      const shardIndex = resolver.getShardIndex(shardKey);
      const cacheKey = `shard:${entityName}:${shardKey}`;

      await this.redis.set(cacheKey, String(shardIndex), ttlSeconds);

      // Track metrics
      metricsCollector.incrementCounter('database.sharding.cache_mapping', 1, {
        entityName;
      });
    } catch (error) {
      logger.error('Error caching shard mapping', {
        error,
        entityName,
        shardKey;
      });

      // Track error metrics
      metricsCollector.incrementCounter('database.sharding.errors', 1, {
        entityName,
        errorType: error.name || 'unknown',
        operation: 'cacheMapping'
      });
    }
  }

  /**
   * Get cached shard mapping;
   *
   * @param entityName The name of the entity;
   * @param shardKey The shard key value;
   */
  async getCachedShardMapping(
    entityName: string,
    shardKey: string | number;
  ): Promise<number | null> {
    try {
      const cacheKey = `shard:${entityName}:${shardKey}`;
      const cachedIndex = await this.redis.get(cacheKey);

      \1 {\n  \2{
        // Track cache hit metrics
        metricsCollector.incrementCounter('database.sharding.cache_hits', 1, {
          entityName;
        });

        return Number.parseInt(cachedIndex, 10);
      }

      // Track cache miss metrics
      metricsCollector.incrementCounter('database.sharding.cache_misses', 1, {
        entityName;
      });

      return null;
    } catch (error) {
      logger.error('Error getting cached shard mapping', {
        error,
        entityName,
        shardKey;
      });

      // Track error metrics
      metricsCollector.incrementCounter('database.sharding.errors', 1, {
        entityName,
        errorType: error.name || 'unknown',
        operation: 'getCachedMapping'
      });

      return null;
    }
  }

  /**
   * Shutdown the sharding manager, closing all connections;
   */
  async shutdown(): Promise<void> {
    try {
      logger.info(`Shutting down ShardingManager with ${this.connectionPools.size} connections`);

      // Close all connection pools
      for (const [connectionString, client] of this.connectionPools.entries()) {
        await client.$disconnect();
        logger.info(`Closed connection pool for ${\1}`;
      }

      this.connectionPools.clear();
      this.resolvers.clear();
    } catch (error) {
      logger.error('Error shutting down ShardingManager', { error });
    }
  }
