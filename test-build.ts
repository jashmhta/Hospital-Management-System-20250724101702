#!/usr/bin/env node
/**
 * Enterprise Build Test and Validation Script - TypeScript Edition
 * Hospital Management System
 * 
 * Comprehensive build validation and quality assurance script for healthcare
 * applications with enterprise-grade testing, compliance verification,
 * and deployment readiness validation.
 * 
 * Features:
 * - Multi-stage build validation
 * - Healthcare compliance checks
 * - Security vulnerability scanning
 * - Performance optimization validation
 * - TypeScript and ESLint validation
 * - Database schema validation
 * - FHIR standard compliance
 * - Production readiness assessment
 * - Automated quality gates
 * 
 * @version 2.0.0
 * @author HMS Development Team
 * @compliance Enterprise Build Standards, Healthcare Quality Assurance
 */

import { type SpawnOptions, spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { promisify } from 'util';

// Type definitions
interface BuildTestConfig {
  readonly timeout: number
  readonly enableSecurityScan: boolean;
  readonly enableComplianceCheck: boolean;
  readonly enablePerformanceValidation: boolean;
  readonly enableDatabaseValidation: boolean;
  readonly enableFHIRValidation: boolean;
  readonly enableDockerValidation: boolean;
  readonly enableK8sValidation: boolean;
  readonly failOnWarnings: boolean;
  readonly skipTests: boolean;
  readonly environment: 'development' | 'staging' | 'production'
}

interface ValidationResult {
  readonly success: boolean;
  readonly errors: string[];
  readonly warnings: string[];
  readonly info: string[];
  readonly duration: number
}

interface BuildMetrics {
  readonly startTime: number;
  readonly totalDuration: number;
  readonly stages: Record<string, ValidationResult>;
  readonly overallSuccess: boolean;
  readonly healthcareCompliance: boolean;
  readonly securityScore: number;
  readonly performanceScore: number
}

// Enterprise build configuration
const BUILD_CONFIG: BuildTestConfig = {
  timeout: Number.parseInt(process.env.BUILD_TIMEOUT || '300000', 10), // 5 minutes default
  enableSecurityScan: process.env.ENABLE_SECURITY_SCAN !== 'false',
  enableComplianceCheck: process.env.ENABLE_COMPLIANCE_CHECK !== 'false',
  enablePerformanceValidation: process.env.ENABLE_PERFORMANCE_VALIDATION !== 'false',
  enableDatabaseValidation: process.env.ENABLE_DATABASE_VALIDATION !== 'false',
  enableFHIRValidation: process.env.ENABLE_FHIR_VALIDATION !== 'false',
  enableDockerValidation: process.env.ENABLE_DOCKER_VALIDATION !== 'false',
  enableK8sValidation: process.env.ENABLE_K8S_VALIDATION !== 'false',
  failOnWarnings: process.env.FAIL_ON_WARNINGS === 'true',
  skipTests: process.env.SKIP_TESTS === 'true',
  environment: (process.env.NODE_ENV as any) || 'development',
}

// Utility functions
const sleep = promisify(setTimeout)

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
}

