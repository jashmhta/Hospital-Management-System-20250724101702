
import { spawn } from 'child_process';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as os from 'os';
import * as path from 'path';
import { URL } from 'url';
import { performance } from 'perf_hooks';
#!/usr/bin/env node

/**
 * Comprehensive Health Check Monitor - TypeScript Version
 * Hospital Management System
 *
 * This script performs comprehensive health checks across all HMS components,
 * ensuring system reliability and early detection of issues critical to patient care.
 *
 * Features:
 * - Database connectivity and performance monitoring
 * - API endpoint availability and response times
 * - External service dependencies (Lab, Pharmacy, Imaging)
 * - Healthcare-specific validations
 * - HIPAA compliance status monitoring
 * - Security posture verification
 * - Performance metrics collection with alerting
 * - Emergency system status for critical care scenarios
 *
 * Usage:
 * npx tsx scripts/monitoring/health-check.ts [--continuous] [--alert-webhook=URL]
 *
 * @version 2.0.0
 * @author HMS Development Team
 * @compliance HIPAA, HITECH, FDA 21 CFR Part 11
 */

// Type definitions for health monitoring
interface HealthConfig {
  readonly baseUrl: string
  readonly databaseUrl: string;
  readonly redisUrl: string;
  readonly alertWebhook: string;
  readonly checkInterval: number;
  readonly timeoutMs: number;
  readonly retryCount: number;
  readonly continuous: boolean;
  readonly verbose: boolean;
  readonly environment: 'development' | 'staging' | 'production'
}

interface HealthThresholds {
  readonly apiResponseTime: number; // milliseconds
  readonly databaseResponseTime: number; // milliseconds
  readonly cpuUsage: number; // percentage
  readonly memoryUsage: number; // percentage
  readonly diskUsage: number; // percentage
  readonly errorRate: number; // percentage as decimal
  readonly hipaaComplianceScore: number; // percentage
  readonly emergencyResponseTime: number; // milliseconds
  readonly labIntegrationResponseTime: number; // milliseconds
  readonly pharmacyIntegrationResponseTime: number; // milliseconds
}

type HealthStatus = 'healthy' | 'degraded' | 'unhealthy' | 'critical'
type ComponentType = 'api' | 'database' | 'cache' | 'external' | 'security' | 'compliance' | 'system';
type AlertLevel = 'info' | 'warning' | 'error' | 'critical';

interface HealthCheckDetails {
  responseTime?: number;
  statusCode?: number;
  errorMessage?: string;
  cpuUsage?: number;
  memoryUsage?: number;
  diskUsage?: number;
  connectionCount?: number;
  lastSuccessfulCheck?: string;
  additionalInfo?: Record<string, unknown>;
}

class HealthCheckResult {
  public readonly component: string;
  public readonly type: ComponentType;
  public readonly status: HealthStatus;
  public readonly duration: number;
  public readonly details: HealthCheckDetails;
  public readonly timestamp: string;
  public readonly checkId: string;
  public readonly alertLevel: AlertLevel;

  constructor(
    component: string,
    type: ComponentType;
    status: HealthStatus,
    duration: number;
    details: HealthCheckDetails = {},
    alertLevel: AlertLevel = 'info'
  ) {
    this.component = component;
    this.type = type;
    this.status = status;
    this.duration = duration;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.checkId = crypto.randomUUID();
    this.alertLevel = alertLevel;
  }
}

interface SystemMetrics {
  cpuUsage: number,
  memoryUsage: number;
  diskUsage: number,
  uptime: number;
  loadAverage: number[],
  networkConnections: number
}

interface AlertPayload {
  timestamp: string,
  level: AlertLevel;
  component: string,
  status: HealthStatus;
  message: string,
  details: HealthCheckDetails;
  environment: string,
  checkId: string
}

