module.exports = {
  projects: ["<rootDir>/packages/test/*"],
  preset: "ts-jest",
  coverageDirectory: "<rootDir>/coverage/",
  collectCoverageFrom: ["<rootDir>/packages/*/src/**/*.{ts,tsx}"],
  coverageReporters: ["text-summary", "lcov"],
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/packages/tsconfig.settings.json"
    }
  }
};
