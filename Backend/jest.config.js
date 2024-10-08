module.exports = {
	// preset: "ts-jest",
	testEnvironment: "node",
	coveragePathIgnorePatterns: ["/node_modules/"],
	globalSetup: './tests/prisma-environment-setup.ts',
	globalTeardown: './tests/prisma-environment-teardown.ts',
};
