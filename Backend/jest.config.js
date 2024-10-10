module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	coveragePathIgnorePatterns: ["/node_modules/"],
	// transform: {
	//     '^.+\\.tsx?$': 'ts-jest',  // Transform TypeScript files
	// },
	// moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	globalSetup: "./tests/prisma-environment-setup.ts",
	globalTeardown: "./tests/prisma-environment-teardown.ts",
};
