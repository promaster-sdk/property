module.exports = {
  displayName: "property",
  preset: "ts-jest",
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"],
  coverageDirectory: "<rootDir>/coverage/",
  collectCoverage: true,
  collectCoverageFrom: ["**/src/**/!(*.test).{ts,tsx}"]
};
