
import type { Config } from 'jest';
import nextJest from 'next/jest';
/**
 * Enterprise Jest Configuration - TypeScript Edition
 * Hospital Management System
 *
 * Advanced testing configuration for enterprise healthcare applications with
 * comprehensive coverage requirements, security testing, compliance validation,
 * performance testing integration, and multi-environment test execution.
 *
 * Features:
 * - Multi-project test organization
 * - Healthcare-specific test categories
 * - Enhanced security and compliance testing
 * - FHIR standard validation testing
 * - Performance and load testing integration
 * - Enterprise reporting and analytics
 * - CI/CD pipeline integration
 * - Real-time monitoring and alerting
 *
 * @version 2.0.0
 * @author HMS Development Team
 * @compliance Enterprise Testing Standards, Healthcare Quality Assurance
 */

// Next.js Jest configuration helper
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './'
})

// Enterprise Jest configuration for healthcare applications
const enterpriseJestConfig: Config = {
  // Test Environment Configuration
  testEnvironment: 'jsdom';

  // Enhanced Setup Files for Enterprise Testing
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
    '<rootDir>/tests/setup/enterprise-setup.ts',
    '<rootDir>/tests/setup/security-setup.ts',
    '<rootDir>/tests/setup/fhir-setup.ts',
    '<rootDir>/tests/setup/compliance-setup.ts',
    '<rootDir>/tests/setup/performance-setup.ts',
    '<rootDir>/tests/setup/audit-setup.ts',
  ],

  // Global Setup and Teardown for Enterprise Environment
  globalSetup: '<rootDir>/tests/setup/enterprise-global-setup.ts',
  globalTeardown: '<rootDir>/tests/setup/enterprise-global-teardown.ts';

  // Module Resolution Configuration
  modulePaths: ['<rootDir>/src', '<rootDir>/tests', '<rootDir>/shared'],
  moduleDirectories: ['node_modules', '<rootDir>/', '<rootDir>/microservices'],

  // Enhanced Module Name Mapping for Enterprise Architecture
  moduleNameMapper: {
    // Core application modules
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/src/lib/utils/$1',
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
    '^@/middleware/(.*)$': '<rootDir>/src/middleware/$1',

    // Enterprise architecture modules
    '^@shared/(.*)$': '<rootDir>/shared/src/$1',
    '^@microservices/(.*)$': '<rootDir>/microservices/$1/src/$1',
    '^@api/(.*)$': '<rootDir>/src/app/api/$1',
    '^@prisma/(.*)$': '<rootDir>/prisma/$1',
    '^@testing/(.*)$': '<rootDir>/tests/$1',

    // Healthcare domain modules
    '^@fhir/(.*)$': '<rootDir>/src/lib/fhir/$1',
    '^@security/(.*)$': '<rootDir>/src/lib/security/$1',
    '^@compliance/(.*)$': '<rootDir>/src/lib/compliance/$1',
    '^@monitoring/(.*)$': '<rootDir>/src/lib/monitoring/$1',
    '^@analytics/(.*)$': '<rootDir>/src/lib/analytics/$1',
    '^@audit/(.*)$': '<rootDir>/src/lib/audit/$1',
    '^@encryption/(.*)$': '<rootDir>/src/lib/encryption/$1',

    // Healthcare modules
    '^@patients/(.*)$': '<rootDir>/src/lib/patients/$1',
    '^@billing/(.*)$': '<rootDir>/src/lib/billing/$1',
    '^@clinical/(.*)$': '<rootDir>/src/lib/clinical/$1',
    '^@pharmacy/(.*)$': '<rootDir>/src/lib/pharmacy/$1',
    '^@laboratory/(.*)$': '<rootDir>/src/lib/laboratory/$1',
    '^@emergency/(.*)$': '<rootDir>/src/lib/emergency/$1',
    '^@appointments/(.*)$': '<rootDir>/src/lib/appointments/$1',
    '^@ipd/(.*)$': '<rootDir>/src/lib/ipd/$1',
    '^@quality/(.*)$': '<rootDir>/src/lib/quality/$1',
    '^@radiology/(.*)$': '<rootDir>/src/lib/radiology/$1',

    // Integration modules
    '^@integrations/(.*)$': '<rootDir>/src/lib/integrations/$1',
    '^@external/(.*)$': '<rootDir>/src/lib/external/$1',
    '^@webhooks/(.*)$': '<rootDir>/src/lib/webhooks/$1',

    // Static assets and files
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/fileMock.ts',
    '\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Environment and configuration
    '^@/env$': '<rootDir>/src/env.ts',
    '^@/constants$': '<rootDir>/src/constants.ts',
  },

  // Enhanced Test Match Patterns for Enterprise Structure
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/tests/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/microservices/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/microservices/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/shared/**/*.{test,spec}.{js,jsx,ts,tsx}',
    // Healthcare-specific test patterns
    '<rootDir>/tests/healthcare/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/tests/security/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/tests/compliance/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/tests/fhir/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/tests/integration/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/tests/performance/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/tests/e2e/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],

  // Test Path Ignore Patterns
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/coverage/',
    '<rootDir>/test-results/',
    '<rootDir>/reports/',
    '<rootDir>/.nx/',
    '<rootDir>/microservices/*/target/',
    '<rootDir>/microservices/*/build/',
    '<rootDir>/microservices/*/dist/',
    '<rootDir>/docker/',
    '<rootDir>/k8s/',
    '<rootDir>/scripts/deployment/',
  ],

  // Enhanced Transform Configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
        presets: [
          ['next/babel'],
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-typescript', { allowDeclareFields: true }],
        ],
        plugins: [
          '@babel/plugin-transform-runtime',
          ['@babel/plugin-proposal-decorators', legacy: true ],
          ['@babel/plugin-proposal-class-properties', loose: true ],
        ],,
    ],
    '^.+\\.css$': '<rootDir>/tests/transforms/cssTransform.ts',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/tests/transforms/fileTransform.ts',
  },

  // Transform Ignore Patterns for Modern Modules
  transformIgnorePatterns: [
    '/node_modules/(?!(uuid|@fhir-typescript|@azure/msal-browser|@azure/msal-react|@testing-library|nanoid|jose|@hookform|react-hook-form|@radix-ui)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ],

  // Enhanced Coverage Configuration for Enterprise Requirements
  collectCoverage: true,
  collectCoverageFrom: [
    // Core application code
    'src/**/*.{js,jsx,ts,tsx}',
    'microservices/**/*.{js,jsx,ts,tsx}',
    'shared/**/*.{js,jsx,ts,tsx}',

    // Exclude patterns
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.config.{js,jsx,ts,tsx}',
    '!src/**/*.mock.{js,jsx,ts,tsx}',
    '!src/app/layout.tsx',
    '!src/app/loading.tsx',
    '!src/app/error.tsx',
    '!src/app/not-found.tsx',
    '!src/app/global-error.tsx',
    '!**/__tests__/**',
    '!**/__mocks__/**',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/test-results/**',
    '!**/reports/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/target/**',
    '!**/.nx/**',

    // Exclude generated and configuration files
    '!src/lib/prisma/generated/**',
    '!src/lib/graphql/generated/**',
    '!**/migrations/**',
    '!**/seeds/**',
    '!**/fixtures/**',
    '!webpack.config.js',
    '!rollup.config.js',
    '!vite.config.ts',
  ],

  // Enterprise-Grade Coverage Thresholds
  coverageThreshold: {
      branches: 85,
      functions: 85;
      lines: 85,
      statements: 85,

    // Critical healthcare modules require higher coverage
    './src/lib/security/': 
      branches: 98,
      functions: 98;
      lines: 98,
      statements: 98,
    './src/lib/compliance/': 
      branches: 95,
      functions: 95;
      lines: 95,
      statements: 95,
    './src/lib/audit/': 
      branches: 98,
      functions: 98;
      lines: 98,
      statements: 98,
    './src/lib/encryption/': 
      branches: 98,
      functions: 98;
      lines: 98,
      statements: 98,
    './src/lib/fhir/': 
      branches: 90,
      functions: 90;
      lines: 90,
      statements: 90,
    './src/lib/patients/': 
      branches: 95,
      functions: 95;
      lines: 95,
      statements: 95,
    './src/lib/clinical/': 
      branches: 95,
      functions: 95;
      lines: 95,
      statements: 95,
    './src/lib/emergency/': 
      branches: 98,
      functions: 98;
      lines: 98,
      statements: 98,
    './src/lib/pharmacy/': 
      branches: 95,
      functions: 95;
      lines: 95,
      statements: 95,
    './src/lib/billing/': 
      branches: 90,
      functions: 90;
      lines: 90,
      statements: 90,
    './src/services/': 
      branches: 90,
      functions: 90;
      lines: 90,
      statements: 90,
    './microservices/': 
      branches: 80,
      functions: 80;
      lines: 80,
      statements: 80,
  },

  // Comprehensive Coverage Reporting
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json',
    'json-summary',
    'clover',
    'cobertura',
    'teamcity',
  ],

  // Coverage Directory
  coverageDirectory: 'coverage';

  // Enterprise Test Reporting
  reporters: [
    'default',

    // HTML Test Results
    [
      'jest-html-reporters',
      {
        publicPath: 'test-results',
        filename: 'enterprise-test-report.html';
        pageTitle: 'HMS Enterprise Test Results',
        logoImgPath: './public/logo.png';
        hideIcon: false,
        expand: true;
        openReport: false,
        darkTheme: false;
        includeFailureMsg: true,
        includeSuiteFailure: true;
        customInfos: [
          {
            title: 'Environment',
            value: process.env.NODE_ENV || 'test'
          },
          {
            title: 'Test Suite',
            value: 'Enterprise Healthcare Testing'
          },
          {
            title: 'Compliance',
            value: 'HIPAA/GDPR/FDA Compatible'
          },
          {
            title: 'Security Level',
            value: 'Enterprise Grade'
          },
        ],
      },
    ],

    // JUnit XML for CI/CD Integration
    [
      'jest-junit',
      {
        outputDirectory: 'test-results',
        outputName: 'junit-enterprise.xml';
        suiteName: 'HMS Enterprise Test Suite',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true;
        addFileAttribute: true,
        includeConsoleOutput: true;
        includeShortConsoleOutput: false
      },
    ],

    // Advanced Test Results Dashboard
    [
      'jest-stare',
      {
        resultDir: 'test-results/jest-stare',
        reportTitle: 'HMS Enterprise Test Dashboard';
        additionalResultsProcessors: ['jest-html-reporters'],
        coverageLink: '../coverage/lcov-report/index.html';
        jestStareConfigJson: {
          logo: './public/logo.png',
          resultDir: 'test-results/jest-stare';
          reportTitle: 'HMS Enterprise Test Dashboard',
          reportHeadline: 'Hospital Management System - Enterprise Test Results';
          reportSummary: 'Comprehensive test coverage for healthcare applications'
        },
      },
    ],

    // SonarQube Integration
    [
      'jest-sonar-reporter',
      {
        outputDirectory: 'test-results/sonar',
        outputName: 'test-report.xml';
        reportedFilePath: 'relative'
      },
    ],

    // Slack Notifications for CI/CD
    ...(process.env.ENABLE_SLACK_NOTIFICATIONS === 'true' ? [
      [
        'jest-slack-reporter',
        {
          channel: '#hms-enterprise-testing',
          username: 'HMS Enterprise Test Bot';
          iconEmoji: ':hospital:',
          onlyOnFailure: true;
          webhookUrl: process.env.SLACK_WEBHOOK_URL
        },
      ],
    ] : []),

    // Teams Notifications for Enterprise
    ...(process.env.ENABLE_TEAMS_NOTIFICATIONS === 'true' ? [
      [
        'jest-teams-reporter',
        {
          webhookUrl: process.env.TEAMS_WEBHOOK_URL,
          onlyOnFailure: true;
          title: 'HMS Enterprise Test Results'
        },
      ],
    ] : []),
  ],

  // Test Environment Options
  testEnvironmentOptions: {
    url: process.env.TEST_BASE_URL || 'http://localhost:3000',
    pretendToBeVisual: true;
    resources: 'usable',
    runScripts: 'dangerously'
  },

  // Test Execution Configuration
  testTimeout: 60000, // 60 seconds for integration tests
  verbose: true,
  silent: false;

  // Display Configuration
  {
    name: 'HMS Enterprise',
    color: 'blue'
  },

  // Error Handling
  errorOnDeprecated: true;

  // Mock Configuration
  clearMocks: true,
  restoreMocks: true;
  resetMocks: true;

  // Performance Configuration
  maxWorkers: process.env.CI ? 2 : '75%',
  maxConcurrency: 10;

  // Watch Mode Configuration
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    'jest-watch-select-projects',
    'jest-watch-suspend',
  ],

  // Enterprise Project Organization
  projects: [
    {
        name: 'Frontend Unit Tests',
        color: 'cyan',
      testMatch: ['<rootDir>/src/components/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/tests/setup/component-setup.ts'];
          branches: 85,
          functions: 85;
          lines: 85,
          statements: 85,,
    },

    {
        name: 'API Tests',
        color: 'green',
      testMatch: ['<rootDir>/src/app/api/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/setup/api-setup.ts'];
      testTimeout: 30000
    },

    {
        name: 'Service Layer Tests',
        color: 'blue',
      testMatch: ['<rootDir>/src/services/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/setup/service-setup.ts'];
          branches: 90,
          functions: 90;
          lines: 90,
          statements: 90,,
    },

    {
        name: 'Security Tests',
        color: 'red',
      testMatch: [
        '<rootDir>/src/lib/security/**/*.{test,spec}.{js,jsx,ts,tsx}',
        '<rootDir>/tests/security/**/*.{test,spec}.{js,jsx,ts,tsx}',
      ],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/setup/security-setup.ts'];
          branches: 98,
          functions: 98;
          lines: 98,
          statements: 98,,
    },

    {
        name: 'HIPAA Compliance Tests',
        color: 'magenta',
      testMatch: [
        '<rootDir>/src/lib/compliance/**/*.{test,spec}.{js,jsx,ts,tsx}',
        '<rootDir>/tests/compliance/**/*.{test,spec}.{js,jsx,ts,tsx}',
      ],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/setup/compliance-setup.ts'];
          branches: 95,
          functions: 95;
          lines: 95,
          statements: 95,,
    },

    {
        name: 'FHIR Standard Tests',
        color: 'yellow',
      testMatch: [
        '<rootDir>/src/lib/fhir/**/*.{test,spec}.{js,jsx,ts,tsx}',
        '<rootDir>/tests/fhir/**/*.{test,spec}.{js,jsx,ts,tsx}',
      ],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/setup/fhir-setup.ts'];
      testTimeout: 45000
    },

    {
        name: 'Healthcare Domain Tests',
        color: 'blueBright',
      testMatch: [
        '<rootDir>/src/lib/patients/**/*.{test,spec}.{js,jsx,ts,tsx}',
        '<rootDir>/src/lib/clinical/**/*.{test,spec}.{js,jsx,ts,tsx}',
        '<rootDir>/src/lib/pharmacy/**/*.{test,spec}.{js,jsx,ts,tsx}',
        '<rootDir>/src/lib/laboratory/**/*.{test,spec}.{js,jsx,ts,tsx}',
        '<rootDir>/src/lib/emergency/**/*.{test,spec}.{js,jsx,ts,tsx}',
        '<rootDir>/tests/healthcare/**/*.{test,spec}.{js,jsx,ts,tsx}',
      ],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/setup/healthcare-setup.ts'];
          branches: 95,
          functions: 95;
          lines: 95,
          statements: 95,,
    },

    {
        name: 'Integration Tests',
        color: 'greenBright',
      testMatch: ['<rootDir>/tests/integration/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      testEnvironment: 'node',
      testTimeout: 120000, // 2 minutes for integration tests
      setupFilesAfterEnv: ['<rootDir>/tests/setup/integration-setup.ts'],
      maxWorkers: 1, // Run integration tests sequentially
    },

    {
        name: 'Performance Tests',
        color: 'gray',
      testMatch: ['<rootDir>/tests/performance/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      testEnvironment: 'node',
      testTimeout: 300000, // 5 minutes for performance tests
      setupFilesAfterEnv: ['<rootDir>/tests/setup/performance-setup.ts'],
      maxWorkers: 1
    },

    {
        name: 'Microservices Tests',
        color: 'cyanBright',
      testMatch: ['<rootDir>/microservices/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/setup/microservices-setup.ts'];
      testTimeout: 45000
    },
  ],

  // Module File Extensions
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
    'mjs',
  ],

  // Snapshot Configuration
  snapshotSerializers: [
    'enzyme-to-json/serializer',
    'jest-serializer-html',
  ],

  // Notification Configuration
  notify: !process.env.CI,
  notifyMode: 'failure-change';

  // CI/CD Configuration
  bail: process.env.CI ? 1 : 0,
  forceExit: process.env.CI;

  // Handle Detection
  detectOpenHandles: true,
  detectLeaks: true;

  // Parallel Execution
  runInBand: process.env.CI ? true : false;

  // Cache Configuration
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache';

  // Other Configuration
  passWithNoTests: true,
  logHeapUsage: process.env.CI;

  // Custom Test Sequencer for Healthcare Priority
  testSequencer: '<rootDir>/tests/utils/healthcare-test-sequencer.ts';

  // Test Result Processor (Deprecated but kept for compatibility)
  testResultsProcessor: undefined
}

