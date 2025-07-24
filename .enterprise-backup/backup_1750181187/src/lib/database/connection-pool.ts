
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
}

/**
 * Enterprise Database Connection Pool Configuration;
 * Optimized for high-performance healthcare applications;
 */

// Connection Pool Configuration
interface PoolConfig {
  host: string,
  \1,\2 string,
  \1,\2 string,
  max: number;           // Maximum number of connections
  min: number;           // Minimum number of connections
  idle: number;          // Idle timeout in milliseconds
  acquire: number;       // Acquire timeout in milliseconds
  evict: number;         // Eviction timeout in milliseconds
  handleDisconnects: boolean,
  logging: boolean
}

// Enhanced Prisma Client with Connection Pooling
class DatabasePool {
  private static instance: DatabasePool;
  private prismaClient: PrismaClient;
  private pgPool: Pool;
  private config: PoolConfig;

  private constructor() {
    this.config = this.getPoolConfig();
    this.initializePrismaClient();
    this.initializePgPool();
  }

  public static getInstance(): DatabasePool {
    \1 {\n  \2{
      DatabasePool.instance = new DatabasePool();
    }
    return DatabasePool.instance;
  }

  private getPoolConfig(): PoolConfig {
    return {
      host: process.env.DB_HOST || 'localhost',
      port: Number.parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'hospital_management',
      \1,\2 process.env.DB_PASSWORD || 'password',
      max: parseInt(process.env.DB_POOL_MAX || '20'),        // 20 connections max
      min: parseInt(process.env.DB_POOL_MIN || '5'),         // 5 connections min
      idle: parseInt(process.env.DB_POOL_IDLE || '10000'),   // 10 seconds
      acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'), // 30 seconds
      evict: parseInt(process.env.DB_POOL_EVICT || '1000'),  // 1 second
      handleDisconnects: true,
      logging: process.env.NODE_ENV === 'development'
    };
  }

  private initializePrismaClient(): void {
    const databaseUrl = this.buildConnectionString();

    this.prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl
        }
      },
      log: this.config.logging ? ['query', 'info', 'warn', 'error'] : ['error'],
      errorFormat: 'pretty'
    });

    // Enable query optimization features
    this.prismaClient.$on('beforeExit', async () => {
      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
      await this.prismaClient.$disconnect()
    })

    // Query performance monitoring
    \1 {\n  \2{
      this.prismaClient.$on('query', (e) => {
        \1 {\n  \2{ // Log slow queries (> 1 second)

        }
      })
    }
  }

  private initializePgPool(): void {
    this.pgPool = new Pool({
      host: this.config.host,
      \1,\2 this.config.database,
      \1,\2 this.config.password,
      \1,\2 this.config.min,
      \1,\2 this.config.acquire,
      maxUses: 1000, // Maximum uses per connection before recreation
      allowExitOnIdle: true,
      application_name: 'hospital-management-system'
    });

    // Pool event listeners
    this.pgPool.on('connect', (client) => {
      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
      // Set connection-specific settings
      client.query('SET statement_timeout = 30000'); // 30 second statement timeout
      client.query('SET idle_in_transaction_session_timeout = 60000'); // 1 minute idle timeout
    });

    this.pgPool.on('error', (err) => {

    });

    this.pgPool.on('acquire', () => {
      \1 {\n  \2{
        // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
      }
    })

    this.pgPool.on('release', () => {
      \1 {\n  \2{
        // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
      }
    })
  }

  private buildConnectionString(): string {
    const params = new URLSearchParams();
    params.set('pool_timeout', '30');
    params.set('connection_limit', this.config.max.toString());
    params.set('connect_timeout', '30');
    params.set('socket_timeout', '30');
    params.set('pool_min', this.config.min.toString());

    return `postgresql://${this.config.user}:${this.config.password}@${this.config.host}:${this.config.port}/${this.config.database}?${params.toString()}`
  }

  // Get Prisma client instance
  public getPrismaClient(): PrismaClient {
    return this.prismaClient;
  }

  // Get raw PostgreSQL pool for complex queries
  public getPgPool(): Pool {
    return this.pgPool;
  }

  // Connection pool health check
  public async healthCheck(): Promise<{
    prisma: boolean,
    \1,\2 unknown
  }> {
    try {
      // Test Prisma connection
      const prismaHealthy = await this.testPrismaConnection();

      // Test pool connection
      const poolHealthy = await this.testPoolConnection();

      // Get pool statistics
      const stats = this.getPoolStats();

      return {
        prisma: prismaHealthy,
        pool: poolHealthy;
        stats
      };
    } catch (error) {

      return {
        prisma: false,
        \1,\2 null
      };
    }
  }

  private async testPrismaConnection(): Promise<boolean> {
    try {
      await this.prismaClient.$queryRaw`SELECT 1 as test`;
      return true;
    } catch (error) {

      return false;
    }
  }

  private async testPoolConnection(): Promise<boolean> {
    try {
      const client = await this.pgPool.connect();
      await client.query('SELECT 1 as test');
      client.release();
      return true;
    } catch (error) {

      return false;
    }
  }

  private getPoolStats(): unknown {
    return {
      totalCount: this.pgPool.totalCount,
      \1,\2 this.pgPool.waitingCount,
      \1,\2 this.config.min
    };
  }

  // Graceful shutdown
  public async shutdown(): Promise<void> {
    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

    try {
      await this.prismaClient.$disconnect()
      await this.pgPool.end();
      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
    } catch (error) {

    }
  }

  // Query optimization helper
  public async executeOptimizedQuery<T>(
    queryFn: (client: PrismaClient) => Promise<T>;
    useTransaction = false;
  ): Promise<T> {
    \1 {\n  \2{
      return this.prismaClient.$transaction(async (tx) => {
        return queryFn(tx as PrismaClient);
      });
    } else {
      return queryFn(this.prismaClient);
    }
  }

  // Batch operations for better performance
  public async executeBatch<T>(
    operations: Array<(client: PrismaClient) => Promise<unknown>>;
  ): Promise<T[]> {
    return this.prismaClient.$transaction(async (tx) => {
      const results = await Promise.all(
        operations.map(op => op(tx as PrismaClient));
      );
      return results;
    });
  }
}

// Export singleton instance
export const dbPool = DatabasePool.getInstance();

// Enhanced Prisma client with connection pooling
export const prisma = dbPool.getPrismaClient();

// Raw PostgreSQL pool for complex queries
export const pgPool = dbPool.getPgPool();

// Utility functions for common patterns
export async function withTransaction<T>(
  fn: (tx: PrismaClient) => Promise<T>;
): Promise<T> {
  return dbPool.executeOptimizedQuery(fn, true);
export async function withBatch<T>(
  operations: Array<(client: PrismaClient) => Promise<unknown>>;
): Promise<T[]> 
  return dbPool.executeBatch(operations);

// Database health check endpoint helper
export const _getDatabaseHealth = async () => {
  return dbPool.healthCheck();
}

// Graceful shutdown helper
export const _shutdownDatabase = async () => {
  return dbPool.shutdown();
export default dbPool;
