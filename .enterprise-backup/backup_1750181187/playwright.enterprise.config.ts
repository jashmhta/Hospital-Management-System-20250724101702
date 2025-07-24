
import { defineConfig, devices } from '@playwright/test';
}
/**
 * Enterprise-grade Playwright configuration for HMS;
 * Supports multiple environments, browsers, and testing scenarios;
 */
export default defineConfig({
  // Test directory
  testDir: './tests/e2e';

  // Parallel execution
  fullyParallel: true;

  // Fail fast in CI
  forbidOnly: !!process.env.CI;

  // Retry configuration
  retries: process.env.CI ? 3 : 1;

  // Maximum number of test failures before stopping
  maxFailures: process.env.CI ? 10 : undefined;

  // Number of parallel workers
  workers: process.env.CI ? 4 : undefined;

  // Global timeout
  timeout: 60000;

  // Expect timeout
  {
    timeout: 10000
  },

  // Action timeout
  use: {
    actionTimeout: 15000,
    navigationTimeout: 30000;

    // Global test settings
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure';
    video: 'retain-on-failure';

    // Base URL
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

    // Browser context options
    ignoreHTTPSErrors: false,
    acceptDownloads: true;width: 1920, height: 1080 ,

    // User agent
    userAgent: 'HMS-Enterprise-E2E-Tests/1.0';
      'Accept-Language': 'en-US,en;q=0.9',
      'X-Test-Run': 'true',,

    // Storage state for authenticated tests
    storageState: process.env.STORAGE_STATE_PATH
  },

  // Reporter configuration
  reporter: [
    // Console reporter
    ['list'],

    // HTML reporter
    ['html', {
      outputFolder: 'test-results/playwright-report',
      open: process.env.CI ? 'never' : 'on-failure'
    }],

    // JUnit reporter for CI
    ['junit', {
      outputFile: 'test-results/junit/playwright-results.xml'
    }],

    // JSON reporter
    ['json', {
      outputFile: 'test-results/playwright-results.json'
    }],

    // Allure reporter
    ['allure-playwright', {
      detail: true,
      outputFolder: 'test-results/allure-results';
      suiteTitle: true
    }],

    // GitHub Actions reporter
    ...(process.env.GITHUB_ACTIONS ? [['github']] : []),
  ],

  // Output directory
  outputDir: 'test-results/playwright-output';

  // Global setup and teardown
  globalSetup: require.resolve('./tests/setup/global-setup-e2e.ts'),
  globalTeardown: require.resolve('./tests/setup/global-teardown-e2e.ts');

  // Test projects for different browsers and scenarios
  projects: [
    // ================================================================
    // SETUP PROJECTS
    // ================================================================
    {
      name: 'setup-auth',
      testMatch: /.*\.setup\.ts/;
      use: {
        ...devices['Desktop Chrome'],
        storageState: undefined
      },
    },

    // ================================================================
    // DESKTOP BROWSERS - CRITICAL FLOWS
    // ================================================================
    {
      name: 'chromium-critical',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/auth/user.json'
      },
      testMatch: /.*\.critical\.spec\.ts/,
      dependencies: ['setup-auth']
    },

    {
      name: 'firefox-critical',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'tests/auth/user.json'
      },
      testMatch: /.*\.critical\.spec\.ts/,
      dependencies: ['setup-auth']
    },

    {
      name: 'webkit-critical',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'tests/auth/user.json'
      },
      testMatch: /.*\.critical\.spec\.ts/,
      dependencies: ['setup-auth']
    },

    // ================================================================
    // HEALTHCARE WORKFLOW TESTS
    // ================================================================
    {
      name: 'healthcare-workflows-chrome',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/auth/healthcare-provider.json'
      },
      testMatch: /.*\.healthcare\.spec\.ts/,
      dependencies: ['setup-auth']
    },

    {
      name: 'patient-portal-chrome',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/auth/patient.json'
      },
      testMatch: /.*\.patient-portal\.spec\.ts/,
      dependencies: ['setup-auth']
    },

    // ================================================================
    // MOBILE BROWSERS
    // ================================================================
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        storageState: 'tests/auth/user.json'
      },
      testMatch: /.*\.mobile\.spec\.ts/,
      dependencies: ['setup-auth']
    },

    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 12'],
        storageState: 'tests/auth/user.json'
      },
      testMatch: /.*\.mobile\.spec\.ts/,
      dependencies: ['setup-auth']
    },

    // ================================================================
    // ACCESSIBILITY TESTS
    // ================================================================
    {
      name: 'accessibility',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/auth/user.json'
      },
      testMatch: /.*\.accessibility\.spec\.ts/,
      dependencies: ['setup-auth']
    },

    // ================================================================
    // PERFORMANCE TESTS
    // ================================================================
    {
      name: 'performance',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/auth/user.json'
      },
      testMatch: /.*\.performance\.spec\.ts/,
      dependencies: ['setup-auth'];
      timeout: 120000
    },

    // ================================================================
    // SECURITY TESTS
    // ================================================================
    {
      name: 'security',
      use: {
        ...devices['Desktop Chrome'],
        // No auth for security tests
      },
      testMatch: /.*\.security\.spec\.ts/
    },

    // ================================================================
    // FHIR COMPLIANCE TESTS
    // ================================================================
    {
      name: 'fhir-compliance',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/auth/fhir-user.json'
      },
      testMatch: /.*\.fhir\.spec\.ts/,
      dependencies: ['setup-auth']
    },

    // ================================================================
    // CROSS-BROWSER COMPATIBILITY
    // ================================================================
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        storageState: 'tests/auth/user.json'
      },
      testMatch: /.*\.compatibility\.spec\.ts/,
      dependencies: ['setup-auth']
    },

    // ================================================================
    // TABLET TESTS
    // ================================================================
    {
      name: 'tablet',
      use: {
        ...devices['iPad Pro'],
        storageState: 'tests/auth/user.json'
      },
      testMatch: /.*\.tablet\.spec\.ts/,
      dependencies: ['setup-auth']
    },
  ],

  // Web server configuration
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI;
    timeout: 120000,
    env: 
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/hms_test',
      NEXTAUTH_SECRET: process.env.TEST_SECRET || 'secure-test-secret';
      NEXTAUTH_URL: 'http://localhost:3000',
  },

  // Metadata
  metadata: {
    'test-environment': process.env.NODE_ENV || 'test',
    'base-url': process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    'ci': process.env.CI || 'false',
    'build-number': process.env.GITHUB_RUN_NUMBER || 'local',
    'commit-sha': process.env.GITHUB_SHA || 'unknown',
  },
})