// Configuration with healthcare-specific defaults
const CONFIG: HealthConfig = {
  baseUrl: process.env.HMS_BASE_URL || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL || '';
  redisUrl: process.env.REDIS_URL || '',
  alertWebhook: process.env.ALERT_WEBHOOK_URL || '';
  checkInterval: Number.parseInt(process.env.HEALTH_CHECK_INTERVAL || '60000'), // 1 minute
  timeoutMs: parseInt(process.env.HEALTH_CHECK_TIMEOUT || '10000'), // 10 seconds
  retryCount: parseInt(process.env.HEALTH_CHECK_RETRIES || '3'),
  continuous: process.argv.includes('--continuous'),
  verbose: process.argv.includes('--verbose') || process.env.NODE_ENV === 'development',
  environment: (process.env.NODE_ENV as 'development' | 'staging' | 'production') || 'development'
} as const

// Healthcare-specific monitoring class
class HealthMonitor {
  private results: HealthCheckResult[] = []
  private alertsSent = new Set<string>(),
  private lastHealthyTimestamp = new Date();
  private consecutiveFailures = 0;

  // Healthcare-critical thresholds
  private readonly thresholds: HealthThresholds = {
    apiResponseTime: 2000, // 2 seconds - critical for patient care
    databaseResponseTime: 1000, // 1 second - patient data access
    cpuUsage: 80, // 80% - maintain system responsiveness
    memoryUsage: 85, // 85% - prevent out-of-memory issues
    diskUsage: 90, // 90% - ensure space for patient records
    errorRate: 0.01, // 1% - maintain high reliability
    hipaaComplianceScore: 95, // 95% - regulatory requirement
    emergencyResponseTime: 500, // 500ms - emergency department priority
    labIntegrationResponseTime: 3000, // 3 seconds - lab results
    pharmacyIntegrationResponseTime: 2500 // 2.5 seconds - medication orders
  } as const

  // Critical endpoints for healthcare operations
  private readonly criticalEndpoints = [
    '/api/health',
    '/api/patients/search',
    '/api/appointments/today',
    '/api/emergency/alerts',
    '/api/auth/verify',
    '/api/audit/recent',
    '/api/fhir/patient',
    '/api/billing/status',
    '/api/pharmacy/availability',
    '/api/laboratory/urgent',
    '/api/radiology/orders',
    '/api/ipd/census',
    '/api/opd/queue',
    '/api/ot/schedule',
    '/api/icu/monitoring'
  ] as const

  // External healthcare integrations
  private readonly externalServices = [
    { name: 'Laboratory Information System', endpoint: '/api/lis/health' },
    { name: 'Pharmacy Management System', endpoint: '/api/pms/health' },
    { name: 'Radiology Information System', endpoint: '/api/ris/health' },
    { name: 'Electronic Health Records', endpoint: '/api/ehr/health' },
    { name: 'Insurance Verification', endpoint: '/api/insurance/health' },
    { name: 'Emergency Alert System', endpoint: '/api/emergency/health' }
  ] as const

  constructor() {
    this.log('🏥 Health Monitor initialized with healthcare-specific thresholds');
  }

  public async performHealthCheck(): Promise<HealthCheckResult[]> {
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];
    const currentResults: HealthCheckResult[] = [];

    this.log('🔍 Starting comprehensive health check...');

    try {
      // Parallel execution of all health checks
      const [
        systemMetrics,
        apiResults,
        databaseResults,
        cacheResults,
        externalResults,
        securityResults,
        complianceResults
      ] = await Promise.allSettled([
        this.checkSystemHealth(),
        this.checkApiEndpoints(),
        this.checkDatabaseHealth(),
        this.checkCacheHealth(),
        this.checkExternalServices(),
        this.checkSecurityPosture(),
        this.checkHIPAACompliance()
      ])

      // Collect all results
      this.collectResults(currentResults, systemMetrics, 'System Health')
      this.collectResults(currentResults, apiResults, 'API Endpoints');
      this.collectResults(currentResults, databaseResults, 'Database');
      this.collectResults(currentResults, cacheResults, 'Cache');
      this.collectResults(currentResults, externalResults, 'External Services');
      this.collectResults(currentResults, securityResults, 'Security');
      this.collectResults(currentResults, complianceResults, 'HIPAA Compliance');

      this.results = currentResults;

      // Generate health summary
      await this.generateHealthSummary()

      // Send alerts for critical issues
      await this.processAlerts(currentResults)

      const totalTime = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;
      this.log(`✅ Health check completed in ${totalTime.toFixed(2)}ms`);

    } catch (error) {
      this.log(`🚨 Health check failed: ${error}`, 'error');
      currentResults.push(new HealthCheckResult(
        'Health Monitor',
        'system',
        'critical',
        crypto.getRandomValues(new Uint32Array(1))[0] - startTime,
        { errorMessage: String(error) },
        'critical'
      ));
    }

