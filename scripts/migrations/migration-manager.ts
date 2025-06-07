/**
 * Enterprise Database Migration Manager
 * Comprehensive migration system with rollback support and safety checks
 */

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

interface Migration {
  id: string;
  name: string;
  version: string;
  up: string;
  down: string;
  checksum: string;
  appliedAt?: Date;
  rolledBackAt?: Date;
}

interface MigrationRecord {
  id: string;
  name: string;
  version: string;
  checksum: string;
  appliedAt: Date;
  rolledBackAt?: Date;
  executionTime: number;
  status: 'SUCCESS' | 'FAILED' | 'ROLLED_BACK';
  errorMessage?: string;
}

class MigrationManager {
  private prisma: PrismaClient;
  private migrationsDir: string;
  private backupDir: string;

  constructor() {
    this.prisma = new PrismaClient();
    this.migrationsDir = path.join(process.cwd(), 'scripts/migrations/sql');
    this.backupDir = path.join(process.cwd(), 'scripts/migrations/backups');
  }

  async initialize(): Promise<void> {
    console.log('🚀 Initializing migration system...');
    
    // Create migrations table if it doesn't exist
    await this.createMigrationsTable();
    
    // Ensure directories exist
    await this.ensureDirectories();
    
    console.log('✅ Migration system initialized');
  }

  private async createMigrationsTable(): Promise<void> {
    await this.prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS _migration_history (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        version VARCHAR(50) NOT NULL,
        checksum VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        rolled_back_at TIMESTAMP NULL,
        execution_time INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'ROLLED_BACK')),
        error_message TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes for performance
    await this.prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_migration_history_version ON _migration_history(version);
    `;
    
    await this.prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_migration_history_status ON _migration_history(status);
    `;

