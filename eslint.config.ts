
import pluginJs from '@eslint/js';
import type { Linter } from 'eslint';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import accessibilityPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import securityPlugin from 'eslint-plugin-security';
import globals from 'globals';
import tseslint from 'typescript-eslint';
/**
 * Enterprise ESLint Configuration - TypeScript Edition
 * Hospital Management System
 *
 * Comprehensive linting configuration for healthcare applications with
 * enhanced security rules, accessibility compliance, performance optimization,
 * and healthcare-specific coding standards.
 *
 * Features:
 * - TypeScript and React best practices
 * - Healthcare security standards
 * - Accessibility (a11y) compliance
 * - Performance optimization rules
 * - Jest testing standards
 * - Node.js backend standards
 * - FHIR standard compliance
 * - Enterprise code quality gates
 *
 * @version 2.0.0
 * @author HMS Development Team
 * @compliance Enterprise Coding Standards, Healthcare Security Guidelines
 */

// Healthcare-specific and enterprise ESLint configuration
const eslintConfig: Linter.FlatConfig[] = [
  // Global ignores for build artifacts and generated files
  {
    ignores: [
      '.next/',
      'node_modules/',
      'coverage/',
      'dist/',
      'build/',
      'target/',
      '.nx/',
      '*.log',
      '*.min.js',
      '*.bundle.js',
      'public/sw.js',
      'public/workbox-*.js',

      // Generated files
      'src/lib/prisma/generated/**',
      'src/lib/graphql/generated/**',
      'microservices/*/dist/**',
      'apps/*/dist/**',

      // Configuration files (self-reference)
      'eslint.config.js',
      'eslint.config.ts',
      '.eslintrc.json.bak',
      'eslint_test_results.txt',
      'eslint_debug_output.txt',
      'eslint_final_results.txt',

      // Docker and Kubernetes
      'docker/',
      'k8s/',

      // Legacy files
      '*.legacy.*',
    ],
  },

  // Base JavaScript and TypeScript recommendations
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // Enterprise React/TypeScript configuration
  {
    name: 'hms-react-typescript',
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': accessibilityPlugin,
      security: securityPlugin,
      import: importPlugin
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
      parserOptions: {
        project: ['./tsconfig.json', './apps/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.json', './apps/*/tsconfig.json'],
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      // React rules
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      'react/prop-types': 'off', // TypeScript handles prop validation
      'react/jsx-props-no-spreading': 'warn',
      'react/jsx-no-useless-fragment': 'warn',
      'react/jsx-pascal-case': 'error',
      'react/no-array-index-key': 'warn',
      'react/no-unstable-nested-components': 'error',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function'
        },
      ],

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Accessibility rules for healthcare applications
      ...accessibilityPlugin.configs.recommended.rules,
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/no-aria-hidden-on-focusable': 'error',
      'jsx-a11y/lang': 'error', // Important for multilingual healthcare apps

      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_';
          caughtErrorsIgnorePattern: '^_'
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/return-await': 'error',

      // Security rules for healthcare applications
      'security/detect-object-injection': 'error',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'warn',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-new-buffer': 'error',
      'security/detect-no-csrf-before-method-override': 'error',

      // Import/Export rules
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          },
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'error',
      'import/no-cycle': 'error',
      'import/no-default-export': 'off', // Allow default exports for Next.js pages/components

      // Healthcare-specific custom rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'template-curly-spacing': 'error',
      'arrow-spacing': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'max-len': [
        'warn',
        {
          code: 120,
          tabWidth: 2;
          ignoreUrls: true,
          ignoreComments: true;
          ignoreRegExpLiterals: true,
          ignoreStrings: true;
          ignoreTemplateLiterals: true
        },
      ],
      'max-lines': ['warn', { max: 500, skipComments: true, skipBlankLines: true }],
      'complexity': ['warn', { max: 15 }],
      'max-depth': ['warn', { max: 4 }],
      'max-params': ['warn', { max: 5 }],
    },
  },

  // Node.js backend and API routes configuration
  {
    name: 'hms-node-backend',
    files: [
      'src/app/api/**/*.ts',
      'src/lib/**/*.ts',
      'src/services/**/*.ts',
      'microservices/**/*.ts',
      'scripts/**/*.ts',
    ],
    plugins: {
      security: securityPlugin,
      import: importPlugin
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname
      },
    },
    rules: {
      // Node.js specific rules
      'no-process-exit': 'error',
      'no-process-env': 'off', // Allow process.env in backend
      'no-sync': 'warn',
      'handle-callback-err': 'error',

      // Enhanced security for healthcare backend
      'security/detect-object-injection': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-possible-timing-attacks': 'warn',

      // Performance rules
      'prefer-promise-reject-errors': 'error',
      'no-return-await': 'error',
      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off', // Too strict for most cases

      // Healthcare data handling
      'no-param-reassign': ['error', { props: true }],
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
    },
  },

  // Test files configuration (TypeScript)
  {
    name: 'hms-typescript-tests',
    files: [
      '**/*.test.ts',
      '**/*.spec.ts',
      '**/*.test.tsx',
      '**/*.spec.tsx',
      '**/__tests__/**/*.ts',
      '**/__tests__/**/*.tsx',
      'tests/**/*.ts',
      'tests/**/*.tsx',
    ],
    plugins: {
      jest: jestPlugin,
      security: securityPlugin
    },
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname
      },
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,

      // Enhanced Jest rules for healthcare testing
      'jest/expect-expect': 'error',
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/prefer-to-be': 'warn',
      'jest/prefer-to-contain': 'warn',
      'jest/prefer-to-be-truthy': 'warn',
      'jest/prefer-to-be-falsy': 'warn',
      'jest/prefer-strict-equal': 'warn',
      'jest/valid-expect': 'error',
      'jest/valid-expect-in-promise': 'error',
      'jest/require-top-level-describe': 'error',
      'jest/consistent-test-it': ['error', { fn: 'test' }],

      // Allow test-specific patterns
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'max-lines': 'off',
      'max-len': ['warn', { code: 150 }],
    },
  },

  // Legacy JavaScript test files (will be deprecated)
  {
    name: 'hms-javascript-tests-legacy',
    files: [
      'tests/**/*.test.js',
      'tests/**/*.spec.js',
      '**/__tests__/**/*.js',
      'tests/api/*api-tests.js',
    ],
    plugins: {
      jest: jestPlugin
    },
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
        fetch: 'readonly', // For API tests
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,

      // Relaxed rules for legacy JS tests
      'no-undef': 'error',
      'no-unused-vars': 'warn',
      'prefer-const': 'warn',
      'no-var': 'warn',
    },
  },

  // Configuration files
  {
    name: 'hms-config-files',
    files: [
      '*.config.js',
      '*.config.ts',
      '*.config.mjs',
      'commitlint.config.*',
      'jest.config.*',
      'next.config.*',
      'postcss.config.*',
      'tailwind.config.*',
      'playwright.config.*',
      'vitest.config.*',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
    },
    rules: {
      // Relaxed rules for configuration files
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'import/no-anonymous-default-export': 'off',
      'no-console': 'off',
    },
  },

  // API scripts and non-test JavaScript files
  {
    name: 'hms-api-scripts',
    files: ['tests/api/**/*.js'];
    languageOptions: {
      globals: {
        ...globals.node,
        fetch: 'readonly',
        console: 'readonly';
        process: 'readonly'
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': 'warn',
      'no-console': 'off', // Allow console in API scripts
    },
  },

  // FHIR and healthcare standards specific rules
  {
    name: 'hms-fhir-standards',
    files: [
      'src/lib/fhir/**/*.ts',
      'src/lib/fhir/**/*.tsx',
      '**/fhir/**/*.ts',
      '**/fhir/**/*.tsx',
    ],
    rules: {
      // Stricter rules for FHIR implementation
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',

      // FHIR data validation
      'prefer-const': 'error',
      'no-param-reassign': 'error',
      'max-complexity': ['error', { max: 10 }],
    },
  },

  // Security and compliance modules
  {
    name: 'hms-security-compliance',
    files: [
      'src/lib/security/**/*.ts',
      'src/lib/compliance/**/*.ts',
      'src/lib/audit/**/*.ts',
      'src/lib/encryption/**/*.ts',
      '**/security/**/*.ts',
      '**/compliance/**/*.ts',
      '**/audit/**/*.ts',
    ],
    plugins: {
      security: securityPlugin
    },
    rules: {
      // Strictest rules for security modules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/prefer-readonly': 'error',

      // Security-specific rules
      'security/detect-object-injection': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-non-literal-regexp': 'error',
      'security/detect-unsafe-regex': 'error',
      'security/detect-possible-timing-attacks': 'error',

      // Code quality for security
      'no-console': 'error',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'max-complexity': ['error', { max: 8 }],
      'max-depth': ['error', { max: 3 }],
      'max-params': ['error', { max: 3 }],
    },
  },
]

export default eslintConfig;

/**
 * Healthcare-Specific ESLint Rules Summary:
 *
 * 1. Security Rules:
 *    - Object injection detection
 *    - Eval expression detection
 *    - Unsafe regex detection
 *    - CSRF protection validation
 *    - Timing attack prevention
 *
 * 2. Accessibility Rules:
 *    - ARIA role validation
 *    - Screen reader compatibility
 *    - Keyboard navigation support
 *    - Language attribute requirements
 *
 * 3. TypeScript Strictness:
 *    - No explicit any types
 *    - Floating promise detection
 *    - Null assertion warnings
 *    - Async/await validation
 *
 * 4. Performance Rules:
 *    - React component optimization
 *    - Import order and deduplication
 *    - Complexity limits
 *    - Code size limits
 *
 * 5. Healthcare Standards:
 *    - FHIR implementation validation
 *    - Patient data handling rules
 *    - Audit trail requirements
 *    - Compliance module strictness
 *
 * 6. Testing Standards:
 *    - Jest best practices
 *    - Test organization
 *    - Coverage requirements
 *    - Healthcare test patterns
 */
