const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
});

module.exports = [
	{
		ignores: [
			"node_modules/",
			".next/",
			"dist/",
			"build/",
			"coverage/",
			"*.config.js",
			"next-env.d.ts",
			".env*",
			"tailwind.config.*",
			"next.config.*",
			"playwright.config.*",
			"*.generated.*",
			"*.auto.*",
			"Hospital-Management-System/",
		],
	},
	...compat.extends("next/core-web-vitals"),
	...compat.extends("@typescript-eslint/recommended"),
	...compat.extends("prettier"),
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: "module",
				ecmaFeatures: {
					jsx: true,
				},
				project: "./tsconfig.json",
			},
		},
		plugins: {
			"@typescript-eslint": typescriptEslint,
		},
		rules: {
			// TypeScript specific rules
			"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/prefer-const": "error",
			"@typescript-eslint/no-non-null-assertion": "error",
			"@typescript-eslint/explicit-function-return-type": "warn",
			"@typescript-eslint/no-unsafe-assignment": "error",
			"@typescript-eslint/no-unsafe-member-access": "error",
			"@typescript-eslint/no-unsafe-call": "error",
			"@typescript-eslint/no-unsafe-return": "error",

			// General rules
			semi: ["error", "always"],
			quotes: ["error", "double"],
			"no-console": "warn",
			"prefer-const": "error",
			"no-var": "error",
			eqeqeq: "error",
			curly: "error",
		},
	},
];
