module.exports = {
  displayName: "react-properties-selector",
  preset: "ts-jest",
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"],
  collectCoverageFrom: ["**/src/**/!(*.test).{ts,tsx}", "!(**/__tests__/**)"]
};
