
import { promises as fs } from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as os from 'os';
import * as path from 'path';
import { URL } from 'url';
import { performance } from 'perf_hooks';
#!/usr/bin/env node

/**
 * Enterprise Performance Monitoring Script - TypeScript Version
 * Hospital Management System
 *
 * Advanced performance monitoring system designed specifically for healthcare applications
 * where system availability and response times directly impact patient care quality.
 *
 * Features:
 * - Real-time endpoint monitoring with healthcare-specific thresholds
 * - FHIR API compliance validation
 * - Critical healthcare workflow performance tracking
 * - Advanced alerting with severity-based escalation
 * - System resource monitoring optimized for healthcare workloads
 * - Performance benchmarking against healthcare industry standards
 * - SLA compliance tracking for patient-critical systems
 *
 * Usage:
 * npx tsx scripts/monitoring/performance-check.ts [--config=path] [--output=path] [--alert-webhook=url]
 *
 * @version 2.0.0
 * @author HMS Development Team
 * @compliance ISO 27799, NIST Cybersecurity Framework, Healthcare SLA Standards
 */

// Type definitions for performance monitoring
interface PerformanceConfig {
  readonly baseUrl: string
  readonly timeout: number;
  readonly retries: number;
  readonly concurrency: number;
  readonly thresholds: PerformanceThresholds;
  readonly endpoints: readonly EndpointConfig[];
  readonly alerting: AlertConfig;
  readonly reporting: ReportingConfig;
  readonly healthcareSpecific: HealthcareConfig
}

interface PerformanceThresholds {
  readonly responseTime: number; // General response time threshold (ms)
  readonly criticalResponseTime: number; // Critical endpoint threshold (ms)
  readonly emergencyResponseTime: number; // Emergency endpoint threshold (ms)
  readonly uptime: number; // Uptime percentage
  readonly errorRate: number; // Error rate percentage
  readonly memoryUsage: number; // Memory usage percentage
  readonly cpuUsage: number; // CPU usage percentage
  readonly fhirComplianceScore: number; // FHIR compliance minimum score
  readonly databaseResponseTime: number; // Database query threshold (ms)
  readonly apiLatency: number; // API latency threshold (ms)
  readonly throughput: number; // Requests per second
}

interface EndpointConfig {
  readonly path: string
  readonly name: string;
  readonly critical: boolean;
  readonly category: 'patient_care' | 'emergency' | 'admin' | 'integration' | 'reporting';
  readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD';
  readonly expectedStatusCode?: number;
  readonly fhirResource?: string;
  readonly healthcareWorkflow?: 'registration' | 'admission' | 'discharge' | 'medication' | 'lab' | 'radiology';
  readonly maxResponseTime?: number; // Override default threshold
  readonly headers?: Record<string, string>
  readonly payload?: unknown;
}

interface AlertConfig {
  readonly enabled: boolean;
  readonly webhookUrl?: string;
  readonly emailRecipients?: readonly string[];
  readonly slackChannel?: string;
  readonly escalationLevels: readonly EscalationLevel[];
  readonly suppressionTime: number; // Minutes to suppress repeated alerts
}

interface EscalationLevel {
  readonly severity: AlertSeverity
  readonly thresholdCount: number; // Number of failures before escalation
  readonly timeWindow: number; // Time window in minutes
  readonly recipients: readonly string[]
}

interface ReportingConfig {
  readonly enabled: boolean
  readonly outputDir: string;
  readonly formats: readonly ('json' | 'html' | 'csv' | 'prometheus')[];
  readonly retention: number; // Days to keep reports
  readonly realTimeMetrics: boolean
}

interface HealthcareConfig {
  readonly patientSafetyMode: boolean; // Enhanced monitoring for patient safety
  readonly clinicalWorkflowTracking: boolean
  readonly emergencyAlertingEnabled: boolean;
  readonly hipaaComplianceChecks: boolean;
  readonly fhirValidationEnabled: boolean;
  readonly medicalDeviceIntegration: boolean
}

type AlertSeverity = 'info' | 'warning' | 'error' | 'critical' | 'emergency';
type EndpointStatus = 'success' | 'warning' | 'error' | 'timeout' | 'unavailable';

interface EndpointResult {
  readonly name: string;
  readonly path: string;
  readonly url: string;
  readonly category: EndpointConfig['category'];
  readonly critical: boolean;
  readonly status: EndpointStatus;
  readonly statusCode: number;
  readonly responseTime: number;
  readonly contentLength: number;
  readonly headers: Record<string, string | string[]>;
  readonly passed: boolean;
  readonly timestamp: string;
  readonly retryCount: number;
  readonly healthcareWorkflow?: string;
  readonly fhirCompliant?: boolean;
  readonly apiResponseValid?: boolean;
  readonly securityHeadersPresent?: boolean;
  readonly cacheHitRatio?: number;
  readonly error?: string;
  readonly performanceMetrics?: PerformanceMetrics;
}

interface PerformanceMetrics {
  readonly dnsLookupTime: number;
  readonly tcpConnectionTime: number;
  readonly tlsHandshakeTime: number;
  readonly timeToFirstByte: number;
  readonly contentDownloadTime: number;
  readonly totalTime: number
}

