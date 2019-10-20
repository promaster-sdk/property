module.exports = {
  displayName: "property-filter-pretty",
  preset: "ts-jest",
  testMatch: ["<rootDir>/src/**/*.test.ts?(x)"],
  coverageDirectory: "<rootDir>/coverage/",
  collectCoverageFrom: ["**/src/**/!(*.test).{ts,tsx}"]
};
