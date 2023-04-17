// Jest Config for Yarn test using Jest
module.exports = {
	preset: "jest-expo",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	transformIgnorePatterns: [
		// "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)",
		"node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
	],
	collectCoverage: true,
	collectCoverageFrom: [
		"**/*.{js,jsx}",
		"!**/coverage/**",
		"!**/node_modules/**",
		"!**/babel.config.js",
		"!**/jest.setup.js",
	],
	testEnvironment: "node",
	testEnvironmentOptions: {},
	setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
};