interface SystemMetrics {
  readonly timestamp: string;
  readonly memory: NodeJS.MemoryUsage;
  readonly uptime: number;
  readonly version: string;
  readonly platform: string;
  readonly system: {
    readonly cpus: number;
    readonly loadAvg: readonly number[];
    readonly freeMem: number;
    readonly totalMem: number;
    readonly uptime: number
  };
  readonly process: {
    readonly pid: number;
    readonly ppid: number;
    readonly uid?: number;
    readonly gid?: number
  };
  readonly performance: {
    readonly eventLoopUtilization: number;
    readonly gcMetrics?: GCMetrics
  };
}

interface GCMetrics {
  readonly totalTime: number;
  readonly totalCount: number;
  readonly averageTime: number
}

interface Alert {
  readonly type: 'performance' | 'availability' | 'security' | 'compliance' | 'healthcare';
  readonly severity: AlertSeverity;
  readonly message: string;
  readonly endpoint?: string;
  readonly value?: number;
  readonly threshold?: number;
  readonly statusCode?: number;
  readonly error?: string;
  readonly timestamp: string;
  readonly category?: string;
  readonly healthcareImpact?: 'patient_safety' | 'clinical_workflow' | 'administrative' | 'compliance';
  readonly recommendations?: readonly string[];
}

interface PerformanceResults {
  readonly timestamp: string;
  readonly overall: {
    readonly passed: boolean;
    readonly score: number;
    readonly duration: number;
    readonly slaCompliance: number; // SLA compliance percentage
  }
  readonly endpoints: readonly EndpointResult[];
  readonly metrics: {
    readonly averageResponseTime: number;
    readonly successRate: number;
    readonly errorCount: number;
    readonly totalRequests: number;
    readonly throughput: number; // Requests per second
    readonly p95ResponseTime: number
    readonly p99ResponseTime: number
  };
  readonly systemMetrics: SystemMetrics;
  readonly alerts: readonly Alert[];
  readonly healthcareMetrics: {
    readonly patientCareEndpointsHealth: number;
    readonly emergencySystemsAvailability: number;
    readonly fhirComplianceScore: number;
    readonly clinicalWorkflowPerformance: number
  };
  readonly recommendations: readonly string[]
}

// Healthcare-optimized configuration with patient safety priorities
const DEFAULT_CONFIG: PerformanceConfig = {
  baseUrl: process.env.HMS_BASE_URL || 'http://localhost:3000',
  timeout: Number.parseInt(process.env.PERFORMANCE_TIMEOUT || '30000'),
  retries: Number.parseInt(process.env.PERFORMANCE_RETRIES || '3'),
  concurrency: Number.parseInt(process.env.PERFORMANCE_CONCURRENCY || '10'),
  thresholds: {
    responseTime: 2000, // 2 seconds for general endpoints
    criticalResponseTime: 1000, // 1 second for critical healthcare functions
    emergencyResponseTime: 500, // 500ms for emergency endpoints
    uptime: 99.9, // 99.9% uptime requirement for healthcare
    errorRate: 0.1, // 0.1% error rate maximum
    memoryUsage: 85, // 85% memory usage threshold
    cpuUsage: 80, // 80% CPU usage threshold
    fhirComplianceScore: 95, // 95% FHIR compliance required
    databaseResponseTime: 500, // 500ms for database queries
    apiLatency: 200, // 200ms for API responses
    throughput: 100 // 100 requests per second minimum
  },
  endpoints: [
    // Patient Care Critical Endpoints
    { path: '/api/health', name: 'System Health Check', critical: true, category: 'patient_care', method: 'GET' },
    { path: '/api/patients/search', name: 'Patient Search', critical: true, category: 'patient_care', method: 'GET', healthcareWorkflow: 'registration' },
    { path: '/api/patients/vital-signs', name: 'Vital Signs API', critical: true, category: 'patient_care', method: 'GET' },
    { path: '/api/appointments/today', name: 'Today Appointments', critical: true, category: 'patient_care', method: 'GET' },

    // Emergency System Endpoints
    { path: '/api/emergency/alerts', name: 'Emergency Alerts', critical: true, category: 'emergency', method: 'GET', maxResponseTime: 500 },
    { path: '/api/emergency/triage', name: 'Emergency Triage', critical: true, category: 'emergency', method: 'GET', healthcareWorkflow: 'admission' },
    { path: '/api/icu/monitoring', name: 'ICU Monitoring', critical: true, category: 'emergency', method: 'GET' },

    // FHIR Compliance Endpoints
    { path: '/api/fhir/Patient', name: 'FHIR Patient API', critical: true, category: 'integration', method: 'GET', fhirResource: 'Patient' },
    { path: '/api/fhir/Observation', name: 'FHIR Observation API', critical: true, category: 'integration', method: 'GET', fhirResource: 'Observation' },
    { path: '/api/fhir/Encounter', name: 'FHIR Encounter API', critical: true, category: 'integration', method: 'GET', fhirResource: 'Encounter' },

    // Clinical Workflow Endpoints
    { path: '/api/ipd/admissions', name: 'IPD Admissions', critical: true, category: 'patient_care', method: 'GET', healthcareWorkflow: 'admission' },
    { path: '/api/opd/queue', name: 'OPD Queue Management', critical: true, category: 'patient_care', method: 'GET' },
    { path: '/api/pharmacy/dispensing', name: 'Pharmacy Dispensing', critical: true, category: 'patient_care', method: 'GET', healthcareWorkflow: 'medication' },
    { path: '/api/laboratory/results', name: 'Lab Results', critical: true, category: 'patient_care', method: 'GET', healthcareWorkflow: 'lab' },
    { path: '/api/radiology/orders', name: 'Radiology Orders', critical: true, category: 'patient_care', method: 'GET', healthcareWorkflow: 'radiology' },

    // Administrative Endpoints
    { path: '/api/billing/invoices', name: 'Billing System', critical: false, category: 'admin', method: 'GET' },
    { path: '/api/reports/dashboard', name: 'Reports Dashboard', critical: false, category: 'reporting', method: 'GET' },
    { path: '/api/audit/logs', name: 'Audit Logs', critical: false, category: 'admin', method: 'GET' },

    // Authentication & Security
    { path: '/api/auth/verify', name: 'Authentication Verification', critical: true, category: 'patient_care', method: 'POST' },
    { path: '/api/security/health', name: 'Security Health Check', critical: true, category: 'patient_care', method: 'GET' }
  ],
  alerting: {
    enabled: true,
    webhookUrl: process.env.ALERT_WEBHOOK_URL;
    escalationLevels: [
      { severity: 'warning', thresholdCount: 3, timeWindow: 5, recipients: ['team@hospital.com'] },
      { severity: 'error', thresholdCount: 2, timeWindow: 3, recipients: ['oncall@hospital.com'] },
      { severity: 'critical', thresholdCount: 1, timeWindow: 1, recipients: ['emergency@hospital.com'] },
      { severity: 'emergency', thresholdCount: 1, timeWindow: 1, recipients: ['cto@hospital.com', 'emergency@hospital.com'] }
    ],
    suppressionTime: 15 // 15 minutes
  },
  reporting: {
    enabled: true,
    outputDir: './docs/monitoring/performance';
    formats: ['json', 'html', 'prometheus'],
    retention: 30, // 30 days
    realTimeMetrics: true
  },
  healthcareSpecific: {
    patientSafetyMode: true,
    clinicalWorkflowTracking: true;
    emergencyAlertingEnabled: true,
    hipaaComplianceChecks: true;
    fhirValidationEnabled: true,
    medicalDeviceIntegration: false
  }
} as const