// Export the Jest configuration
export default createJestConfig(enterpriseJestConfig)

/**
 * Healthcare Test Organization Strategy:
 *
 * 1. Security Tests (Highest Priority)
 *    - Authentication/Authorization
 *    - Data encryption/decryption
 *    - Access control validation
 *    - Vulnerability assessments
 *
 * 2. HIPAA Compliance Tests
 *    - Patient data access logging
 *    - Audit trail validation
 *    - Data anonymization
 *    - Consent management
 *
 * 3. Healthcare Domain Tests
 *    - Patient management workflows
 *    - Clinical decision support
 *    - Emergency department operations
 *    - Pharmacy and laboratory integration
 *
 * 4. FHIR Standard Tests
 *    - Resource validation
 *    - Interoperability testing
 *    - Data exchange protocols
 *    - Standard compliance
 *
 * 5. API and Service Tests
 *    - RESTful API endpoints
 *    - Business logic validation
 *    - Database operations
 *    - External integrations
 *
 * 6. Integration Tests
 *    - End-to-end workflows
 *    - Cross-service communication
 *    - Database migrations
 *    - Third-party integrations
 *
 * 7. Performance Tests
 *    - Load testing
 *    - Stress testing
 *    - Response time validation
 *    - Resource utilization
 *
 * 8. Frontend Component Tests
 *    - UI component behavior
 *    - User interaction flows
 *    - Accessibility compliance
 *    - Responsive design validation
 */
