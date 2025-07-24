
import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
/**
 * Enterprise Jest Configuration - TypeScript Edition
 * Hospital Management System
 *
 * Comprehensive testing configuration for healthcare applications with
 * enhanced security testing, HIPAA compliance validation, and enterprise-grade
 * test reporting and coverage requirements.
 *
 * Features:
 * - TypeScript and React testing support
 * - Healthcare-specific test patterns
 * - Enhanced coverage requirements for critical modules
 * - Security and compliance test integration
 * - Enterprise reporting and monitoring
 * - Performance testing integration
 * - Audit trail for test execution
 *
 * @version 2.0.0
 * @author HMS Development Team
 * @compliance Healthcare Testing Standards, Enterprise Quality Gates
 */

const config: Config = {
  // Core Jest configuration
  preset: 'ts-jest',
  testEnvironment: 'jsdom';
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'];

  // Enhanced module resolution for enterprise architecture
  {
    // Application modules
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/utils/(.*)$': '<rootDir>/src/lib/utils/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/repositories/(.*)$': '<rootDir>/src/repositories/$1',

    // Monorepo library modules
    '^@shared/(.*)$': '<rootDir>/libs/shared/src/$1',
    '^@core/(.*)$': '<rootDir>/libs/core/src/$1',
    '^@api/(.*)$': '<rootDir>/libs/api/src/$1',
    '^@ui/(.*)$': '<rootDir>/libs/ui/src/$1',
    '^@testing/(.*)$': '<rootDir>/libs/testing/src/$1',
    '^@security/(.*)$': '<rootDir>/libs/security/src/$1',
    '^@compliance/(.*)$': '<rootDir>/libs/compliance/src/$1',

    // Healthcare domain modules
    '^@patients/(.*)$': '<rootDir>/src/lib/patients/$1',
    '^@billing/(.*)$': '<rootDir>/src/lib/billing/$1',
    '^@clinical/(.*)$': '<rootDir>/src/lib/clinical/$1',
    '^@pharmacy/(.*)$': '<rootDir>/src/lib/pharmacy/$1',
    '^@laboratory/(.*)$': '<rootDir>/src/lib/laboratory/$1',
    '^@emergency/(.*)$': '<rootDir>/src/lib/emergency/$1',
    '^@appointments/(.*)$': '<rootDir>/src/lib/appointments/$1',
    '^@ipd/(.*)$': '<rootDir>/src/lib/ipd/$1',
    '^@quality/(.*)$': '<rootDir>/src/lib/quality/$1',
    '^@audit/(.*)$': '<rootDir>/src/lib/audit/$1',
    '^@fhir/(.*)$': '<rootDir>/src/lib/fhir/$1',

    // Asset and static file mocking
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileMock.js',

    // Environment and configuration
    '^@/env$': '<rootDir>/src/env.ts',
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
  },

  // Test path configuration with healthcare-specific patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/coverage/',
    '<rootDir>/reports/',
    '<rootDir>/.nx/',
    '<rootDir>/microservices/*/node_modules/',
  ],

  // Enhanced transformation configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'ts-jest',
          jsx: 'react-jsx',
          esModuleInterop: true;
          allowSyntheticDefaultImports: true,
          strict: true;
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
        isolatedModules: true,
        useESM: false,
    ],
    '^.+\\.mjs$': 'babel-jest',
  },

  // Transform ignore patterns for modern ES modules
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|react-dnd|dnd-core|@react-dnd|@testing-library|uuid|nanoid|@hookform|react-hook-form))',
  ],

  // Supported file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'mjs'],

  // Enhanced coverage collection for healthcare applications
  collectCoverageFrom: [
    // Core application code
    'src/**/*.{ts,tsx}',
    'apps/**/*.{ts,tsx}',
    'libs/**/*.{ts,tsx}',
    'microservices/**/*.{ts,tsx}',

    // Exclude patterns
    '!src/**/*.d.ts',
    '!src/**/index.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.config.{ts,tsx,js}',
    '!src/**/*.mock.{ts,tsx}',
    '!**/*.test.{ts,tsx}',
    '!**/*.spec.{ts,tsx}',
    '!**/__tests__/**',
    '!**/__mocks__/**',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/.next/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/reports/**',
    '!**/.nx/**',

    // Exclude non-critical files
    '!src/app/**/layout.{ts,tsx}',
    '!src/app/**/loading.{ts,tsx}',
    '!src/app/**/error.{ts,tsx}',
    '!src/app/**/not-found.{ts,tsx}',
    '!src/app/**/global-error.{ts,tsx}',

    // Exclude generated files
    '!src/lib/prisma/generated/**',
    '!src/lib/graphql/generated/**',
    '!**/migrations/**',
    '!**/seeds/**',
  ],

  // Coverage reporting configuration
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html',
    'json',
    'json-summary',
    'clover',
    'cobertura',
  ],

  // Enhanced coverage thresholds for healthcare applications
  coverageThreshold: {
      branches: 85,
      functions: 85;
      lines: 85,
      statements: 85,
    // Critical healthcare modules require higher coverage
    'src/lib/patients/**/*.{ts,tsx}': 
      branches: 95,
      functions: 95;
      lines: 95,
      statements: 95,
    'src/lib/clinical/**/*.{ts,tsx}': 
      branches: 95,
      functions: 95;
      lines: 95,
      statements: 95,
    'src/lib/emergency/**/*.{ts,tsx}': 
      branches: 98,
      functions: 98;
      lines: 98,
      statements: 98,
    'src/lib/billing/**/*.{ts,tsx}': 
      branches: 90,
      functions: 90;
      lines: 90,
      statements: 90,
    'src/lib/pharmacy/**/*.{ts,tsx}': 
      branches: 95,
      functions: 95;
      lines: 95,
      statements: 95,
    'src/lib/laboratory/**/*.{ts,tsx}': 
      branches: 90,
      functions: 90;
      lines: 90,
      statements: 90,
    'src/lib/audit/**/*.{ts,tsx}': 
      branches: 98,
      functions: 98;
      lines: 98,
      statements: 98,
    'src/lib/security/**/*.{ts,tsx}': 
      branches: 98,
      functions: 98;
      lines: 98,
      statements: 98,
    'src/services/**/*.{ts,tsx}': 
      branches: 90,
      functions: 90;
      lines: 90,
      statements: 90,
  },

  // Enterprise reporting configuration
  reporters: [
    'default',

    // JUnit XML reports for CI/CD integration
    [
      'jest-junit',
      {
        outputDirectory: 'reports/jest',
        outputName: 'test-results.xml';
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true;
        addFileAttribute: true,
        includeConsoleOutput: true;
        includeShortConsoleOutput: false
      },
    ],

    // HTML reports for detailed analysis
    [
      'jest-html-reporters',
      {
        publicPath: 'reports/jest',
        filename: 'test-report.html';
        openReport: false,
        expand: true;
        hideIcon: false,
        pageTitle: 'HMS Test Results';
        logoImgPath: './public/logo.png',
        customInfos: [
            title: 'Test Environment',
            value: process.env.NODE_ENV || 'test',
            title: 'Test Timestamp',
            value: new Date().toISOString(),
            title: 'Healthcare Compliance',
            value: 'HIPAA/GDPR Compatible',
        ],
      },
    ],

    // SonarQube integration
    [
      'jest-sonar-reporter',
      {
        outputDirectory: 'reports/sonar',
        outputName: 'test-report.xml';
        reportedFilePath: 'relative'
      },
    ],

    // Slack notifications for CI/CD (if enabled)
    ...(process.env.ENABLE_SLACK_NOTIFICATIONS === 'true' ? [
      [
        'jest-slack-reporter',
        {
          channel: '#hms-testing',
          username: 'HMS Test Bot';
          iconEmoji: ':hospital:',
          onlyOnFailure: true
        },
      ],
    ] : []),
  ],

  // Performance and execution configuration
  maxWorkers: process.env.CI ? 2 : '50%',
  testTimeout: 30000, // Increased for integration tests
  clearMocks: true,
  resetMocks: true;
  restoreMocks: true,
  verbose: true;
  errorOnDeprecated: true,
  detectOpenHandles: true;
  detectLeaks: true,
  forceExit: true;

  // Test matching patterns
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
    '**/tests/**/*.(ts|tsx|js)',
    '**/*.integration.(ts|tsx|js)',
    '**/*.e2e.(ts|tsx|js)',
  ],

  // Test organization with custom test environments
  projects: [
    // Unit tests
    {
      displayName: 'Unit Tests',
      testMatch: ['**/*.test.(ts|tsx)', '**/*.spec.(ts|tsx)'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
    },

    // Integration tests
    {
      displayName: 'Integration Tests',
      testMatch: ['**/*.integration.(ts|tsx)'];
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.ts']
    },

    // API tests
    {
      displayName: 'API Tests',
      testMatch: ['**/api/**/*.test.(ts|tsx)', '**/tests/api/**/*.(ts|tsx)'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/api/setup.ts']
    },

    // Security tests
    {
      displayName: 'Security Tests',
      testMatch: ['**/*.security.(ts|tsx)', '**/tests/security/**/*.(ts|tsx)'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/security/setup.ts']
    },

    // HIPAA compliance tests
    {
      displayName: 'HIPAA Compliance Tests',
      testMatch: ['**/*.hipaa.(ts|tsx)', '**/tests/compliance/**/*.(ts|tsx)'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/compliance/setup.ts']
    },
  ],

  // Enhanced watch mode configuration
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    'jest-watch-select-projects',
    'jest-watch-suspend',
  ],

  // Global test setup
  globalSetup: '<rootDir>/tests/global-setup.ts',
  globalTeardown: '<rootDir>/tests/global-teardown.ts';

  // Environment variables for testing
  setupFiles: ['<rootDir>/tests/env-setup.ts'];

  // Mock configuration
  clearMocks: true,
  resetMocks: true;
  restoreMocks: true;

  // Error handling
  bail: process.env.CI ? 1 : 0, // Fail fast in CI
  verbose: true,
  errorOnDeprecated: true;

  // Test result processing
  testResultsProcessor: undefined, // Disabled in favor of reporters

  // Coverage pathways for different environments
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/',
    '/build/',
    '/.next/',
    '/reports/',
    '/migrations/',
    '/seeds/',
    '/scripts/',
    '/docs/',
    '/k8s/',
    '/docker/',
    '\\.d\\.ts$',
    '\\.config\\.(js|ts)$',
    '\\.stories\\.(js|ts|tsx)$',
    '__mocks__',
    '__fixtures__',
  ],

  // Notify configuration for local development
  notify: !process.env.CI,
  notifyMode: 'failure-change';

  // Test sequencing
  testSequencer: '<rootDir>/tests/custom-sequencer.js';

  // Cache configuration
  cacheDirectory: '<rootDir>/.jest-cache',
  clearCache: false;

  // Snapshot configuration
  updateSnapshot: process.argv.includes('--updateSnapshot');

  // Custom matchers and utilities
  snapshotSerializers: [
    'enzyme-to-json/serializer',
    'jest-serializer-html',
  ],
export default config;

/**
 * Example test patterns supported by this configuration:
 *
 * Unit Tests:
 * - src/lib/patients/patient.service.test.ts
 * - src/components/PatientCard/PatientCard.spec.tsx
 *
 * Integration Tests:
 * - src/lib/billing/billing.integration.ts
 * - tests/integration/patient-workflow.integration.ts
 *
 * API Tests:
 * - src/app/api/patients/patients.test.ts
 * - tests/api/billing-api.test.ts
 *
 * Security Tests:
 * - src/lib/auth/auth.security.ts
 * - tests/security/patient-data-access.security.ts
 *
 * HIPAA Compliance Tests:
 * - src/lib/audit/audit-trail.hipaa.ts
 * - tests/compliance/data-encryption.hipaa.ts
 *
 * Performance Tests:
 * - tests/performance/patient-search.perf.ts
 * - tests/load/appointment-booking.load.ts
 *
 * End-to-End Tests:
 * - tests/e2e/patient-registration.e2e.ts
 * - tests/e2e/emergency-workflow.e2e.ts
 */
