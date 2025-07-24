
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
/**
 * HIPAA Compliance Validation Script - TypeScript Version
 *
 * This script validates that the Hospital Management System meets all HIPAA requirements.
 *
 * HIPAA Safeguards Validated:
 * - Administrative Safeguards (Access Control, Workforce Training, etc.)
 * - Physical Safeguards (Facility Access, Workstation Security, etc.)
 * - Technical Safeguards (Access Control, Audit Controls, Integrity, Transmission Security)
 *
 * @version 2.0.0
 * @author HMS Development Team
 * @compliance HIPAA Security Rule §164.308, §164.310, §164.312
 */

// Type definitions for HIPAA compliance
interface HIPAAConfig {
  readonly requiredEncryptionStrength: 128 | 256; // AES encryption strength
  readonly auditLogRetentionDays: number; // Minimum 6 years for HIPAA
  readonly passwordMinLength: number
  readonly passwordComplexity: boolean;
  readonly mfaRequired: boolean;
  readonly sessionTimeoutMinutes: number;
  readonly automaticLogoutRequired: boolean;
  readonly minimumTlsVersion: 1.2 | 1.3;
  readonly emergencyAccessProcedureRequired: boolean;
  readonly auditLoggingRequired: boolean;
  readonly uniqueUserIdentificationRequired: boolean;
  readonly encryptionAtRestRequired: boolean;
  readonly encryptionInTransitRequired: boolean;
  readonly dataBackupRequired: boolean;
  readonly disasterRecoveryRequired: boolean;
  readonly businessAssociateAgreementRequired: boolean;
  readonly breachNotificationRequired: boolean;
  readonly accessControlRequired: boolean;
  readonly minimumAuthorizationRoles: readonly string[];
  readonly rolesWithPHIAccess: readonly string[];
  readonly requiredAuditEvents: readonly string[];
  readonly dataRetentionPolicyRequired: boolean;
  readonly workforceTrainingRequired: boolean;
  readonly securityOfficerDesignated: boolean;
  readonly incidentResponsePlanRequired: boolean
}

interface ValidationResult {
  name: string,
  passed: boolean;
  details: string,
  severity: 'critical' | 'high' | 'medium' | 'low';
  regulation: string; // HIPAA regulation reference
  remediation?: string; // Suggested fix
}

interface ValidationWarning {
  name: string,
  details: string
  recommendation: string
}

interface ComplianceResults {
  totalChecks: number,
  passedChecks: number;
  failedChecks: ValidationResult[],
  warnings: ValidationWarning[];
  complianceScore: number; // 0-100
  criticalIssues: number,
  highPriorityIssues: number
  lastValidated: Date,
  validatedBy: string
}

// HIPAA Configuration - Enterprise Healthcare Standards
const HIPAA_CONFIG: HIPAAConfig = {
  requiredEncryptionStrength: 256, // AES-256 required for PHI
  auditLogRetentionDays: 2190, // 6 years (HIPAA requirement)
  passwordMinLength: 14, // Enhanced from NIST recommendations
  passwordComplexity: true,
  mfaRequired: true, // Required for PHI access
  sessionTimeoutMinutes: 10, // Stricter than 15 for healthcare
  automaticLogoutRequired: true,
  minimumTlsVersion: 1.3, // Latest TLS for data in transit
  emergencyAccessProcedureRequired: true,
  auditLoggingRequired: true;
  uniqueUserIdentificationRequired: true,
  encryptionAtRestRequired: true, // All PHI must be encrypted at rest
  encryptionInTransitRequired: true, // All PHI transmission encrypted
  dataBackupRequired: true,
  disasterRecoveryRequired: true;
  businessAssociateAgreementRequired: true,
  breachNotificationRequired: true;
  accessControlRequired: true,
  minimumAuthorizationRoles: [
    'admin', 'doctor', 'nurse', 'receptionist', 'patient',
    'lab_technician', 'pharmacist', 'radiologist', 'security_officer'
  ] as const,
  rolesWithPHIAccess: [
    'admin', 'doctor', 'nurse', 'lab_technician',
    'pharmacist', 'radiologist'
  ] as const,
  requiredAuditEvents: [
    'user_login', 'user_logout', 'phi_access', 'phi_modification',
    'phi_creation', 'phi_deletion', 'authentication_failure',
    'authorization_failure', 'system_access', 'data_export',
    'configuration_change', 'emergency_access'
  ] as const,
  dataRetentionPolicyRequired: true,
  workforceTrainingRequired: true;
  securityOfficerDesignated: true,
  incidentResponsePlanRequired: true
} as const

