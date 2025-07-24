/**
 * Enterprise-grade Prettier Configuration for Hospital Management System
 *
 * This configuration enforces consistent code formatting across the entire
 * HMS codebase to ensure enterprise-level code quality and maintainability.
 */

module.exports = {
  // Core formatting options
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',

  // JSX specific options
  jsxSingleQuote: false,
  jsxBracketSameLine: false,

  // File-specific overrides
  overrides: [
    {
      files: '*.{js,jsx,ts,tsx}',
      options: {
        printWidth: 100,
        tabWidth: 2,
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
        arrowParens: 'always',
      },
    },
    {
      files: '*.{json,jsonc}',
      options: {
        printWidth: 120,
        tabWidth: 2,
        singleQuote: false,
        trailingComma: 'none',
      },
    },
    {
      files: '*.{yml,yaml}',
      options: {
        printWidth: 120,
        tabWidth: 2,
        singleQuote: true,
        bracketSpacing: true,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        singleQuote: false,
        proseWrap: 'always',
      },
    },
  ],
};
