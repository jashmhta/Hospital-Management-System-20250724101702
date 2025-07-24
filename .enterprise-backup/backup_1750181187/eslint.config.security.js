// Security-focused ESLint configuration
const { defineConfig } = require("eslint-define-config");

module.exports = defineConfig({
	extends: ["eslint:recommended", "@typescript-eslint/recommended", "plugin:security/recommended"],
	plugins: ["security"],
	rules: {
		// Security rules
		"security/detect-object-injection": "error",
		"security/detect-non-literal-regexp": "error",
		"security/detect-non-literal-fs-filename": "error",
		"security/detect-eval-with-expression": "error",
		"security/detect-pseudoRandomBytes": "error",
		"security/detect-possible-timing-attacks": "error",
		"security/detect-new-buffer": "error",
		"security/detect-unsafe-regex": "error",
		"security/detect-buffer-noassert": "error",
		"security/detect-child-process": "error",
		"security/detect-disable-mustache-escape": "error",
		"security/detect-no-csrf-before-method-override": "error",

		// Additional security-focused rules
		"no-eval": "error",
		"no-implied-eval": "error",
		"no-new-func": "error",
		"no-script-url": "error",
	},
	env: {
		node: true,
		browser: true,
		es2021: true,
	},
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
});
