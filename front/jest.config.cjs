module.exports = {
	testEnvironment: "jsdom",
	transform: { "^.+\\.[jt]sx?$": "babel-jest" },
	moduleNameMapper: {
		"\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/fileMock.cjs",
		"\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.cjs",
	},
	setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"],
	testMatch: ["<rootDir>/src/**/__tests__/**/*.test.[jt]sx?"],
	watchman: false,
};
