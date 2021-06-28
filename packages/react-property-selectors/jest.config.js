module.exports = {
  displayName: "react-property-selectors",
  preset: "ts-jest",
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"],
  collectCoverageFrom: ["**/src/**/!(*.test).{ts,tsx}", "!(**/__tests__/**)"],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/jest-setup.ts"],
};