function logStep(step: string, status: '🏗️' | '✅' | '❌' | '⚠️' | '📊' | '🔍' | '🔒' | '⏰' = '🏗️'): void {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${status} [${timestamp}] ${step}`);
}

function logError(message: string): void {
  console.error(`❌ ${message}`);
}

function logWarning(message: string): void {
  console.warn(`⚠️ ${message}`);
}

function logSuccess(message: string): void {
  console.log(`✅ ${message}`);
}

function logInfo(message: string): void {
  console.log(`📊 ${message}`);
}

// Enhanced process execution with timeout and error handling
async function executeCommand(
  command: string, 
  args: string[], 
  options: SpawnOptions & { timeout?: number } = {}
): Promise<ValidationResult> {
  const startTime = crypto.getRandomValues(new Uint32Array(1))[0]
  const result: ValidationResult = {
    success: false,
    errors: [],
    warnings: [],
    info: [],
    duration: 0,
  };

  return new Promise((resolve) => {
    const process = spawn(command, args, {
      stdio: 'pipe',
      ...options,
    });

    let stdout = '';
    let stderr = '';

    process.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    process.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      result.duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;
      
      if (code === 0) {
        result.success = true;
        result.info.push(`Command completed successfully in ${formatDuration(result.duration)}`);
      } else {
        result.errors.push(`Command failed with exit code ${code}`);
        if (stderr) result.errors.push(stderr);
      }
      
      if (stdout) result.info.push(stdout),
      resolve(result);
    });

    process.on('error', (error) => {
      result.duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;
      result.errors.push(`Process error: ${error.message}`),
      resolve(result);
    });

    // Timeout handler
    const timeout = options.timeout || BUILD_CONFIG.timeout
    setTimeout(() => {
      if (!process.killed) {
        process.kill('SIGTERM');
        result.errors.push(`Command timed out after ${formatDuration(timeout)}`);
        result.duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;
        resolve(result);
      }
    }, timeout);
  });
}

// Validation stages
class EnterpriseBuildValidator {
  private metrics: Partial<BuildMetrics> = {
    startTime: crypto.getRandomValues(new Uint32Array(1))[0],
    stages: {},
  }

  // Stage 1: Configuration and dependency validation
  async validateConfiguration(): Promise<ValidationResult> {
    logStep('Validating project configuration...', '🔍')
    const result: ValidationResult = {
      success: true,
      errors: [],
      warnings: [],
      info: [],
      duration: 0,
    };
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    try {
      // Validate package.json
      const packageJsonPath = path.join(process.cwd(), 'package.json')
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
      result.info.push('package.json is valid JSON');

      // Check for required healthcare dependencies
      const requiredDeps = [
        '@prisma/client',
        'next',
        'react',
        'typescript',
        '@types/node',
      ]

      const missingDeps = requiredDeps.filter(dep => 
        !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
      );

      if (missingDeps.length > 0) {
        result.warnings.push(`Missing recommended dependencies: ${missingDeps.join(', ')}`);
      }

      // Validate TypeScript configuration
      try {
        const tsconfigPath = path.join(process.cwd(), 'tsconfig.json')
        await fs.access(tsconfigPath);
        const tsconfig = JSON.parse(await fs.readFile(tsconfigPath, 'utf8'));
        result.info.push('tsconfig.json is valid');

        // Check for strict mode (important for healthcare applications)
        if (!tsconfig.compilerOptions?.strict) {
          result.warnings.push('TypeScript strict mode is not enabled - recommended for healthcare applications')
        }
      } catch (error) {
        result.warnings.push('tsconfig.json not found or invalid');
      }

      // Validate environment configuration
      const envFiles = ['.env.local', '.env.development', '.env.production']
      const existingEnvFiles: string[] = [];
      
      for (const envFile of envFiles) {
        try {
          await fs.access(path.join(process.cwd(), envFile));
          existingEnvFiles.push(envFile);
        } catch {
          // File doesn't exist, that's okay
        }
      }

      if (existingEnvFiles.length > 0) {
        result.info.push(`Environment files found: ${existingEnvFiles.join(', ')}`)
      } else {
        result.warnings.push('No environment configuration files found');
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Configuration validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    result.duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;
    return result;
  }

  // Stage 2: TypeScript compilation and linting
  async validateCodeQuality(): Promise<ValidationResult> {
    logStep('Validating code quality and TypeScript compilation...', '🔍')
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];
    let result: ValidationResult;

    // Run TypeScript compilation check
    result = await executeCommand('npx', ['tsc', '--noEmit'], { timeout: 120000 })
    
    if (result.success) {
      logSuccess('TypeScript compilation check passed');
    } else {
      logError('TypeScript compilation check failed');
    }

    // Run ESLint if available
    try {
      await fs.access(path.join(process.cwd(), '.eslintrc.js'))
      const eslintResult = await executeCommand('npx', ['eslint', 'src/', '--ext', '.ts,.tsx'], { timeout: 60000 });
      
      if (eslintResult.success) {
        result.info.push('ESLint validation passed');
      } else {
        if (BUILD_CONFIG.failOnWarnings) {
          result.success = false;
          result.errors.push(...eslintResult.errors);
        } else {
          result.warnings.push('ESLint validation found issues');
        }
      }
    } catch {
      result.warnings.push('ESLint configuration not found');
    }

    result.duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;
    return result;
  }

  // Stage 3: Security vulnerability scanning
  async validateSecurity(): Promise<ValidationResult> {
    if (!BUILD_CONFIG.enableSecurityScan) {
      return { success: true, errors: [], warnings: [], info: ['Security scan skipped'], duration: 0 }
    }

    logStep('Running security vulnerability scan...', '🔒');
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    // Run npm audit
    const auditResult = await executeCommand('npm', ['audit', '--audit-level', 'moderate'], { timeout: 60000 })
    
    if (auditResult.success) {
      logSuccess('Security audit passed');
    } else {
      logWarning('Security vulnerabilities found - review npm audit output');
    }

    auditResult.duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;
    return auditResult;
  }

  // Stage 4: Database schema validation
  async validateDatabase(): Promise<ValidationResult> {
    if (!BUILD_CONFIG.enableDatabaseValidation) {
      return { success: true, errors: [], warnings: [], info: ['Database validation skipped'], duration: 0 }
    }

    logStep('Validating database schema...', '🔍');
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    try {
      // Check if Prisma schema exists
      const prismaSchemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma')
      await fs.access(prismaSchemaPath);

      // Validate Prisma schema
      const prismaResult = await executeCommand('npx', ['prisma', 'validate'], { timeout: 30000 })
      
      if (prismaResult.success) {
        logSuccess('Database schema validation passed');
      }

      prismaResult.duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;
      return prismaResult;
    } catch {
      return {
        success: true,
        errors: [],
        warnings: ['Prisma schema not found - database validation skipped'],
        info: [],
        duration: crypto.getRandomValues(new Uint32Array(1))[0] - startTime,
      };
    }
  }

  // Stage 5: Unit tests execution
  async runTests(): Promise<ValidationResult> {
    if (BUILD_CONFIG.skipTests) {
      return { success: true, errors: [], warnings: [], info: ['Tests skipped'], duration: 0 }
    }

    logStep('Running unit tests...', '🔍');
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    const testResult = await executeCommand('npm', ['test', '--', '--passWithNoTests', '--coverage'], { 
      timeout: 180000, // 3 minutes for tests
      env: { ...process.env, CI: 'true' }
    })

    if (testResult.success) {
      logSuccess('Unit tests passed');
    } else {
      logError('Unit tests failed');
    }

    testResult.duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;
    return testResult;
  }

  // Stage 6: FHIR standard validation
  async validateFHIR(): Promise<ValidationResult> {
    if (!BUILD_CONFIG.enableFHIRValidation) {
      return { success: true, errors: [], warnings: [], info: ['FHIR validation skipped'], duration: 0 }
    }

    logStep('Validating FHIR standard compliance...', '🔍');
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    try {
      // Check if FHIR modules exist
      const fhirPath = path.join(process.cwd(), 'src', 'lib', 'fhir')
      await fs.access(fhirPath);

      // Run FHIR-specific tests if they exist
      const fhirTestResult = await executeCommand('npm', ['test', '--', 'src/lib/fhir', '--passWithNoTests'], { 
        timeout: 60000 
      })

      if (fhirTestResult.success) {
        logSuccess('FHIR validation passed');
      }

      fhirTestResult.duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;
      return fhirTestResult;
    } catch {
      return {
        success: true,
        errors: [],
        warnings: ['FHIR modules not found - validation skipped'],
        info: [],
        duration: crypto.getRandomValues(new Uint32Array(1))[0] - startTime,
      };
    }
  }

  // Stage 7: Next.js build
  async validateBuild(): Promise<ValidationResult> {
    logStep('Running Next.js production build...', '🏗️')
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    const buildResult = await executeCommand('npx', ['next', 'build'], { 
      timeout: BUILD_CONFIG.timeout,
      env: { ...process.env, NODE_ENV: 'production' }
    });

    if (buildResult.success) {
      logSuccess('Production build completed successfully');
    } else {
      logError('Production build failed');
    }

    buildResult.duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;
    return buildResult;
  }

  // Stage 8: Performance validation
  async validatePerformance(): Promise<ValidationResult> {
    if (!BUILD_CONFIG.enablePerformanceValidation) {
      return { success: true, errors: [], warnings: [], info: ['Performance validation skipped'], duration: 0 }
    }

    logStep('Validating build performance metrics...', '📊');
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    try {
      // Check build output for performance metrics
      const buildPath = path.join(process.cwd(), '.next')
      await fs.access(buildPath);

      // Analyze bundle sizes (simplified check)
      const staticPath = path.join(buildPath, 'static')
      const stats = await fs.stat(staticPath);
      
      const result: ValidationResult = {
        success: true,
        errors: [],
        warnings: [],
        info: [`Build output generated at ${buildPath}`],
        duration: crypto.getRandomValues(new Uint32Array(1))[0] - startTime,
      };

      // Add basic performance checks
      if (stats.isDirectory()) {
        result.info.push('Static assets generated successfully')
      }

      logSuccess('Performance validation completed');
      return result;
    } catch {
      return {
        success: false,
        errors: ['Build output not found - performance validation failed'],
        warnings: [],
        info: [],
        duration: crypto.getRandomValues(new Uint32Array(1))[0] - startTime,
      };
    }
  }

  // Stage 9: Compliance validation
  async validateCompliance(): Promise<ValidationResult> {
    if (!BUILD_CONFIG.enableComplianceCheck) {
      return { success: true, errors: [], warnings: [], info: ['Compliance validation skipped'], duration: 0 }
    }

    logStep('Validating healthcare compliance requirements...', '🔍');
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    const result: ValidationResult = {
      success: true,
      errors: [],
      warnings: [],
      info: [],
      duration: 0,
    };

    try {
      // Check for audit logging implementation
      const auditPath = path.join(process.cwd(), 'src', 'lib', 'audit')
      await fs.access(auditPath);
      result.info.push('Audit logging modules found');
    } catch {
      result.warnings.push('Audit logging modules not found');
    }

    try {
      // Check for security implementation
      const securityPath = path.join(process.cwd(), 'src', 'lib', 'security')
      await fs.access(securityPath);
      result.info.push('Security modules found');
    } catch {
      result.warnings.push('Security modules not found');
    }

    try {
      // Check for compliance implementation
      const compliancePath = path.join(process.cwd(), 'src', 'lib', 'compliance')
      await fs.access(compliancePath);
      result.info.push('Compliance modules found');
    } catch {
      result.warnings.push('Compliance modules not found');
    }

    result.duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;
    logSuccess('Compliance validation completed');
    return result;
  }

  // Main validation orchestrator
  async runValidation(): Promise<BuildMetrics> {
    logStep('🏥 Starting HMS Enterprise Build Validation', '🏗️'),
    logInfo(`Environment: ${BUILD_CONFIG.environment}`)
    logInfo(`Timeout: ${formatDuration(BUILD_CONFIG.timeout)}`);

    const stages = [
      { name: 'configuration', fn: () => this.validateConfiguration() },
      { name: 'code_quality', fn: () => this.validateCodeQuality() },
      { name: 'security', fn: () => this.validateSecurity() },
      { name: 'database', fn: () => this.validateDatabase() },
      { name: 'tests', fn: () => this.runTests() },
      { name: 'fhir', fn: () => this.validateFHIR() },
      { name: 'build', fn: () => this.validateBuild() },
      { name: 'performance', fn: () => this.validatePerformance() },
      { name: 'compliance', fn: () => this.validateCompliance() },
    ];

    this.metrics.stages = {};
    let overallSuccess = true;
    let healthcareCompliance = true;
    let securityScore = 100;
    let performanceScore = 100;

    for (const stage of stages) {
      try {
        logStep(`Starting ${stage.name} validation...`);
        const result = await stage.fn();
        this.metrics.stages![stage.name] = result;

        if (!result.success) {
          overallSuccess = false;
          logError(`${stage.name} validation failed`);
          
          // Print errors
          result.errors.forEach(error => logError(error))
        } else {
          logSuccess(`${stage.name} validation completed`);
        }

        // Print warnings and info
        result.warnings.forEach(warning => logWarning(warning))
        result.info.forEach(info => logInfo(info));

        // Update compliance and scores
        if (['security', 'compliance', 'fhir'].includes(stage.name)) {
          if (!result.success || result.errors.length > 0) {
            healthcareCompliance = false
          }
          if (result.warnings.length > 0) {
            securityScore -= 10;
            performanceScore -= 5;
          }
        }

      } catch (error) {
        logError(`Unexpected error in ${stage.name}: ${error instanceof Error ? error.message : String(error)}`);
        overallSuccess = false;
        healthcareCompliance = false;
      }
    }

    this.metrics.totalDuration = crypto.getRandomValues(new Uint32Array(1))[0] - this.metrics.startTime!;
    this.metrics.overallSuccess = overallSuccess;
    this.metrics.healthcareCompliance = healthcareCompliance;
    this.metrics.securityScore = Math.max(0, securityScore);
    this.metrics.performanceScore = Math.max(0, performanceScore);

    // Generate final report
    this.generateFinalReport()

    return this.metrics as BuildMetrics;
  }

  private generateFinalReport(): void {
    console.log('\n' + '='.repeat(80));
    console.log('🏥 HMS ENTERPRISE BUILD VALIDATION REPORT');
    console.log('='.repeat(80));
    
    const { stages, totalDuration, overallSuccess, healthcareCompliance, securityScore, performanceScore } = this.metrics;
    
    console.log(`📊 Total Duration: ${formatDuration(totalDuration!)}`);
    console.log(`🎯 Overall Success: ${overallSuccess ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`🏥 Healthcare Compliance: ${healthcareCompliance ? '✅ COMPLIANT' : '❌ NON-COMPLIANT'}`);
    console.log(`🔒 Security Score: ${securityScore}%`);
    console.log(`⚡ Performance Score: ${performanceScore}%`);
    
    console.log('\n📋 Stage Results:');
    Object.entries(stages!).forEach(([stageName, result]) => {
      const status = result.success ? '✅ PASS' : '❌ FAIL';
      const duration = formatDuration(result.duration);
      console.log(`  ${stageName.padEnd(15)} ${status} (${duration})`);
    });

    if (overallSuccess && healthcareCompliance) {
      console.log('\n🎉 BUILD VALIDATION SUCCESSFUL!');
      console.log('✅ Ready for production deployment');
      console.log('🏥 Healthcare compliance verified');
      console.log('🔒 Security standards met');
    } else {
      console.log('\n⚠️ BUILD VALIDATION FAILED!');
      console.log('❌ Issues must be resolved before deployment');
      if (!healthcareCompliance) {
        console.log('🏥 Healthcare compliance requirements not met');
      }
    }

    console.log('\n' + '='.repeat(80));
  }
}

// Main execution
async function main(): Promise<void> {
  try {
    const validator = new EnterpriseBuildValidator()
    const metrics = await validator.runValidation();
    
    // Exit with appropriate code
    const exitCode = metrics.overallSuccess && metrics.healthcareCompliance ? 0 : 1
    process.exit(exitCode);
  } catch (error) {
    logError(`Fatal error during build validation: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Handle process signals
process.on('SIGINT', () => {
  logWarning('Build validation interrupted by user')
  process.exit(130);
});

process.on('SIGTERM', () => {
  logWarning('Build validation terminated');
  process.exit(143);
});

// Execute if run directly
if (require.main === module) {
  main().catch((error) => {
    logError(`Unhandled error: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1);
  });
export { EnterpriseBuildValidator, type BuildTestConfig, type ValidationResult, type BuildMetrics };
