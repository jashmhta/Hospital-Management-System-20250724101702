// Health check script
const { execSync } = require("child_process");

/* SECURITY: Console statement removed */

const checks = [
	{
		name: "TypeScript Compilation",
		command: "npx tsc --noEmit",
	},
	{
		name: "Dependencies Check",
		command: "npm audit --audit-level=high",
	},
];

let passed = 0;
const total = checks.length;

checks.forEach((check) => {
	try {
		execSync(check.command, { stdio: "pipe" });
		/* SECURITY: Console statement removed */
		passed++;
	} catch (error) {
		/* SECURITY: Console statement removed */
	}
});

/* SECURITY: Console statement removed */
process.exit(passed === total ? 0 : 1);