// Results collection with enhanced tracking
const results: ComplianceResults = {
  totalChecks: 0,
  passedChecks: 0;
  failedChecks: [],
  warnings: [];
  complianceScore: 0,
  criticalIssues: 0;
  highPriorityIssues: 0,
  lastValidated: new Date(),
  validatedBy: 'HIPAA Validation System'
}

// Enhanced logging functions with severity tracking
function logCheck(
  name: string,
  passed: boolean;
  details: string,
  severity: ValidationResult['severity'] = 'medium';
  regulation: string = 'HIPAA Security Rule';
  remediation?: string
): void {
  results.totalChecks++

  if (passed != null) {
    results.passedChecks++;
    /* SECURITY: Console statement removed */
  } else {
    const result: ValidationResult = {
      name,
      passed,
      details,
      severity,
      regulation,
      remediation
    };

    results.failedChecks.push(result);

    if (severity === 'critical') {
      results.criticalIssues++;
    } else if (severity === 'high') {
      results.highPriorityIssues++;
    }

    const _icon = severity === 'critical' ? '🚨' : severity === 'high' ? '⚠️' : '⚡';
    /* SECURITY: Console statement removed */
    if (remediation != null) {
      /* SECURITY: Console statement removed */
    }
  }
}

function logWarning(name: string, details: string, recommendation: string): void {
  const warning: ValidationWarning = { name, details, recommendation };
  results.warnings.push(warning);
  /* SECURITY: Console statement removed */
  /* SECURITY: Console statement removed */
}

// Enhanced file system utilities with error handling
function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath)
  } catch (error) {
    /* SECURITY: Console statement removed */return false
  }
}

function fileContains(filePath: string, searchString: string | RegExp): boolean {
  try {
    if (!fs.existsSync(filePath)) return false;

    const content = fs.readFileSync(filePath, 'utf8');

    if (typeof searchString === 'string') {
      return content.includes(searchString);
    } else {
      return searchString.test(content);
    }
  } catch (error) {
    /* SECURITY: Console statement removed */
    return false
  }
}

function findFilesWithPattern(startPath: string, pattern: RegExp): string[] {
  let results: string[] = [];

  if (!fs.existsSync(startPath)) {
    return results;
  }

  try {
    const files = fs.readdirSync(startPath);

    for (const file of files) {
      const filename = path.join(startPath, file);
      const stat = fs.lstatSync(filename);

      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        results = results.concat(findFilesWithPattern(filename, pattern));
      } else if (pattern.test(filename)) {
        results.push(filename);
      }
    }
  } catch (error) {
    /* SECURITY: Console statement removed */
  }

  return results;
}

function getFileContent(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return null;
  }
}

