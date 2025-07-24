/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	swcMinify: false,
	experimental: {
		forceSwcTransforms: false,
	},
	webpack: (config, { isServer }) => {
		config.resolve.fallback = {
			...config.resolve.fallback,
			fs: false,
			net: false,
			tls: false,
			crypto: false,
			path: false,
			os: false,
			stream: false,
			util: false,
			url: false,
			assert: false,
			buffer: false,
			events: false,
			querystring: false,
		};

		// Ignore all problematic modules
		config.externals = config.externals || [];
		if (!isServer) {
			config.externals.push("bcryptjs", "pg", "redis", "ioredis", "prisma", "@prisma/client");
		}

		return config;
	},
	images: {
		domains: ["localhost"],
		unoptimized: true,
	},
	output: "standalone",
	poweredByHeader: false,
	reactStrictMode: false,
	trailingSlash: false,
	distDir: ".next",
};

module.exports = nextConfig;
