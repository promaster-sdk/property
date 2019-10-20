module.exports = {
  displayName: "property",
  preset: "ts-jest",
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"],
  coverageDirectory: "<rootDir>/coverage/",
  collectCoverageFrom: ["**/src/**/!(*.test).{ts,tsx}"]
};