    await this.prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_migration_history_applied_at ON _migration_history(applied_at);
    `;
  }

  private async ensureDirectories(): Promise<void> {
    try {
      await fs.mkdir(this.migrationsDir, { recursive: true });
      await fs.mkdir(this.backupDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directories:', error);
    }
  }

  async createMigration(name: string, upSql: string, downSql: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const version = `${timestamp}_${name.toLowerCase().replace(/\s+/g, '_')}`;
    const id = `migration_${version}`;

    const migrationContent = {
      id,
      name,
      version,
      up: upSql,
      down: downSql,
      checksum: this.generateChecksum(upSql + downSql),
      createdAt: new Date().toISOString(),
    };

    const migrationFile = path.join(this.migrationsDir, `${version}.json`);
    await fs.writeFile(migrationFile, JSON.stringify(migrationContent, null, 2));

    console.log(`✅ Migration created: ${migrationFile}`);
    return version;
  }

  async runMigrations(): Promise<void> {
    console.log('🔄 Running pending migrations...');
    
    const pendingMigrations = await this.getPendingMigrations();
    
    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations');
      return;
    }

    console.log(`📦 Found ${pendingMigrations.length} pending migration(s)`);

    for (const migration of pendingMigrations) {
      await this.runSingleMigration(migration);
    }

    console.log('✅ All migrations completed successfully');
  }

  private async runSingleMigration(migration: Migration): Promise<void> {
    const startTime = Date.now();
    console.log(`⚡ Running migration: ${migration.name} (${migration.version})`);

    // Create backup before migration
    const backupFile = await this.createBackup(migration.version);
    
    try {
      // Validate migration integrity
      const currentChecksum = this.generateChecksum(migration.up + migration.down);
      if (currentChecksum !== migration.checksum) {
        throw new Error(`Migration checksum mismatch for ${migration.version}`);
      }

      // Execute migration in transaction
      await this.prisma.$transaction(async (tx) => {
        // Split SQL by statements and execute each one
        const statements = this.splitSqlStatements(migration.up);
        
        for (const statement of statements) {
          if (statement.trim()) {
            await tx.$executeRawUnsafe(statement);
          }
        }
      });

      const executionTime = Date.now() - startTime;

      // Record successful migration
      await this.recordMigration({
        id: migration.id,
        name: migration.name,
        version: migration.version,
        checksum: migration.checksum,
        appliedAt: new Date(),
        executionTime,
        status: 'SUCCESS',
      });

      console.log(`✅ Migration completed: ${migration.name} (${executionTime}ms)`);

    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      console.error(`❌ Migration failed: ${migration.name}`);
      console.error(`Error: ${errorMessage}`);

      // Record failed migration
      await this.recordMigration({
        id: migration.id,
        name: migration.name,
        version: migration.version,
        checksum: migration.checksum,
        appliedAt: new Date(),
        executionTime,
        status: 'FAILED',
        errorMessage,
      });

      // Restore from backup
      console.log('🔄 Restoring from backup...');
      await this.restoreFromBackup(backupFile);
      
      throw error;
    }
  }

  async rollbackMigration(version: string): Promise<void> {
    console.log(`🔄 Rolling back migration: ${version}`);

    const migrationRecord = await this.getMigrationRecord(version);
    if (!migrationRecord) {
      throw new Error(`Migration record not found for version: ${version}`);
    }

    if (migrationRecord.status === 'ROLLED_BACK') {
      console.log(`⚠️ Migration ${version} is already rolled back`);
      return;
    }

    const migration = await this.loadMigration(version);
    if (!migration) {
      throw new Error(`Migration file not found for version: ${version}`);
    }

    // Create backup before rollback
    const backupFile = await this.createBackup(`rollback_${version}`);

    try {
      // Execute rollback in transaction
      await this.prisma.$transaction(async (tx) => {
        const statements = this.splitSqlStatements(migration.down);
        
        for (const statement of statements) {
          if (statement.trim()) {
            await tx.$executeRawUnsafe(statement);
          }
        }
      });

      // Update migration record
      await this.prisma.$executeRaw`
        UPDATE _migration_history 
        SET 
          status = 'ROLLED_BACK',
          rolled_back_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE version = ${version}
      `;

      console.log(`✅ Migration rolled back successfully: ${version}`);

    } catch (error) {
      console.error(`❌ Rollback failed for ${version}:`, error);
      
      // Restore from backup
      console.log('🔄 Restoring from backup...');
      await this.restoreFromBackup(backupFile);
      
      throw error;
    }
  }

  async rollbackToVersion(targetVersion: string): Promise<void> {
    console.log(`🔄 Rolling back to version: ${targetVersion}`);

    const appliedMigrations = await this.getAppliedMigrations();
    const migrationsToRollback = appliedMigrations.filter(
      migration => migration.version > targetVersion && migration.status === 'SUCCESS'
    ).sort((a, b) => b.version.localeCompare(a.version)); // Reverse order

    if (migrationsToRollback.length === 0) {
      console.log(`✅ Already at or before version: ${targetVersion}`);
      return;
    }

    console.log(`📦 Rolling back ${migrationsToRollback.length} migration(s)`);

    for (const migrationRecord of migrationsToRollback) {
      await this.rollbackMigration(migrationRecord.version);
    }

    console.log(`✅ Successfully rolled back to version: ${targetVersion}`);
  }

  private async getPendingMigrations(): Promise<Migration[]> {
    // Get all migration files
    const migrationFiles = await this.getMigrationFiles();
    
    // Get applied migrations
    const appliedVersions = await this.getAppliedVersions();
    
    // Filter pending migrations
    const pendingMigrations: Migration[] = [];
    
    for (const file of migrationFiles) {
      const migration = await this.loadMigration(file.replace('.json', ''));
      if (migration && !appliedVersions.includes(migration.version)) {
        pendingMigrations.push(migration);
      }
    }

    // Sort by version
    return pendingMigrations.sort((a, b) => a.version.localeCompare(b.version));
  }

  private async getMigrationFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.migrationsDir);
      return files.filter(file => file.endsWith('.json'));
    } catch (error) {
      return [];
    }
  }

  private async loadMigration(version: string): Promise<Migration | null> {
    try {
      const migrationFile = path.join(this.migrationsDir, `${version}.json`);
      const content = await fs.readFile(migrationFile, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error loading migration ${version}:`, error);
      return null;
    }
  }

  private async getAppliedVersions(): Promise<string[]> {
    const result = await this.prisma.$queryRaw<{ version: string }[]>`
      SELECT version FROM _migration_history 
      WHERE status = 'SUCCESS'
      ORDER BY version
    `;
    
    return result.map(row => row.version);
  }

  private async getAppliedMigrations(): Promise<MigrationRecord[]> {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT * FROM _migration_history 
      WHERE status IN ('SUCCESS', 'ROLLED_BACK')
      ORDER BY version
    `;
    
    return result.map(row => ({
      id: row.id,
      name: row.name,
      version: row.version,
      checksum: row.checksum,
      appliedAt: row.applied_at,
      rolledBackAt: row.rolled_back_at,
      executionTime: row.execution_time,
      status: row.status,
      errorMessage: row.error_message,
    }));
  }

  private async getMigrationRecord(version: string): Promise<MigrationRecord | null> {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT * FROM _migration_history 
      WHERE version = ${version}
      LIMIT 1
    `;
    
    if (result.length === 0) return null;
    
    const row = result[0];
    return {
      id: row.id,
      name: row.name,
      version: row.version,
      checksum: row.checksum,
      appliedAt: row.applied_at,
      rolledBackAt: row.rolled_back_at,
      executionTime: row.execution_time,
      status: row.status,
      errorMessage: row.error_message,
    };
  }

  private async recordMigration(record: MigrationRecord): Promise<void> {
    await this.prisma.$executeRaw`
      INSERT INTO _migration_history (
        id, name, version, checksum, applied_at, execution_time, status, error_message
      ) VALUES (
        ${record.id},
        ${record.name},
        ${record.version},
        ${record.checksum},
        ${record.appliedAt},
        ${record.executionTime},
        ${record.status},
        ${record.errorMessage || null}
      )
    `;
  }

  private async createBackup(identifier: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupFile = path.join(this.backupDir, `backup_${identifier}_${timestamp}.sql`);
    
    try {
      // Use pg_dump to create backup
      const dbUrl = process.env.DATABASE_URL;
      if (dbUrl) {
        execSync(`pg_dump "${dbUrl}" > "${backupFile}"`, { stdio: 'pipe' });
        console.log(`📦 Backup created: ${backupFile}`);
      } else {
        console.warn('⚠️ DATABASE_URL not found, skipping backup');
      }
    } catch (error) {
      console.warn('⚠️ Backup creation failed:', error);
    }
    
    return backupFile;
  }

  private async restoreFromBackup(backupFile: string): Promise<void> {
    try {
      const dbUrl = process.env.DATABASE_URL;
      if (dbUrl && await this.fileExists(backupFile)) {
        execSync(`psql "${dbUrl}" < "${backupFile}"`, { stdio: 'pipe' });
        console.log(`♻️ Database restored from backup: ${backupFile}`);
      } else {
        console.warn('⚠️ Backup file not found or DATABASE_URL missing');
      }
    } catch (error) {
      console.error('❌ Backup restoration failed:', error);
    }
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private splitSqlStatements(sql: string): string[] {
    // Split SQL by semicolons, but be careful with quoted strings
    const statements: string[] = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';
    
    for (let i = 0; i < sql.length; i++) {
      const char = sql[i];
      const prevChar = i > 0 ? sql[i - 1] : '';
      
      if ((char === '"' || char === "'") && prevChar !== '\\') {
        if (!inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inQuotes = false;
          quoteChar = '';
        }
      }
      
      if (char === ';' && !inQuotes) {
        if (current.trim()) {
          statements.push(current.trim());
          current = '';
        }
      } else {
        current += char;
      }
    }
    
    if (current.trim()) {
      statements.push(current.trim());
    }
    
    return statements;
  }

  private generateChecksum(content: string): string {
    // Simple checksum implementation - in production, use crypto
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  async getMigrationStatus(): Promise<{
    applied: MigrationRecord[];
    pending: Migration[];
    total: number;
  }> {
    const applied = await this.getAppliedMigrations();
    const pending = await this.getPendingMigrations();
    
    return {
      applied,
      pending,
      total: applied.length + pending.length,
    };
  }

  async cleanup(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// CLI Commands
export async function migrate(): Promise<void> {
  const manager = new MigrationManager();
  try {
    await manager.initialize();
    await manager.runMigrations();
  } finally {
    await manager.cleanup();
  }
}

export async function rollback(version?: string): Promise<void> {
  const manager = new MigrationManager();
  try {
    await manager.initialize();
    if (version) {
      await manager.rollbackToVersion(version);
    } else {
      // Rollback last migration
      const status = await manager.getMigrationStatus();
      const lastApplied = status.applied
        .filter(m => m.status === 'SUCCESS')
        .sort((a, b) => b.version.localeCompare(a.version))[0];
      
      if (lastApplied) {
        await manager.rollbackMigration(lastApplied.version);
      } else {
        console.log('No migrations to rollback');
      }
    }
  } finally {
    await manager.cleanup();
  }
}

export async function status(): Promise<void> {
  const manager = new MigrationManager();
  try {
    await manager.initialize();
    const migrationStatus = await manager.getMigrationStatus();
    
    console.log('\n📊 Migration Status:');
    console.log(`Total migrations: ${migrationStatus.total}`);
    console.log(`Applied: ${migrationStatus.applied.filter(m => m.status === 'SUCCESS').length}`);
    console.log(`Pending: ${migrationStatus.pending.length}`);
    console.log(`Failed: ${migrationStatus.applied.filter(m => m.status === 'FAILED').length}`);
    console.log(`Rolled back: ${migrationStatus.applied.filter(m => m.status === 'ROLLED_BACK').length}`);
    
    if (migrationStatus.pending.length > 0) {
      console.log('\n📦 Pending migrations:');
      migrationStatus.pending.forEach(migration => {
        console.log(`  - ${migration.version}: ${migration.name}`);
      });
    }
    
    if (migrationStatus.applied.length > 0) {
      console.log('\n✅ Applied migrations:');
      migrationStatus.applied
        .filter(m => m.status === 'SUCCESS')
        .sort((a, b) => b.version.localeCompare(a.version))
        .slice(0, 10) // Show last 10
        .forEach(migration => {
          console.log(`  - ${migration.version}: ${migration.name} (${migration.appliedAt})`);
        });
    }
  } finally {
    await manager.cleanup();
  }
}

export { MigrationManager };
export default MigrationManager;
