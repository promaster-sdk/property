module.exports = {
  displayName: "variant-listing",
  preset: "ts-jest",
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"],
  collectCoverageFrom: ["**/src/**/!(*.test).{ts,tsx}", "!(**/__tests__/**)"]
};
