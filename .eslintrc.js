module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {},
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'dist/',
    'build/',
    '**/*.d.ts',
    '**/*.min.js',
    '**/*.map'
  ]
};