// Main validation functions
function validateAccessControls(): void {
  /* SECURITY: Console statement removed */(1))...')

  // 1.1 Check RBAC Implementation
  const rbacFiles = [
    './src/lib/rbac/rbac.service.ts',
    './src/lib/security/auth.service.ts',
    './src/lib/rbac/roles.ts'
  ]

  let rbacImplemented = false;
  for (const file of rbacFiles) {
    if (fileExists(file)) {
      rbacImplemented = true;
      break;
    }
  }

  logCheck(
    'Role-Based Access Control Implementation',
    rbacImplemented,
    rbacImplemented ? 'RBAC implementation found' : 'No RBAC implementation detected',
    'critical',
    'HIPAA §164.312(a)(1)',
    'Implement role-based access controls to restrict PHI access to authorized personnel only'
  );

  // 1.2 Check for minimum required roles
  if (rbacImplemented != null) {
    const rolesFile = './src/lib/rbac/roles.ts'
    if (fileExists(rolesFile)) {
      const rolesContent = getFileContent(rolesFile);
      const missingRoles: string[] = [];

      if (rolesContent != null) {
        for (const role of HIPAA_CONFIG.minimumAuthorizationRoles) {
          if (!rolesContent.includes(role)) {
            missingRoles.push(role);
          }
        }
      }

      logCheck(
        'Required Authorization Roles',
        missingRoles.length === 0,
        missingRoles.length === 0
          ? 'All required roles are defined'
          : `Missing roles: ${missingRoles.join(', ')}`,
        'high',
        'HIPAA §164.308(a)(3)',
        'Define all required healthcare roles for proper access control'
      );
    }
  }

  // 1.3 Check unique user identification
  const authServiceExists = fileExists('./src/lib/security/auth.service.ts')
  if (authServiceExists != null) {
    const hasUniqueUserIds = fileContains('./src/lib/security/auth.service.ts', /userId|username|email/),
    logCheck(
      'Unique User Identification',
      hasUniqueUserIds,
      hasUniqueUserIds ? 'Unique user identification implemented' : 'No unique user identification found',
      'critical',
      'HIPAA §164.312(a)(2)(i)',
      'Implement unique user identification for each person accessing PHI'
    );
  }

  // 1.4 Check MFA implementation
  const mfaImplemented = fileContains('./src/lib/security/auth.service.ts', /mfa|2fa|totp|speakeasy/i),
  logCheck(
    'Multi-Factor Authentication',
    mfaImplemented,
    mfaImplemented ? 'MFA implementation found' : 'No MFA implementation detected',
    'critical',
    'HIPAA §164.312(a)(2)(i)',
    'Implement multi-factor authentication for all users accessing PHI'
  )
}

function validateAuditControls(): void {
  /* SECURITY: Console statement removed */)...');

  // 2.1 Check audit service implementation
  const auditServiceExists = fileExists('./src/lib/audit/audit.service.ts'),
  logCheck(
    'Audit Service Implementation',
    auditServiceExists,
    auditServiceExists ? 'Audit service found' : 'No audit service implementation',
    'critical',
    'HIPAA §164.312(b)',
    'Implement comprehensive audit logging service'
  )

  if (auditServiceExists != null) {
    const auditContent = getFileContent('./src/lib/audit/audit.service.ts');

    if (auditContent != null) {
      // Check for required audit events
      const missingEvents: string[] = []
      for (const event of HIPAA_CONFIG.requiredAuditEvents) {
        if (!auditContent.includes(event)) {
          missingEvents.push(event);
        }
      }

      logCheck(
        'Required Audit Events Coverage',
        missingEvents.length === 0,
        missingEvents.length === 0
          ? 'All required audit events are logged'
          : `Missing audit events: ${missingEvents.join(', ')}`,
        'high',
        'HIPAA §164.312(b)',
        'Ensure all PHI access and system events are audited'
      );
    }
  }

  // 2.2 Check audit log retention
  const hasRetentionPolicy = fileContains('./src/lib/audit/audit.service.ts', /retention|archive|deleteOld/i),
  logCheck(
    'Audit Log Retention Policy',
    hasRetentionPolicy,
    hasRetentionPolicy ? 'Audit retention policy implemented' : 'No audit retention policy found',
    'high',
    'HIPAA §164.316(b)(2)(i)',
    'Implement audit log retention for minimum 6 years as required by HIPAA'
  )
}

