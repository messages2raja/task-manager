module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom", // exact string, no import or require needed
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
