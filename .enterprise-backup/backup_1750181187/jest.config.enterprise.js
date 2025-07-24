module.exports = {
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	testPathIgnorePatterns: ["<rootDir>/.next/"],
	moduleNameMapping: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
};