function validateEncryption(): void {
  /* SECURITY: Console statement removed */(2)(iv) & §164.312(e))...');

  // 3.1 Check encryption service
  const encryptionFiles = [
    './src/services/encryption_service.ts',
    './src/services/encryption_service_secure.ts'
  ]

  let encryptionImplemented = false;
  let strongEncryption = false;

  for (const file of encryptionFiles) {
    if (fileExists(file)) {
      encryptionImplemented = true;
      const content = getFileContent(file);
      if (content && (content.includes('AES-256') || content.includes('aes-256-gcm'))) {
        strongEncryption = true;
      }
    }
  }

  logCheck(
    'Encryption Service Implementation',
    encryptionImplemented,
    encryptionImplemented ? 'Encryption service found' : 'No encryption service detected',
    'critical',
    'HIPAA §164.312(a)(2)(iv)',
    'Implement field-level encryption for all PHI data'
  );

  logCheck(
    'Strong Encryption Algorithm',
    strongEncryption,
    strongEncryption ? 'AES-256 encryption detected' : 'Strong encryption not confirmed',
    'critical',
    'HIPAA §164.312(a)(2)(iv)',
    'Use AES-256 or equivalent strong encryption for PHI protection'
  );

  // 3.2 Check for encryption at rest
  const prismaSchemaExists = fileExists('./prisma/schema.prisma')
  if (prismaSchemaExists != null) {
    const hasEncryptedFields = fileContains('./prisma/schema.prisma', /@encrypted|encrypt/i),
    logCheck(
      'Encryption at Rest',
      hasEncryptedFields,
      hasEncryptedFields ? 'Database field encryption configured' : 'No database encryption detected',
      'critical',
      'HIPAA §164.312(a)(2)(iv)',
      'Configure database-level encryption for all PHI fields'
    );
  }

  // 3.3 Check transmission security
  const hasHttpsConfig = fileContains('./next.config.ts', /https|ssl|tls/) ||
                        fileContains('./next.config.js', /https|ssl|tls/),
  logCheck(
    'Transmission Security (HTTPS/TLS)',
    hasHttpsConfig,
    hasHttpsConfig ? 'HTTPS/TLS configuration found' : 'No transmission security configuration',
    'critical',
    'HIPAA §164.312(e)(1)',
    'Configure HTTPS/TLS for all data transmission'
  )
}

function validateIntegrityControls(): void {
  /* SECURITY: Console statement removed */(1))...');

  // 4.1 Check for data integrity measures
  const hasDataValidation = fileExists('./src/lib/validation/') ||
                           findFilesWithPattern('./src', /validation|validator/i).length > 0

  logCheck(
    'Data Validation Implementation',
    hasDataValidation,
    hasDataValidation ? 'Data validation mechanisms found' : 'No data validation detected',
    'high',
    'HIPAA §164.312(c)(1)',
    'Implement data validation to ensure PHI integrity'
  );

  // 4.2 Check for checksums or hashing
  const hasIntegrityChecks = fileContains('./src/services/encryption_service_secure.ts', /hash|checksum|integrity/i),
  logCheck(
    'Data Integrity Checks',
    hasIntegrityChecks,
    hasIntegrityChecks ? 'Data integrity checks implemented' : 'No integrity verification found',
    'high',
    'HIPAA §164.312(c)(2)',
    'Implement cryptographic hashing for data integrity verification'
  )
}

function validateBusinessAssociateCompliance(): void {
  /* SECURITY: Console statement removed */)...');

  // 5.1 Check for BA agreement documentation
  const baDocsExist = fileExists('./docs/compliance/business-associate-agreements/') ||
                     fileExists('./docs/business-associate-agreements/'),
  logCheck(
    'Business Associate Agreement Documentation',
    baDocsExist,
    baDocsExist ? 'BA agreement documentation found' : 'No BA agreement documentation',
    'high',
    'HIPAA §164.308(b)(1)',
    'Maintain signed business associate agreements for all third-party services'
  )

  // 5.2 Check for third-party service integrations
  const hasThirdPartyServices = fileContains('./package.json', /twilio|sendgrid|stripe|aws|google/) ||
                               fileExists('./src/lib/integrations/')

  if (hasThirdPartyServices != null) {
    logWarning(
      'Third-Party Service Integration',
      'Third-party services detected that may process PHI',
      'Ensure all third-party services have signed BAAs and are HIPAA compliant'
    );
  }
}

function validateBreachNotification(): void {
  /* SECURITY: Console statement removed */...');

  // 6.1 Check for incident response procedures
  const hasIncidentResponse = fileExists('./docs/security/incident-response-plan.md') ||
                             fileExists('./src/lib/security/incident-response.service.ts'),
  logCheck(
    'Incident Response Plan',
    hasIncidentResponse,
    hasIncidentResponse ? 'Incident response procedures found' : 'No incident response plan',
    'high',
    'HIPAA §164.404(a)(1)',
    'Develop and maintain incident response plan for breach notification'
  )

  // 6.2 Check for breach notification service
  const hasBreachNotification = fileExists('./src/lib/security/breach-notification.service.ts') ||
                               fileContains('./src/lib/notifications/', /breach|incident/i),
  logCheck(
    'Breach Notification System',
    hasBreachNotification,
    hasBreachNotification ? 'Breach notification system implemented' : 'No breach notification system',
    'critical',
    'HIPAA §164.404(b)',
    'Implement automated breach notification system'
  )
}

