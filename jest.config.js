module.exports = {
  // projects: ["<rootDir>/packages/*/lib/*"],
  coverageDirectory: "<rootDir>/coverage/",
  collectCoverageFrom: ["<rootDir>/packages/*/lib/**/*.{js,jsx}"],
  coverageReporters: ["text-summary", "lcov"],
  // Run only compiled tests (by default typescript files are matched)
  testMatch: ["**/?(*.)+(spec|test).[j]s?(x)"],
  snapshotResolver: "./jest-snapshot-resolver.js"
};