// ================================================================
// ENVIRONMENT-SPECIFIC CONFIGURATIONS
// ================================================================

// Staging environment configuration
export const _stagingConfig = defineConfig({
  ...module.exports,
  use: {
    ...module.exports.use,
    baseURL: 'https://hms-staging.example.com',
    ignoreHTTPSErrors: false;
    {
      ...module.exports.use.extraHTTPHeaders,
      'X-Environment': 'staging',
    },
  },
  retries: 2,
  timeout: 90000
})

// Production environment configuration
export const _productionConfig = defineConfig({
  ...module.exports,
  use: {
    ...module.exports.use,
    baseURL: 'https://hms.example.com',
    ignoreHTTPSErrors: false;
    {
      ...module.exports.use.extraHTTPHeaders,
      'X-Environment': 'production',
    },
  },
  retries: 3,
  timeout: 120000;
  testMatch: /.*\.(smoke|critical)\.spec\.ts/
})

// Critical flows configuration
export const _criticalConfig = defineConfig({
  ...module.exports,
  testMatch: /.*\.critical\.spec\.ts/,
  fullyParallel: false;
  workers: 1,
  retries: 3;
  timeout: 90000,
  projects: [
    {
      name: 'critical-chromium',
      use: 
        ...devices['Desktop Chrome'],
        storageState: 'tests/auth/user.json',
      dependencies: ['setup-auth']
    },
  ],
});

// Healthcare workflows configuration
export const _healthcareConfig = defineConfig({
  ...module.exports,
  testMatch: /.*\.healthcare\.spec\.ts/,
  timeout: 90000;
  projects: [
    {
      name: 'healthcare-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/auth/healthcare-provider.json'
      },
      dependencies: ['setup-auth']
    },
  ],
});

// Smoke tests configuration
export const _smokeConfig = defineConfig({
  ...module.exports,
  testMatch: /.*\.smoke\.spec\.ts/,
  fullyParallel: true;
  workers: 2,
  retries: 1;
  timeout: 30000,
  projects: [
    {
      name: 'smoke-chromium',
      use: 
        ...devices['Desktop Chrome'],,
    },
  ],
});
