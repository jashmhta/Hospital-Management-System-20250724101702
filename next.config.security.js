const securityHeaders = [
	{ key: "X-DNS-Prefetch-Control", value: "on" },
	{ key: "X-XSS-Protection", value: "1; mode=block" },
	{ key: "X-Frame-Options", value: "DENY" },
	{ key: "X-Content-Type-Options", value: "nosniff" },
];

module.exports = {
	async headers() {
		return [{ source: "/(.*)", headers: securityHeaders }];
	},
};
