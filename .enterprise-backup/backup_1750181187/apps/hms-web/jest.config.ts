import type { Config } from "jest";
/**
 * Jest Configuration - HMS Web Application
 * Hospital Management System - Frontend Testing Configuration
 *
 * Enterprise-grade testing configuration for healthcare applications
 * with comprehensive coverage requirements, security testing, and
 * healthcare-specific test patterns.
 *
 * Features:
 * - TypeScript and React testing support
 * - Healthcare component testing
 * - Security test patterns
 * - Accessibility testing integration
 * - Performance testing setup
 * - FHIR data testing utilities
 * - PHI data handling test validation
 *
 * @version 2.0.0
 * @author HMS Development Team
 * @compliance Healthcare Testing Standards, HIPAA Testing Guidelines
 */

const jestConfig: Config = {
	// Test environment and setup
	preset: "ts-jest",
	testEnvironment: "jsdom", // Changed to jsdom for React component testing

	// TypeScript and JavaScript transformation
	transform: {
		"^.+\\.(ts|tsx)$": [
			"ts-jest",
			{
				tsconfig: {
					jsx: "react-jsx",
					esModuleInterop: true,
					allowSyntheticDefaultImports: true,
				},
			},
		],
		"^.+\\.(js|jsx)$": "babel-jest",
		"^.+\\.(css|scss|sass)$": "identity-obj-proxy",
		"^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$": "jest-transform-stub",
	},

	// Module file extensions
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node", "mjs", "cjs"],

	// Test file discovery
	roots: ["<rootDir>/src", "<rootDir>/tests", "<rootDir>/__tests__"],

	// Test pattern matching (healthcare-specific patterns)
	testMatch: [
		"**/__tests__/**/*.+(ts|tsx|js|jsx)",
		"**/?(*.)+(spec|test).+(ts|tsx|js|jsx)",
		"**/tests/**/*.+(ts|tsx|js|jsx)",
		// Healthcare-specific test patterns
		"**/tests/healthcare/**/*.+(ts|tsx|js|jsx)",
		"**/tests/security/**/*.+(ts|tsx|js|jsx)",
		"**/tests/compliance/**/*.+(ts|tsx|js|jsx)",
		"**/tests/accessibility/**/*.+(ts|tsx|js|jsx)",
		"**/tests/fhir/**/*.+(ts|tsx|js|jsx)",
	],

	// Module name mapping for absolute imports and aliases
	moduleNameMapping: {
		"^@/(.*)$": "<rootDir>/src/$1",
		"^@components/(.*)$": "<rootDir>/src/components/$1",
		"^@lib/(.*)$": "<rootDir>/src/lib/$1",
		"^@utils/(.*)$": "<rootDir>/src/utils/$1",
		"^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
		"^@types/(.*)$": "<rootDir>/src/types/$1",
		"^@services/(.*)$": "<rootDir>/src/services/$1",
		"^@stores/(.*)$": "<rootDir>/src/stores/$1",
		"^@assets/(.*)$": "<rootDir>/src/assets/$1",
		"^@tests/(.*)$": "<rootDir>/tests/$1",
		// Healthcare-specific mappings
		"^@fhir/(.*)$": "<rootDir>/src/lib/fhir/$1",
		"^@compliance/(.*)$": "<rootDir>/src/lib/compliance/$1",
		"^@security/(.*)$": "<rootDir>/src/lib/security/$1",
		"^@healthcare/(.*)$": "<rootDir>/src/lib/healthcare/$1",
	},

	// Setup files
	setupFilesAfterEnv: [
		"<rootDir>/tests/setup/jest.setup.ts",
		"<rootDir>/tests/setup/healthcare.setup.ts",
		"<rootDir>/tests/setup/security.setup.ts",
		"<rootDir>/tests/setup/accessibility.setup.ts",
	],

	// Coverage configuration (enterprise healthcare standards)
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageReporters: [
		"json",
		"lcov",
		"text",
		"text-summary",
		"clover",
		"html",
		"cobertura", // For CI/CD integration
	],

	// Coverage thresholds (healthcare application standards)
	coverageThreshold: {
		global: {
			branches: 90,
			functions: 90,
			lines: 90,
			statements: 90,
		},
		// Stricter thresholds for critical healthcare modules
		"./src/lib/security/": {
			branches: 95,
			functions: 95,
			lines: 95,
			statements: 95,
		},
		"./src/lib/compliance/": {
			branches: 95,
			functions: 95,
			lines: 95,
			statements: 95,
		},
		"./src/lib/fhir/": {
			branches: 95,
			functions: 95,
			lines: 95,
			statements: 95,
		},
		"./src/lib/encryption/": {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100,
		},
	},

	// Files to collect coverage from
	collectCoverageFrom: [
		"src/**/*.{ts,tsx,js,jsx}",
		"!src/**/*.d.ts",
		"!src/**/*.stories.{ts,tsx,js,jsx}",
		"!src/**/*.test.{ts,tsx,js,jsx}",
		"!src/**/*.spec.{ts,tsx,js,jsx}",
		"!src/**/__tests__/**",
		"!src/**/__mocks__/**",
		"!src/**/index.{ts,tsx,js,jsx}",
		"!src/vite-env.d.ts",
		"!src/main.tsx",
		// Exclude generated files
		"!src/lib/prisma/generated/**",
		"!src/lib/graphql/generated/**",
	],

	// Coverage path ignore patterns
	coveragePathIgnorePatterns: [
		"/node_modules/",
		"/coverage/",
		"/dist/",
		"/build/",
		"/.next/",
		"/tests/fixtures/",
		"/tests/mocks/",
		"/src/stories/",
	],

	// Test environment options
	testEnvironmentOptions: {
		url: "http://localhost:3000",
		pretendToBeVisual: true,
		resources: "usable",
	},

	// Global test configuration
	globals: {
		"ts-jest": {
			useESM: true,
			isolatedModules: true,
			diagnostics: {
				ignoreCodes: [1343],
			},
			astTransformers: {
				before: [
					{
						path: "node_modules/ts-jest-mock-import-meta",
						options: {
							metaObjectReplacement: {
								url: "https://localhost:3000",
								env: {
									NODE_ENV: "test",
									NEXT_PUBLIC_APP_ENV: "test",
								},
							},
						},
					},
				],
			},
		},
	},

	// Mock and test utilities
	clearMocks: true,
	resetMocks: false,
	restoreMocks: true,

	// Test timeout (healthcare applications may need longer timeouts)
	testTimeout: 10000,

	// Verbose output for healthcare compliance auditing
	verbose: true,

	// Watch plugins for development
	watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],

	// Module directories
	moduleDirectories: ["node_modules", "<rootDir>/src", "<rootDir>/tests"],

	// Ignore patterns
	testPathIgnorePatterns: [
		"/node_modules/",
		"/.next/",
		"/coverage/",
		"/dist/",
		"/build/",
		"/cypress/",
		"/e2e/",
	],

	// Transform ignore patterns
	transformIgnorePatterns: ["node_modules/(?!(.*\\.mjs$|@testing-library|@fhir|@healthcare))"],

	// Maximum worker processes (optimized for CI/CD)
	maxWorkers: process.env.CI ? "2" : "50%",

	// Cache configuration
	cacheDirectory: "<rootDir>/node_modules/.cache/jest",

	// Error handling
	errorOnDeprecated: true,

	// Exit after first test failure in CI
	bail: process.env.CI ? 1 : 0,

	// Force exit after tests complete
	forceExit: process.env.CI ? true : false,

	// Detect open handles (memory leaks)
	detectOpenHandles: true,

	// Detect memory leaks
	logHeapUsage: process.env.CI ? true : false,

	// Test results processor for healthcare compliance reporting
	testResultsProcessor: "jest-sonar-reporter",

	// Custom reporters for healthcare compliance
	reporters: [
		"default",
		[
			"jest-junit",
			{
				outputDirectory: "coverage",
				outputName: "junit.xml",
				uniqueOutputName: "false",
				classNameTemplate: "{classname}",
				titleTemplate: "{title}",
				ancestorSeparator: " › ",
				usePathForSuiteName: "true",
			},
		],
		[
			"jest-html-reporters",
			{
				publicPath: "coverage",
				filename: "jest-report.html",
				openReport: false,
				pageTitle: "HMS Web - Test Report",
				logoImgPath: "./src/assets/logo.png",
				hideIcon: false,
				expand: false,
				testCommand: "npm test",
				enableMergeData: true,
				dataMergeLevel: 1,
			},
		],
	],

	// Node environment setup
	testEnvironment: "jsdom",

	// Additional Jest configuration for healthcare applications
	extraGlobals: [
		"Math",
		"Date",
		"crypto",
		"TextEncoder",
		"TextDecoder",
		"ReadableStream",
		"Request",
		"Response",
		"Headers",
		"URL",
		"URLSearchParams",
		"AbortController",
		"AbortSignal",
	],
};

export default jestConfig;

/**
 * Healthcare Testing Standards Compliance:
 *
 * 1. Security Testing:
 *    - PHI data handling validation
 *    - Authentication/authorization tests
 *    - Input sanitization verification
 *    - Encryption/decryption testing
 *
 * 2. Compliance Testing:
 *    - HIPAA compliance validation
 *    - GDPR compliance checks
 *    - FDA regulation adherence
 *    - Audit trail verification
 *
 * 3. Accessibility Testing:
 *    - WCAG 2.1 AA compliance
 *    - Screen reader compatibility
 *    - Keyboard navigation testing
 *    - Color contrast validation
 *
 * 4. Healthcare Workflow Testing:
 *    - Patient registration flows
 *    - Clinical decision support
 *    - Emergency system responses
 *    - Drug interaction checks
 *
 * 5. Performance Testing:
 *    - Critical path optimization
 *    - Emergency response times
 *    - Database query performance
 *    - Real-time system testing
 *
 * 6. FHIR Standard Testing:
 *    - Resource validation
 *    - Interoperability testing
 *    - Bundle processing
 *    - Terminology validation
 */
