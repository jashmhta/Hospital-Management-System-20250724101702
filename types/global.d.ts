// Global type declarations for Hospital Management System

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production" | "test";
			DATABASE_URL: string;
			NEXTAUTH_SECRET: string;
			NEXTAUTH_URL: string;
			[key: string]: string | undefined;
		}
	}
}

// Next.js module declarations
declare module "*.svg" {
	const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
	export default content;
}

declare module "*.png" {
	const content: string;
	export default content;
}

declare module "*.jpg" {
	const content: string;
	export default content;
}

declare module "*.jpeg" {
	const content: string;
	export default content;
}

declare module "*.gif" {
	const content: string;
	export default content;
}

declare module "*.webp" {
	const content: string;
	export default content;
}

export {};