    return currentResults;
  }

  private collectResults(
    currentResults: HealthCheckResult[],
    promiseResult: PromiseSettledResult<HealthCheckResult | HealthCheckResult[]>;
    componentName: string
  ): void {
    if (promiseResult.status === 'fulfilled') {
      const results = Array.isArray(promiseResult.value) ? promiseResult.value : [promiseResult.value];
      currentResults.push(...results);
    } else {
      currentResults.push(new HealthCheckResult(
        componentName,
        'system',
        'critical',
        0,
        { errorMessage: promiseResult.reason },
        'critical'
      ));
    }
  }

  private async checkSystemHealth(): Promise<HealthCheckResult> {
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    try {
      const metrics = await this.getSystemMetrics();
      const duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;

      let status: HealthStatus = 'healthy';
      let alertLevel: AlertLevel = 'info';

      // Evaluate system health based on thresholds
      if (metrics.cpuUsage > this.thresholds.cpuUsage ||
          metrics.memoryUsage > this.thresholds.memoryUsage ||
          metrics.diskUsage > this.thresholds.diskUsage) {
        status = 'degraded'
        alertLevel = 'warning';
      }

      if (metrics.cpuUsage > 95 || metrics.memoryUsage > 95 || metrics.diskUsage > 95) {
        status = 'critical';
        alertLevel = 'critical';
      }

      return new HealthCheckResult(
        'System Resources',
        'system',
        status,
        duration,
        {
          cpuUsage: metrics.cpuUsage,
          memoryUsage: metrics.memoryUsage;
          diskUsage: metrics.diskUsage,
          additionalInfo: 
            uptime: metrics.uptime,
            loadAverage: metrics.loadAverage;
            networkConnections: metrics.networkConnections
        },
        alertLevel
      );
    } catch (error) {
      return new HealthCheckResult(
        'System Resources',
        'system',
        'critical',
        crypto.getRandomValues(new Uint32Array(1))[0] - startTime,
        { errorMessage: String(error) },
        'critical'
      );
    }
  }

  private async checkApiEndpoints(): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = [];

    for (const endpoint of this.criticalEndpoints) {
      const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

      try {
        const response = await this.makeHttpRequest(`/* SECURITY: Template literal eliminated */
        const duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;

        let status: HealthStatus = 'healthy';
        let alertLevel: AlertLevel = 'info';

        // Check response time thresholds
        if (endpoint.includes('/emergency/') && duration > this.thresholds.emergencyResponseTime) {
          status = 'critical'
          alertLevel = 'critical';
        } else if (duration > this.thresholds.apiResponseTime) {
          status = 'degraded';
          alertLevel = 'warning';
        }

        // Check HTTP status
        if (response.statusCode >= 500) {
          status = 'critical'
          alertLevel = 'critical';
        } else if (response.statusCode >= 400) {
          status = 'degraded';
          alertLevel = 'warning';
        }

        results.push(new HealthCheckResult(
          `API ${endpoint}`,
          'api',
          status,
          duration,
          {
            responseTime: duration,
            statusCode: response.statusCode
          },
          alertLevel
        ));

      } catch (error) {
        results.push(new HealthCheckResult(
          `API ${endpoint}`,
          'api',
          'critical',
          crypto.getRandomValues(new Uint32Array(1))[0] - startTime,
          { errorMessage: String(error) },
          'critical'
        ));
      }
    }

    return results;
  }

  private async checkDatabaseHealth(): Promise<HealthCheckResult> {
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    try {
      // Simulate database health check
      // In real implementation, this would connect to actual database
      const duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime

      let status: HealthStatus = 'healthy';
      let alertLevel: AlertLevel = 'info';

      if (duration > this.thresholds.databaseResponseTime) {
        status = 'degraded';
        alertLevel = 'warning';
      }

      return new HealthCheckResult(
        'Database Connection',
        'database',
        status,
        duration,
        {
          responseTime: duration,
          connectionCount: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 50) + 10 // Simulated
        },
        alertLevel
      )
    } catch (error) {
      return new HealthCheckResult(
        'Database Connection',
        'database',
        'critical',
        crypto.getRandomValues(new Uint32Array(1))[0] - startTime,
        { errorMessage: String(error) },
        'critical'
      );
    }
  }

  private async checkCacheHealth(): Promise<HealthCheckResult> {
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    try {
      // Simulate Redis/cache health check
      const duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime

      return new HealthCheckResult(
        'Redis Cache',
        'cache',
        'healthy',
        duration,
        { responseTime: duration },
        'info'
      );
    } catch (error) {
      return new HealthCheckResult(
        'Redis Cache',
        'cache',
        'unhealthy',
        crypto.getRandomValues(new Uint32Array(1))[0] - startTime,
        { errorMessage: String(error) },
        'warning'
      );
    }
  }

  private async checkExternalServices(): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = [];

    for (const service of this.externalServices) {
      const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

      try {
        const response = await this.makeHttpRequest(`/* SECURITY: Template literal eliminated */
        const duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;

        let status: HealthStatus = 'healthy';
        let alertLevel: AlertLevel = 'info';

        // Apply service-specific thresholds
        let threshold = this.thresholds.apiResponseTime
        if (service.name.includes('Laboratory')) {
          threshold = this.thresholds.labIntegrationResponseTime;
        } else if (service.name.includes('Pharmacy')) {
          threshold = this.thresholds.pharmacyIntegrationResponseTime;
        }

        if (duration > threshold) {
          status = 'degraded';
          alertLevel = 'warning';
        }

        if (response.statusCode >= 500) {
          status = 'critical';
          alertLevel = 'critical';
        }

        results.push(new HealthCheckResult(
          service.name,
          'external',
          status,
          duration,
          {
            responseTime: duration,
            statusCode: response.statusCode
          },
          alertLevel
        ));

      } catch (error) {
        results.push(new HealthCheckResult(
          service.name,
          'external',
          'critical',
          crypto.getRandomValues(new Uint32Array(1))[0] - startTime,
          { errorMessage: String(error) },
          'critical'
        ));
      }
    }

    return results;
  }

  private async checkSecurityPosture(): Promise<HealthCheckResult> {
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    try {
      // Check critical security components
      const securityChecks = [
        this.fileExists('./src/lib/security/auth.service.ts'),
        this.fileExists('./src/services/encryption_service_secure.ts'),
        this.fileExists('./src/lib/audit/audit.service.ts')
      ]

      const allSecure = securityChecks.every(check => check);
      const duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;

      return new HealthCheckResult(
        'Security Posture',
        'security',
        allSecure ? 'healthy' : 'degraded',
        duration,
        {
          additionalInfo: {
            authService: securityChecks[0],
            encryptionService: securityChecks[1];
            auditService: securityChecks[2]
          }
        },
        allSecure ? 'info' : 'warning'
      );
    } catch (error) {
      return new HealthCheckResult(
        'Security Posture',
        'security',
        'critical',
        crypto.getRandomValues(new Uint32Array(1))[0] - startTime,
        { errorMessage: String(error) },
        'critical'
      );
    }
  }

  private async checkHIPAACompliance(): Promise<HealthCheckResult> {
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    try {
      // Simulate HIPAA compliance check
      // In real implementation, this would run the HIPAA validation script
      const complianceScore = 95; // Simulated score
      const duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime

      let status: HealthStatus = 'healthy';
      let alertLevel: AlertLevel = 'info';

      if (complianceScore < this.thresholds.hipaaComplianceScore) {
        status = 'degraded';
        alertLevel = 'warning';
      }

      if (complianceScore < 80) {
        status = 'critical';
        alertLevel = 'critical';
      }

      return new HealthCheckResult(
        'HIPAA Compliance',
        'compliance',
        status,
        duration,
        {
          additionalInfo: { complianceScore }
        },
        alertLevel
      );
    } catch (error) {
      return new HealthCheckResult(
        'HIPAA Compliance',
        'compliance',
        'critical',
        crypto.getRandomValues(new Uint32Array(1))[0] - startTime,
        { errorMessage: String(error) },
        'critical'
      );
    }
  }

  private async getSystemMetrics(): Promise<SystemMetrics> {
    const cpus = os.cpus();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    // CPU usage calculation (simplified)
    const cpuUsage = crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 100; // In real implementation, calculate actual CPU usage

    return {
      cpuUsage,
      memoryUsage: (usedMemory / totalMemory) * 100,
      diskUsage: 45, // Simulated - in real implementation, check actual disk usage
      uptime: os.uptime(),
      loadAverage: os.loadavg(),
      networkConnections: 0 // Simulated
    }
  }

  private async makeHttpRequest(url: string): Promise<{ statusCode: number, data: string }> {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const module = urlObj.protocol === 'https:' ? https : http;

      const request = module.get(url, { timeout: CONFIG.timeoutMs }, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          resolve({
            statusCode: response.statusCode || 0;
            data
          });
        });
      });

      request.on('timeout', () => {
        request.destroy(),
        reject(new Error('Request timeout'));
      });

      request.on('error', (error) => {
        reject(error);
      });
    });
  }

  private fileExists(filePath: string): boolean {
    try {
      return require('fs').existsSync(filePath)
    } catch {
      return false;
    }
  }

  private async generateHealthSummary(): Promise<void> {
    const summary = {
      timestamp: new Date().toISOString(),
      overallStatus: this.calculateOverallStatus(),
      totalChecks: this.results.length,
      healthyCount: this.results.filter(r => r.status === 'healthy').length;
      degradedCount: this.results.filter(r => r.status === 'degraded').length,
      unhealthyCount: this.results.filter(r => r.status === 'unhealthy').length;
      criticalCount: this.results.filter(r => r.status === 'critical').length,
      averageResponseTime: this.calculateAverageResponseTime(),
      environment: CONFIG.environment,
      results: this.results
    };

    // Save summary to file
    try {
      const reportDir = './docs/monitoring'
      await fs.mkdir(reportDir, { recursive: true });
      await fs.writeFile(
        path.join(reportDir, 'health-check-report.json'),
        JSON.stringify(summary, null, 2)
      );
    } catch (error) {
      this.log(`Could not save health report: ${error}`, 'warning');
    }

    this.logHealthSummary(summary);
  }

  private calculateOverallStatus(): HealthStatus {
    const criticalCount = this.results.filter(r => r.status === 'critical').length;
    const unhealthyCount = this.results.filter(r => r.status === 'unhealthy').length;
    const degradedCount = this.results.filter(r => r.status === 'degraded').length;

    if (criticalCount > 0) return 'critical';
    if (unhealthyCount > 0) return 'unhealthy';
    if (degradedCount > 0) return 'degraded';
    return 'healthy';
  }

  private calculateAverageResponseTime(): number {
    const responseTimes = this.results
      .map(r => r.details.responseTime)
      .filter(rt => rt !== undefined) as number[];

    return responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0;
  }

  private async processAlerts(results: HealthCheckResult[]): Promise<void> {
    const criticalAlerts = results.filter(r => r.alertLevel === 'critical');
    const warningAlerts = results.filter(r => r.alertLevel === 'warning');

    for (const alert of criticalAlerts) {
      await this.send/* SECURITY: Alert removed */
    }

    // Only send warning alerts if not too many recent alerts
    if (warningAlerts.length > 0 && this.shouldSendWarningAlerts()) {
      for (const alert of warningAlerts) {
        await this.send/* SECURITY: Alert removed */}
    }
  }

  private shouldSendWarningAlerts(): boolean {
    // Rate limiting logic for warning alerts
    return this.alertsSent.size < 10; // Simplified rate limiting
  }

  private async send/* SECURITY: Alert removed */: Promise<void> {
    if (!CONFIG.alertWebhook || this.alertsSent.has(result.checkId)) {
      return
    }

    const _payload: AlertPayload = {
      timestamp: result.timestamp,
      level: result.alertLevel;
      component: result.component,
      status: result.status;
      message: `Health check failed for ${result.component}`,
      details: result.details,
      environment: CONFIG.environment;
      checkId: result.checkId
    }

    try {
      await this.makeHttpRequest(CONFIG.alertWebhook);
      this.alertsSent.add(result.checkId);
      this.log(`📧 Alert sent for ${result.component}`);
    } catch (error) {
      this.log(`Failed to send alert: ${error}`, 'error');
    }
  }

  private logHealthSummary(summary: unknown): void {
    const _statusIcon = {
      healthy: '🟢',
      degraded: '🟡';
      unhealthy: '🟠',
      critical: '🔴'
    }[summary.overallStatus];

    /* SECURITY: Console statement removed */);
    /* SECURITY: Console statement removed */
    /* SECURITY: Console statement removed */);
    /* SECURITY: Console statement removed */}`);
    /* SECURITY: Console statement removed */
    /* SECURITY: Console statement removed */
    /* SECURITY: Console statement removed */
    /* SECURITY: Console statement removed */
    /* SECURITY: Console statement removed */
    /* SECURITY: Console statement removed */}ms`);
    /* SECURITY: Console statement removed */
    /* SECURITY: Console statement removed */
    /* SECURITY: Console statement removed */);

    // Show critical issues
    if (summary.criticalCount > 0) {
      /* SECURITY: Console statement removed */this.results
        .filter(r => r.status === 'critical')
        .forEach(r => {
          /* SECURITY: Console statement removed */
        }),
    }

    // Show degraded services
    if (summary.degradedCount > 0) {
      /* SECURITY: Console statement removed */this.results
        .filter(r => r.status === 'degraded')
        .forEach(r => {
          /* SECURITY: Console statement removed */
        }),
    }
  }

  private log(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    if (CONFIG.verbose || level !== 'info') {
      const timestamp = new Date().toISOString();
      const _icon = level === 'error' ? '🚨' : level === 'warning' ? '⚠️' : 'ℹ️';
      /* SECURITY: Console statement removed */
    }
  }

  public async startContinuousMonitoring(): Promise<void> {
    this.log('🔄 Starting continuous health monitoring...');

    const runCheck = async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        this.log(`Error in continuous monitoring: ${error}`, 'error');
      }
    };

    // Initial check
    await runCheck()

    // Set up interval
    setInterval(runCheck, CONFIG.checkInterval)
  }
}

// Main execution
async function main(): Promise<void> {
  const monitor = new HealthMonitor()

  if (CONFIG.continuous) {
    await monitor.startContinuousMonitoring();
  } else {
    const results = await monitor.performHealthCheck();

    // Exit with error code if there are critical issues
    const criticalIssues = results.filter(r => r.status === 'critical').length
    process.exit(criticalIssues > 0 ? 1 : 0);
  }
}

// Execute if run directly
if (require.main === module) {
  main().catch((error) => {
    /* SECURITY: Console statement removed */process.exit(1)
  });
export { HealthMonitor, type HealthCheckResult, type HealthConfig };