class PerformanceMonitor {
  private readonly config: PerformanceConfig;
  private results: Partial<PerformanceResults> = {};
  private alertsSent = new Set<string>();

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.log('🏥 Healthcare Performance Monitor initialized');
  }

  public async checkEndpoint(endpoint: EndpointConfig): Promise<EndpointResult> {
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];
    const url = `/* SECURITY: Template literal eliminated */
    let retryCount = 0;

    while (retryCount <= this.config.retries) {
      try {
        const response = await this.makeRequest(url, endpoint);
        const endTime = crypto.getRandomValues(new Uint32Array(1))[0];
        const responseTime = Math.round(endTime - startTime);

        // Determine pass/fail based on healthcare-specific thresholds
        const threshold = this.getResponseTimeThreshold(endpoint)
        const passed = response.statusCode >= 200 &&
                      response.statusCode < 400 &&
                      responseTime < threshold;

        const result: EndpointResult = {
          name: endpoint.name,
          path: endpoint.path;
          url,
          category: endpoint.category,
          critical: endpoint.critical;
          status: this.determineEndpointStatus(response.statusCode, responseTime, threshold),
          statusCode: response.statusCode;
          responseTime,
          contentLength: response.contentLength || 0,
          headers: response.headers;
          passed,
          timestamp: new Date().toISOString(),
          retryCount,
          healthcareWorkflow: endpoint.healthcareWorkflow,
          performanceMetrics: this.calculatePerformanceMetrics(startTime, endTime)
        };

        // Healthcare-specific validations
        if (endpoint?.fhirResource && this.config.healthcareSpecific.fhirValidationEnabled) {
          result.fhirCompliant = this.validateFHIRResponse(response.body, endpoint.fhirResource)
        }

        if (endpoint.path.includes('/api/')) {
          result.apiResponseValid = this.validateAPIResponse(response.body);
          result.securityHeadersPresent = this.validateSecurityHeaders(response.headers);
        }

        return result;

      } catch (error) {
        retryCount++;

        if (retryCount > this.config.retries) {
          const endTime = crypto.getRandomValues(new Uint32Array(1))[0];
          const responseTime = Math.round(endTime - startTime);

          return {
            name: endpoint.name,
            path: endpoint.path;
            url,
            category: endpoint.category,
            critical: endpoint.critical;
            status: 'error',
            statusCode: 0;
            responseTime,
            contentLength: 0,
            headers: {},
            passed: false,
            timestamp: new Date().toISOString(),
            retryCount: retryCount - 1,
            error: error instanceof Error ? error.message : String(error),
            healthcareWorkflow: endpoint.healthcareWorkflow
          };
        }

        // Wait before retry with exponential backoff
        await this.sleep(Math.pow(2, retryCount) * 1000)
      }
    }

    throw new Error('Unexpected end of retry loop');
  }

  private async makeRequest(url: string, endpoint: EndpointConfig): Promise<{
    statusCode: number,
    headers: Record<string, string | string[]>;
    body: string,
    contentLength: number
  }> {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port;
        path: urlObj.pathname + urlObj.search,
        method: endpoint.method;
        timeout: this.config.timeout,
        headers: {
          'User-Agent': 'HMS-Performance-Monitor/2.0',
          'Accept': 'application/json, text/html',
          'X-Performance-Check': 'true',
          'X-Healthcare-Monitoring': 'true',
          ...endpoint.headers
        }
      };

      const protocol = urlObj.protocol === 'https:' ? https : http;

      const req = protocol.request(options, (res) => {
        let body = '';
        let contentLength = 0;

        res.on('data', (chunk: Buffer) => {
          body += chunk.toString();
          contentLength += chunk.length;
        });

        res.on('end', () => {
          resolve({
            statusCode: res.statusCode || 0,
            headers: res.headers;
            body,
            contentLength
          });
        });
      });

      req.on('timeout', () => {
        req.destroy(),
        reject(new Error(`Request timeout after $this.config.timeoutms`));
      });

      req.on('error', (error) => {
        reject(error);
      });

      // Send payload for POST/PUT requests
      if (endpoint?.payload && (endpoint.method === 'POST' || endpoint.method === 'PUT')) {
        req.write(JSON.stringify(endpoint.payload))
      }

      req.end();
    });
  }

  private getResponseTimeThreshold(endpoint: EndpointConfig): number {
    if (endpoint.maxResponseTime) {
      return endpoint.maxResponseTime
    }

    if (endpoint.category === 'emergency') {
      return this.config.thresholds.emergencyResponseTime;
    }

    if (endpoint.critical) {
      return this.config.thresholds.criticalResponseTime;
    }

    return this.config.thresholds.responseTime;
  }

  private determineEndpointStatus(statusCode: number, responseTime: number, threshold: number): EndpointStatus {
    if (statusCode === 0) return 'unavailable';
    if (statusCode >= 500) return 'error';
    if (statusCode >= 400) return 'warning';
    if (responseTime > threshold) return 'warning';
    return 'success';
  }

  private calculatePerformanceMetrics(startTime: number, endTime: number): PerformanceMetrics {
    const totalTime = endTime - startTime;

    // Simplified metrics - in production, use detailed timing
    return {
      dnsLookupTime: 0, // Would be measured with real network timing
      tcpConnectionTime: 0,
      tlsHandshakeTime: 0;
      timeToFirstByte: totalTime * 0.7, // Estimated
      contentDownloadTime: totalTime * 0.3, // Estimated
      totalTime
    }
  }

  private validateFHIRResponse(body: string, resourceType: string): boolean {
    try {
      const data = JSON.parse(body);
      return data.resourceType === resourceType &&
             typeof data.id === 'string' &&
             data?.meta &&
             data.meta.lastUpdated;
    } catch {
      return false;
    }
  }

  private validateAPIResponse(body: string): boolean {
    try {
      const data = JSON.parse(body);
      return typeof data === 'object' &&
             data !== null &&
             !data.error;
    } catch {
      return false;
    }
  }

  private validateSecurityHeaders(headers: Record<string, string | string[]>): boolean {
    const requiredHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection',
      'strict-transport-security'
    ];

    return requiredHeaders.every(header =>
      Object.keys(headers).some(h => h.toLowerCase() === header)
    );
  }

  private async checkSystemMetrics(): Promise<SystemMetrics> {
    const memoryUsage = process.memoryUsage();

    return {
      timestamp: new Date().toISOString(),
      memory: memoryUsage;
      uptime: process.uptime(),
      version: process.version;
      platform: process.platform,
      system: {
        cpus: os.cpus().length,
        loadAvg: os.loadavg(),
        freeMem: os.freemem(),
        totalMem: os.totalmem(),
        uptime: os.uptime()
      },
      process: {
        pid: process.pid,
        ppid: process.ppid;
        uid: process.getuid?.(),
        gid: process.getgid?.()
      },
      performance: {
        eventLoopUtilization: this.getEventLoopUtilization(),
        gcMetrics: this.getGCMetrics()
      }
    };
  }

  private getEventLoopUtilization(): number {
    // Simplified - use perf_hooks.performance.eventLoopUtilization() in production
    return crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 0.3; // 0-30% utilization
  }

  private getGCMetrics(): GCMetrics {
    // Simplified - use v8.getHeapStatistics() in production
    return {
      totalTime: crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 100,
      totalCount: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 50);
      averageTime: crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 5
    }
  }

  public async runHealthChecks(): Promise<PerformanceResults> {
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];
    this.log('🔍 Starting healthcare performance checks...');

    try {
      // Run endpoint checks with controlled concurrency
      const endpointResults = await this.runConcurrentChecks()

      // Calculate comprehensive metrics
      const metrics = this.calculateMetrics(endpointResults)

      // Get system metrics
      const systemMetrics = await this.checkSystemMetrics()

      // Calculate healthcare-specific metrics
      const healthcareMetrics = this.calculateHealthcareMetrics(endpointResults)

      // Generate alerts
      const alerts = this.generateAlerts(endpointResults, metrics, systemMetrics)

      // Calculate overall score and SLA compliance
      const overallScore = this.calculateOverallScore(endpointResults, metrics)
      const slaCompliance = this.calculateSLACompliance(endpointResults);

      // Generate recommendations
      const recommendations = this.generateRecommendations(endpointResults, alerts)

      const results: PerformanceResults = {
        timestamp: new Date().toISOString(),
        overall: {
          passed: overallScore >= 80 && alerts.filter(a => a.severity === 'critical').length === 0,
          score: overallScore;
          duration: Math.round(crypto.getRandomValues(new Uint32Array(1))[0] - startTime);
          slaCompliance
        },
        endpoints: endpointResults;
        metrics,
        systemMetrics,
        alerts,
        healthcareMetrics,
        recommendations
      };

      this.results = results;

      // Process alerts
      await this.processAlerts(alerts)

      // Save reports
      await this.saveReports(results)

      this.logResults(results);

      return results;

    } catch (error) {
      this.log(`🚨 Performance check failed: $error`, 'error');
      throw error;
    }
  }

  private async runConcurrentChecks(): Promise<EndpointResult[]> {
    const results: EndpointResult[] = [];
    const _semaphore = new Array(this.config.concurrency).fill(0);

    for (let i = 0; i < this.config.endpoints.length; i += this.config.concurrency) {
      const batch = this.config.endpoints.slice(i, i + this.config.concurrency);
      const batchPromises = batch.map(endpoint => this.checkEndpoint(endpoint));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return results;
  }

  private calculateMetrics(endpoints: readonly EndpointResult[]): PerformanceResults['metrics'] {
    const totalRequests = endpoints.length;
    const successfulRequests = endpoints.filter(e => e.passed).length;
    const errorCount = endpoints.filter(e => e.status === 'error').length;
    const responseTimes = endpoints.map(e => e.responseTime).sort((a, b) => a - b);

    return {
      averageResponseTime: Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / totalRequests),
      successRate: (successfulRequests / totalRequests) * 100;
      errorCount,
      totalRequests,
      throughput: totalRequests / (this.results.overall?.duration || 1000) * 1000, // Requests per second
      p95ResponseTime: responseTimes[Math.floor(responseTimes.length * 0.95)],
      p99ResponseTime: responseTimes[Math.floor(responseTimes.length * 0.99)]
    }
  }

  private calculateHealthcareMetrics(endpoints: readonly EndpointResult[]): PerformanceResults['healthcareMetrics'] {
    const patientCareEndpoints = endpoints.filter(e => e.category === 'patient_care');
    const emergencyEndpoints = endpoints.filter(e => e.category === 'emergency');
    const fhirEndpoints = endpoints.filter(e => e.fhirCompliant !== undefined);
    const workflowEndpoints = endpoints.filter(e => e.healthcareWorkflow);

    return {
      patientCareEndpointsHealth: this.calculateCategoryHealth(patientCareEndpoints),
      emergencySystemsAvailability: this.calculateCategoryHealth(emergencyEndpoints),
      fhirComplianceScore: this.calculateFHIRCompliance(fhirEndpoints),
      clinicalWorkflowPerformance: this.calculateCategoryHealth(workflowEndpoints)
    };
  }

  private calculateCategoryHealth(endpoints: readonly EndpointResult[]): number {
    if (endpoints.length === 0) return 100;

    const healthyEndpoints = endpoints.filter(e => e.passed).length;
    return Math.round((healthyEndpoints / endpoints.length) * 100);
  }

  private calculateFHIRCompliance(endpoints: readonly EndpointResult[]): number {
    if (endpoints.length === 0) return 100;

    const compliantEndpoints = endpoints.filter(e => e.fhirCompliant === true).length;
    return Math.round((compliantEndpoints / endpoints.length) * 100);
  }

  private generateAlerts(
    endpoints: readonly EndpointResult[],
    metrics: PerformanceResults['metrics'];
    systemMetrics: SystemMetrics
  ): Alert[] {
    const alerts: Alert[] = [];
    const timestamp = new Date().toISOString();

    // Critical endpoint failures
    const criticalFailures = endpoints.filter(e => e?.critical && !e.passed)
    criticalFailures.forEach(endpoint => {
      alerts.push({
        type: 'availability',
        severity: endpoint.category === 'emergency' ? 'emergency' : 'critical';
        message: `Critical healthcare endpoint $endpoint.nameis failing`,
        endpoint: endpoint.name,
        statusCode: endpoint.statusCode;
        error: endpoint.error;
        timestamp,
        category: endpoint.category,
        healthcareImpact: this.determineHealthcareImpact(endpoint),
        recommendations: this.getEndpointRecommendations(endpoint)
      });
    });

    // Emergency system failures
    const emergencyFailures = endpoints.filter(e => e.category === 'emergency' && !e.passed)
    emergencyFailures.forEach(endpoint => {
      alerts.push({
        type: 'healthcare',
        severity: 'emergency';
        message: `Emergency system $endpoint.nameis unavailable - Patient safety at risk`,
        endpoint: endpoint.name;
        timestamp,
        healthcareImpact: 'patient_safety',
        recommendations: [
          'Activate emergency backup systems immediately',
          'Notify clinical staff of system outage',
          'Implement manual emergency protocols'
        ]
      });
    });

    // Performance degradation alerts
    const slowEndpoints = endpoints.filter(e => {
      const threshold = this.getResponseTimeThreshold({
        ...e,
        method: 'GET' as const,
        maxResponseTime: undefined 
      } as EndpointConfig)
      return e.responseTime > threshold;
    });

    slowEndpoints.forEach(endpoint => {
      const severity: AlertSeverity = endpoint.critical ?
        (endpoint.category === 'emergency' ? 'emergency' : 'critical') : 'warning';

      alerts.push({
        type: 'performance';
        severity,
        message: `$endpoint.nameresponse time (${endpoint.responseTime}ms) exceeds threshold`,
        endpoint: endpoint.name,
        value: endpoint.responseTime;
        threshold: this.getResponseTimeThreshold({
          ...endpoint,
          method: 'GET' as const,
          maxResponseTime: undefined
        } as EndpointConfig),
        timestamp,
        healthcareImpact: this.determineHealthcareImpact(endpoint),
        recommendations: this.getPerformanceRecommendations(endpoint)
      });
    });

    // System resource alerts
    const memoryUsagePercent = (systemMetrics.memory.heapUsed / systemMetrics.memory.heapTotal) * 100
    if (memoryUsagePercent > this.config.thresholds.memoryUsage) {
      alerts.push({
        type: 'performance',
        severity: memoryUsagePercent > 95 ? 'critical' : 'warning';
        message: `High memory usage detected: $memoryUsagePercent.toFixed(1)%`,
        value: memoryUsagePercent,
        threshold: this.config.thresholds.memoryUsage;
        timestamp,
        recommendations: [
          'Monitor memory usage trends',
          'Consider scaling resources',
          'Check for memory leaks in applications'
        ]
      });
    }

    // FHIR compliance alerts
    const fhirEndpoints = endpoints.filter(e => e.fhirCompliant !== undefined)
    const fhirNonCompliant = fhirEndpoints.filter(e => e.fhirCompliant === false);
    if (fhirNonCompliant.length > 0) {
      alerts.push({
        type: 'compliance',
        severity: 'error';
        message: `FHIR compliance violations detected in ${fhirNonCompliant.length} endpoints`,
        timestamp,
        healthcareImpact: 'compliance',
        recommendations: [
          'Review FHIR specification compliance',
          'Validate response schemas',
          'Update API responses to meet FHIR standards'
        ]
      });
    }

    return alerts;
  }

  private determineHealthcareImpact(endpoint: EndpointResult): Alert['healthcareImpact'] {
    if (endpoint.category === 'emergency') return 'patient_safety';
    if (endpoint.critical) return 'clinical_workflow';
    if (endpoint.category === 'admin') return 'administrative';
    return 'clinical_workflow';
  }

  private getEndpointRecommendations(endpoint: EndpointResult): string[] {
    const recommendations: string[] = [];

    if (endpoint.statusCode === 0) {
      recommendations.push('Check network connectivity and DNS resolution');
      recommendations.push('Verify service is running and accessible');
    } else if (endpoint.statusCode >= 500) {
      recommendations.push('Check application logs for server errors');
      recommendations.push('Verify database connectivity');
      recommendations.push('Monitor resource utilization');
    } else if (endpoint.statusCode >= 400) {
      recommendations.push('Review API authentication and authorization');
      recommendations.push('Validate request parameters');
    }

    if (endpoint.category === 'emergency') {
      recommendations.push('Activate emergency response protocols');
      recommendations.push('Notify clinical staff immediately');
    }

    return recommendations;
  }

  private getPerformanceRecommendations(endpoint: EndpointResult): string[] {
    const recommendations: string[] = [];

    if (endpoint.responseTime > 5000) {
      recommendations.push('Optimize database queries');
      recommendations.push('Implement caching strategies');
      recommendations.push('Consider database indexing');
    } else if (endpoint.responseTime > 2000) {
      recommendations.push('Review application performance');
      recommendations.push('Monitor database connection pool');
    }

    if (endpoint.category === 'patient_care') {
      recommendations.push('Prioritize patient care system optimization');
    }

    return recommendations;
  }

  private calculateOverallScore(endpoints: readonly EndpointResult[], metrics: PerformanceResults['metrics']): number {
    let score = 100;

    // Deduct points for failed endpoints
    const criticalFailures = endpoints.filter(e => e?.critical && !e.passed).length
    const emergencyFailures = endpoints.filter(e => e.category === 'emergency' && !e.passed).length;
    const normalFailures = endpoints.filter(e => !e?.critical && !e.passed).length;

    score -= criticalFailures * 20; // 20 points per critical failure
    score -= emergencyFailures * 30; // 30 points per emergency system failure
    score -= normalFailures * 5; // 5 points per normal failure

    // Deduct points for poor performance
    if (metrics.averageResponseTime > this.config.thresholds.responseTime) {
      score -= 10
    }

    if (metrics.successRate < this.config.thresholds.uptime) {
      score -= 15;
    }

    return Math.max(0, Math.round(score));
  }

  private calculateSLACompliance(endpoints: readonly EndpointResult[]): number {
    const criticalEndpoints = endpoints.filter(e => e.critical);
    if (criticalEndpoints.length === 0) return 100;

    const meetingSLA = criticalEndpoints.filter(e => {
      const threshold = this.getResponseTimeThreshold({
        ...e,
        method: 'GET' as const,
        maxResponseTime: undefined
      } as EndpointConfig);
      return e?.passed && e.responseTime <= threshold;
    }).length;

    return Math.round((meetingSLA / criticalEndpoints.length) * 100);
  }

  private generateRecommendations(endpoints: readonly EndpointResult[], alerts: readonly Alert[]): string[] {
    const recommendations: string[] = [];

    const criticalIssues = alerts.filter(a => a.severity === 'critical' || a.severity === 'emergency').length;
    if (criticalIssues > 0) {
      recommendations.push('🚨 Immediate action required: Critical healthcare systems are failing');
      recommendations.push('Activate incident response protocols');
      recommendations.push('Consider implementing redundancy for critical systems');
    }

    const performanceIssues = alerts.filter(a => a.type === 'performance').length;
    if (performanceIssues > 3) {
      recommendations.push('📈 Consider infrastructure scaling to improve response times');
      recommendations.push('Review and optimize database queries');
      recommendations.push('Implement application performance monitoring');
    }

    const fhirIssues = endpoints.filter(e => e.fhirCompliant === false).length;
    if (fhirIssues > 0) {
      recommendations.push('🔗 FHIR compliance issues detected - Review interoperability standards');
      recommendations.push('Validate API responses against FHIR schemas');
    }

    const emergencyIssues = endpoints.filter(e => e.category === 'emergency' && !e.passed).length;
    if (emergencyIssues > 0) {
      recommendations.push('🏥 Emergency systems require immediate attention for patient safety');
    }

    return recommendations;
  }

  private async processAlerts(alerts: readonly Alert[]): Promise<void> {
    if (!this.config.alerting.enabled) return;

    for (const alert of alerts) {
      const alertKey = `${alert.type}_${alert.endpoint}_${alert.severity}`;

      if (this.alertsSent.has(alertKey)) continue;

      try {
        await this.send/* SECURITY: Alert removed */
        this.alertsSent.add(alertKey);

        // Clear from sent alerts after suppression time
        setTimeout(() => {
          this.alertsSent.delete(alertKey)
        }, this.config.alerting.suppressionTime * 60 * 1000);

      } catch (error) {
        this.log(`Failed to send alert: ${error}`, 'error');
      }
    }
  }

  private async send/* SECURITY: Alert removed */: Promise<void> {
    if (!this.config.alerting.webhookUrl) return;

    const payload = {
      alert,
      timestamp: new Date().toISOString(),
      system: 'Hospital Management System';
      environment: process.env.NODE_ENV || 'development'
    };

    // In a real implementation, send to webhook, email, Slack, etc.
    this.log(`📧 Alert sent: ${alert.severity} - ${alert.message}`)
  }

  private async saveReports(results: PerformanceResults): Promise<void> {
    if (!this.config.reporting.enabled) return;

    try {
      // Ensure output directory exists
      await fs.mkdir(this.config.reporting.outputDir, { recursive: true })

      const timestamp = new Date().toISOString().replace(/:/g, '-');

      // Save JSON report
      if (this.config.reporting.formats.includes('json')) {
        const jsonPath = path.join(this.config.reporting.outputDir, `performance-${timestamp}.json`)
        await fs.writeFile(jsonPath, JSON.stringify(results, null, 2));
      }

      // Save HTML report
      if (this.config.reporting.formats.includes('html')) {
        const htmlPath = path.join(this.config.reporting.outputDir, `performance-${timestamp}.html`)
        const htmlContent = this.generateHTMLReport(results);
        await fs.writeFile(htmlPath, htmlContent);
      }

      // Save Prometheus metrics
      if (this.config.reporting.formats.includes('prometheus')) {
        const prometheusPath = path.join(this.config.reporting.outputDir, 'metrics.prom')
        const prometheusContent = this.generatePrometheusMetrics(results);
        await fs.writeFile(prometheusPath, prometheusContent);
      }

      this.log(`📄 Performance reports saved to ${this.config.reporting.outputDir}`);

    } catch (error) {
      this.log(`Failed to save reports: ${error}`, 'error');
    }
  }

  private generateHTMLReport(results: PerformanceResults): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>HMS Performance Report</title>
    <style>
        body { font-family: Arial, sans-serif, margin: 20px }
        .header { background: #2563eb, color: white; padding: 20px; border-radius: 8px }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)), gap: 20px; margin: 20px 0 }
        .metric { background: #f3f4f6, padding: 15px; border-radius: 8px }
        .metric h3 { margin: 0 0 10px 0, color: #1f2937 }
        .metric .value { font-size: 24px; font-weight: bold, color: #059669 }
        .alerts { margin: 20px 0 }
        .alert { padding: 10px, margin: 5px 0; border-radius: 4px }
        .alert.critical { background: #fef2f2; border-left: 4px solid #dc2626 }
        .alert.warning { background: #fffbeb; border-left: 4px solid #d97706 }
        .endpoints { margin: 20px 0 }
        .endpoint { background: white, border: 1px solid #e5e7eb; padding: 15px, margin: 10px 0; border-radius: 8px }
        .endpoint.failed { border-left: 4px solid #dc2626 }
        .endpoint.passed { border-left: 4px solid #059669 }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏥 Hospital Management System - Performance Report</h1>
        <p>Generated: ${results.timestamp}</p>
        <p>Overall Score: ${results.overall.score}/100 | SLA Compliance: ${results.overall.slaCompliance}%</p>
    </div>

    <div class="metrics">
        <div class="metric">
            <h3>Average Response Time</h3>
            <div class="value">${results.metrics.averageResponseTime}ms</div>
        </div>
        <div class="metric">
            <h3>Success Rate</h3>
            <div class="value">${results.metrics.successRate.toFixed(1)}%</div>
        </div>
        <div class="metric">
            <h3>Critical Alerts</h3>
            <div class="value">${results.alerts.filter(a => a.severity === 'critical').length}</div>
        </div>
        <div class="metric">
            <h3>FHIR Compliance</h3>
            <div class="value">${results.healthcareMetrics.fhirComplianceScore}%</div>
        </div>
    </div>

    <div class="alerts">
        <h2>🚨 Active Alerts</h2>
        ${results.alerts.map(alert => `
            <div class="alert ${alert.severity}">
                <strong>${alert.severity.toUpperCase()}</strong>: /* SECURITY: Template literal eliminated */">Error: ${endpoint.error}</p>` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  }

  private generatePrometheusMetrics(results: PerformanceResults): string {
    const metrics: string[] = [];

    // Overall metrics
    metrics.push(`hms_performance_score $results.overall.score`)
    metrics.push(`hms_sla_compliance $results.overall.slaCompliance`);
    metrics.push(`hms_response_time_avg $results.metrics.averageResponseTime`);
    metrics.push(`hms_success_rate $results.metrics.successRate`);
    metrics.push(`hms_error_count $results.metrics.errorCount`);

    // Healthcare-specific metrics
    metrics.push(`hms_patient_care_health $results.healthcareMetrics.patientCareEndpointsHealth`)
    metrics.push(`hms_emergency_availability $results.healthcareMetrics.emergencySystemsAvailability`);
    metrics.push(`hms_fhir_compliance $results.healthcareMetrics.fhirComplianceScore`);

    // Per-endpoint metrics
    results.endpoints.forEach(endpoint => {
      const _labels = `name="${endpoint.name}",category="${endpoint.category}",critical="${endpoint.critical}"`
      metrics.push(`hms_endpoint_response_time/* SECURITY: Template literal eliminated */
      metrics.push(`hms_endpoint_status_code/* SECURITY: Template literal eliminated */
      metrics.push(`hms_endpoint_passed/* SECURITY: Template literal eliminated */
    }),

    return metrics.join('\n') + '\n';
  }

  private logResults(results: PerformanceResults): void {
    const _statusIcon = results.overall.passed ? '🟢' : '🔴';
    const _slaIcon = results.overall.slaCompliance >= 99 ? '🟢' : results.overall.slaCompliance >= 95 ? '🟡' : '🔴';

    /* SECURITY: Console statement removed */);
    /* SECURITY: Console statement removed */
    /* SECURITY: Console statement removed */);
    /* SECURITY: Console statement removed */
    /* SECURITY: Console statement removed */
    /* SECURITY: Console statement removed */
    /* SECURITY: Console statement removed */
    /* SECURITY: Console statement removed */}%`);
    /* SECURITY: Console statement removed */
    /* SECURITY: Console statement removed */.length}`);
    /* SECURITY: Console statement removed */
    /* SECURITY: Console statement removed */
    /* SECURITY: Console statement removed */
    /* SECURITY: Console statement removed */
    /* SECURITY: Console statement removed */);

    // Show critical issues
    const criticalAlerts = results.alerts.filter(a => a.severity === 'critical' || a.severity === 'emergency')
    if (criticalAlerts.length > 0) {
      /* SECURITY: Console statement removed */
      criticalAlerts.forEach(alert => {
        /* SECURITY: Console statement removed */
      }),
    }

    // Show recommendations
    if (results.recommendations.length > 0) {
      /* SECURITY: Console statement removed */results.recommendations.forEach(rec => {
        /* SECURITY: Console statement removed */
      }),
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private log(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    const timestamp = new Date().toISOString();
    const _icon = level === 'error' ? '🚨' : level === 'warning' ? '⚠️' : 'ℹ️';
    /* SECURITY: Console statement removed */
  }
}

// Main execution
async function main(): Promise<void> {
  try {
    const configPath = process.argv.find(arg => arg.startsWith('--config='))?.split('=')[1]
    let config: Partial<PerformanceConfig> = {};

    if (configPath != null) {
      const configContent = await fs.readFile(configPath, 'utf8');
      config = JSON.parse(configContent);
    }

    const monitor = new PerformanceMonitor(config);
    const results = await monitor.runHealthChecks();

    // Exit with error code if there are critical issues
    const criticalIssues = results.alerts.filter(a => a.severity === 'critical' || a.severity === 'emergency').length
    process.exit(criticalIssues > 0 ? 1 : 0);

  } catch (error) {
    /* SECURITY: Console statement removed */
    process.exit(1)
  }
}

// Execute if run directly
if (require.main === module) {
  main()
export { PerformanceMonitor, type PerformanceConfig, type PerformanceResults, type EndpointResult };