function validateWorkforceTraining(): void {
  /* SECURITY: Console statement removed */(5))...');

  // 7.1 Check for training documentation
  const hasTrainingDocs = fileExists('./docs/training/') ||
                         fileExists('./docs/workforce-training/'),
  logCheck(
    'Workforce Training Documentation',
    hasTrainingDocs,
    hasTrainingDocs ? 'Training documentation found' : 'No training documentation',
    'medium',
    'HIPAA §164.308(a)(5)(i)',
    'Develop comprehensive HIPAA training materials for all workforce members'
  )

  // 7.2 Check for security awareness
  const hasSecurityAwareness = fileExists('./docs/security/security-awareness.md') ||
                              fileExists('./docs/policies/security-policies.md'),
  logCheck(
    'Security Awareness Program',
    hasSecurityAwareness,
    hasSecurityAwareness ? 'Security awareness documentation found' : 'No security awareness program',
    'medium',
    'HIPAA §164.308(a)(5)(ii)(B)',
    'Establish ongoing security awareness and training program'
  )
}

function generateComplianceReport(): void {
  // Calculate compliance score
  results.complianceScore = Math.round((results.passedChecks / results.totalChecks) * 100)

  /* SECURITY: Console statement removed */);
  /* SECURITY: Console statement removed */
  /* SECURITY: Console statement removed */);
  /* SECURITY: Console statement removed */
  /* SECURITY: Console statement removed */
  /* SECURITY: Console statement removed */
  /* SECURITY: Console statement removed */
  /* SECURITY: Console statement removed */
  /* SECURITY: Console statement removed */
  /* SECURITY: Console statement removed */
  /* SECURITY: Console statement removed */}`);

  // Compliance status
  let _status = '🔴 NON-COMPLIANT'
  if (results.complianceScore >= 95 && results.criticalIssues === 0) {
    _status = '🟢 COMPLIANT';
  } else if (results.complianceScore >= 80 && results.criticalIssues === 0) {
    _status = '🟡 MOSTLY COMPLIANT';
  }

  /* SECURITY: Console statement removed */

  // Failed checks details
  if (results.failedChecks.length > 0) {
    /* SECURITY: Console statement removed *//* SECURITY: Console statement removed */);

    results.failedChecks.forEach((check, index) => {
      const _severityIcon = check.severity === 'critical' ? '🚨' :
                          check.severity === 'high' ? '⚠️' : '⚡';
      /* SECURITY: Console statement removed */
      /* SECURITY: Console statement removed */
      /* SECURITY: Console statement removed */
      if (check.remediation) {
        /* SECURITY: Console statement removed */
      }
      /* SECURITY: Console statement removed */
    });
  }

  // Warnings
  if (results.warnings.length > 0) {
    /* SECURITY: Console statement removed *//* SECURITY: Console statement removed */);

    results.warnings.forEach((warning, index) => {
      /* SECURITY: Console statement removed */
      /* SECURITY: Console statement removed */
      /* SECURITY: Console statement removed */
      /* SECURITY: Console statement removed */
    });
  }

  // Save results to file
  const reportPath = './docs/compliance/hipaa-validation-report.json'
  try {
    // Ensure directory exists
    const dir = path.dirname(reportPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    /* SECURITY: Console statement removed */
  } catch (error) {
    /* SECURITY: Console statement removed */
  }

  /* SECURITY: Console statement removed */);

  // Exit with appropriate code
  process.exit(results.criticalIssues > 0 ? 1 : 0)
}

// Main execution
function main(): void {
  /* SECURITY: Console statement removed *//* SECURITY: Console statement removed */
  /* SECURITY: Console statement removed */

  try {
    validateAccessControls(),
    validateAuditControls();
    validateEncryption(),
    validateIntegrityControls();
    validateBusinessAssociateCompliance(),
    validateBreachNotification();
    validateWorkforceTraining(),
    generateComplianceReport();
  } catch (error) {
    /* SECURITY: Console statement removed */
    process.exit(1)
  }
}

// Execute if run directly
if (require.main === module) {
  main()
export {
  main as validateHIPAACompliance,
  HIPAA_CONFIG,
  type HIPAAConfig,
  type ValidationResult,
  type ComplianceResults
};
