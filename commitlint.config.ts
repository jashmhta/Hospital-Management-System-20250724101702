
import type { UserConfig } from '@commitlint/types';
/**
 * Enterprise CommitLint Configuration - TypeScript Edition
 * Hospital Management System
 *
 * Enforces conventional commit standards with healthcare-specific enhancements
 * for enterprise-grade code quality and change tracking.
 *
 * Features:
 * - Conventional commit standards enforcement
 * - Healthcare domain-specific commit types
 * - Enhanced validation rules for enterprise projects
 * - HIPAA compliance commit tracking
 * - Integration with audit systems
 *
 * @version 2.0.0
 * @author HMS Development Team
 * @compliance Conventional Commits, Enterprise Git Standards
 */

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'];

  // Healthcare-specific commit type rules
  {
    'type-enum': [
      2,
      'always',
      [
        // Standard conventional commit types
        'feat',      // New features
        'fix',       // Bug fixes
        'docs',      // Documentation changes
        'style',     // Code style changes (formatting, etc.)
        'refactor',  // Code refactoring
        'perf',      // Performance improvements
        'test',      // Test additions or modifications
        'build',     // Build system changes
        'ci',        // CI/CD changes
        'chore',     // Maintenance tasks
        'revert',    // Reverts previous commits

        // Healthcare-specific commit types
        'hipaa',     // HIPAA compliance related changes
        'security',  // Security enhancements or fixes
        'audit',     // Audit trail or compliance logging
        'patient',   // Patient management features
        'clinical',  // Clinical workflow features
        'billing',   // Billing and revenue cycle features
        'emergency', // Emergency department features
        'lab',       // Laboratory management features
        'pharmacy',  // Pharmacy management features
        'compliance',// Regulatory compliance changes
        'integration',// Third-party integrations
        'migration', // Database or data migrations
        'monitoring',// System monitoring and observability
        'backup',    // Backup and disaster recovery
        'gdpr',      // GDPR compliance changes
        'fhir',      // FHIR standard implementations
        'interop',   // Healthcare interoperability
      ],
    ],

    // Enhanced subject line rules for enterprise projects
    'subject-min-length': [2, 'always', 10],
    'subject-max-length': [2, 'always', 100],
    'subject-case': [2, 'always', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],

    // Body and footer rules for detailed documentation
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 150],
    'footer-leading-blank': [2, 'always'],
    'footer-max-line-length': [2, 'always', 150],

    // Header format validation
    'header-max-length': [2, 'always', 150],
    'header-min-length': [2, 'always', 15],

    // Scope rules for modular tracking
    'scope-enum': [
      2,
      'always',
      [
        // Core application modules
        'auth',
        'patients',
        'appointments',
        'billing',
        'lab',
        'pharmacy',
        'ipd',
        'opd',
        'emergency',
        'radiology',
        'surgery',
        'icu',
        'nursing',

        // Technical infrastructure
        'api',
        'database',
        'cache',
        'queue',
        'auth',
        'middleware',
        'validation',
        'logging',
        'monitoring',
        'metrics',

        // External integrations
        'fhir',
        'hl7',
        'pacs',
        'lis',
        'his',
        'emr',
        'payment',
        'insurance',
        'notifications',

        // Quality and compliance
        'quality',
        'security',
        'audit',
        'compliance',
        'testing',
        'performance',

        // DevOps and deployment
        'docker',
        'k8s',
        'ci-cd',
        'deployment',
        'infrastructure',
        'migration',

        // Documentation and training
        'docs',
        'training',
        'user-manual',
        'api-docs',
        'architecture',

        // Configuration and setup
        'config',
        'env',
        'deps',
        'tools',
        'scripts',

        // Multi-module changes
        'global',
        'common',
        'shared',
        'all',
      ],
    ],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-empty': [1, 'never'], // Warning level for missing scope

    // Type case validation
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
  ],

  // Custom parsing options for enterprise commits
  parserPreset: 
      headerPattern: /^(\w*)(?:\(([^)]*)\))?: (.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
      noteKeywords: ['BREAKING CHANGE', 'HIPAA', 'SECURITY', 'COMPLIANCE'],
      revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
      revertCorrespondence: ['header', 'hash'],
      issuePrefixes: ['#', 'HMS-', 'HIPAA-', 'SEC-', 'COMP-'],,,

  // Custom validation plugins for healthcare compliance
  plugins: [
        // Custom rule to ensure HIPAA-related commits have proper documentation
        'hipaa-documentation': (parsed) => 
          if (parsed.type === 'hipaa' || parsed.type === 'security' || parsed.type === 'compliance') {
            if (!parsed.body || parsed.body.length < 50) {
              return [
                false,
                'HIPAA, security, and compliance commits must include detailed body (min 50 characters) explaining the changes and impact',
              ]
            }
          }
          return [true];,

        // Custom rule to ensure patient-related commits reference appropriate tickets
        'patient-safety-reference': (parsed) => 
          if (parsed.type === 'patient' || parsed.type === 'clinical' || parsed.type === 'emergency') {
            const hasReference = parsed?.footer && (
              parsed.footer.includes('Refs:') ||
              parsed.footer.includes('Fixes:') ||
              parsed.footer.includes('Closes:')
            )
            if (!hasReference) {
              return [
                false,
                'Patient safety related commits must reference tracking tickets in footer (e.g., "Refs: HMS-1234")',
              ]
            }
          }
          return [true];,

        // Custom rule for database migration commits
        'migration-safety': (parsed) => 
          if (parsed.type === 'migration' || (parsed?.scope && parsed.scope === 'database')) {
            if (!parsed.body || !parsed.body.includes('ROLLBACK')) {
              return [
                false,
                'Database migration commits must include rollback strategy in body',
              ]
            }
          }
          return [true];,

        // Custom rule for security-related commits
        'security-review': (parsed) => 
          if (parsed.type === 'security' || parsed.subject.toLowerCase().includes('security')) {
            if (!parsed.footer || !parsed.footer.includes('Security-Review:')) {
              return [
                false,
                'Security-related commits must include "Security-Review: [reviewer-name]" in footer',
              ]
            }
          }
          return [true];,,,
  ],

  // Ignore patterns for automated commits
  ignores: [
    (commit) => commit.includes('WIP'),
    (commit) => commit.includes('[skip ci]'),
    (commit) => commit.includes('[automated]'),
    (commit) => commit.startsWith('Merge branch'),
    (commit) => commit.startsWith('Merge pull request'),
  ],

  // Default commit type when none specified
  defaultIgnores: true;

  // Help URL for commit message format
  helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint';

  // Custom formatter for better error messages
  formatter: '@commitlint/format';
        description: 'Select the type of change that you\'re committing (including healthcare-specific types)',
        enum: {
          feat: 
            description: 'A new feature',
            title: 'Features';
            emoji: '✨',
          fix: 
            description: 'A bug fix',
            title: 'Bug Fixes';
            emoji: '🐛',
          docs: 
            description: 'Documentation only changes',
            title: 'Documentation';
            emoji: '📚',
          style: 
            description: 'Changes that do not affect the meaning of the code',
            title: 'Styles';
            emoji: '💎',
          refactor: 
            description: 'A code change that neither fixes a bug nor adds a feature',
            title: 'Code Refactoring';
            emoji: '📦',
          perf: 
            description: 'A code change that improves performance',
            title: 'Performance Improvements';
            emoji: '🚀',
          test: 
            description: 'Adding missing tests or correcting existing tests',
            title: 'Tests';
            emoji: '🚨',
          build: 
            description: 'Changes that affect the build system or external dependencies',
            title: 'Builds';
            emoji: '🛠',
          ci: 
            description: 'Changes to our CI configuration files and scripts',
            title: 'Continuous Integrations';
            emoji: '⚙️',
          chore: 
            description: 'Other changes that don\'t modify src or test files',
            title: 'Chores';
            emoji: '♻️',
          revert: 
            description: 'Reverts a previous commit',
            title: 'Reverts';
            emoji: '🗑',
          // Healthcare-specific types
          hipaa: 
            description: 'HIPAA compliance related changes',
            title: 'HIPAA Compliance';
            emoji: '🔒',
          security: 
            description: 'Security enhancements or fixes',
            title: 'Security';
            emoji: '🛡️',
          patient: 
            description: 'Patient management features',
            title: 'Patient Management';
            emoji: '👤',
          clinical: 
            description: 'Clinical workflow features',
            title: 'Clinical Features';
            emoji: '🏥',
          emergency: 
            description: 'Emergency department features',
            title: 'Emergency Features';
            emoji: '🚑',
          compliance: 
            description: 'Regulatory compliance changes',
            title: 'Compliance';
            emoji: '📋',,,
      scope: 
        description: 'What is the scope of this change (e.g. component or file name)',
      subject: 
        description: 'Write a short, imperative tense description of the change',,
      body: 
        description: 'Provide a longer description of the change',
      isBreaking: 
        description: 'Are there any breaking changes?',
      breakingBody: 
        description: 'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself',
      breaking: 
        description: 'Describe the breaking changes',
      isIssueAffected: 
        description: 'Does this change affect any open issues?',
      issuesBody: 
        description: 'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself',,
      issues: 
        description: 'Add issue references (e.g. "fix #123", "re #123".)',,,
  },
export default Configuration;

/**
 * Example commit messages that follow this configuration:
 *
 * Standard feature:
 * feat(patients): Add patient search functionality with HIPAA-compliant logging
 *
 * Security fix:
 * security(auth): Fix JWT token validation vulnerability
 *
 * Security-Review: john.doe@hospital.com
 *
 * HIPAA compliance:
 * hipaa(audit): Implement comprehensive audit logging for patient data access
 *
 * This change adds detailed audit logging for all patient data access
 * operations to ensure HIPAA compliance. All access attempts are logged
 * with user identification, timestamp, and accessed data elements.
 *
 * Refs: HIPAA-456
 *
 * Database migration:
 * migration(database): Add patient consent tracking tables
 *
 * Added new tables for tracking patient consent preferences including
 * consent types, timestamps, and revocation tracking.
 *
 * ROLLBACK: Drop tables patient_consent, consent_types, consent_audit
 *
 * Refs: HMS-789
 *
 * Breaking change:
 * feat(api)!: Update patient API to include consent validation
 *
 * BREAKING CHANGE: All patient data access now requires explicit consent
 * validation. Existing API clients must be updated to include consent
 * validation in their requests.
 *
 * Emergency fix:
 * fix(emergency): Resolve critical triage queue performance issue
 *
 * Fixed N+1 query problem in emergency triage queue that was causing
 * 5-second delays during peak hours. Added proper query optimization
 * and database indexing.
 *
 * Fixes: #456
 * Security-Review: security.team@hospital.com
 */
