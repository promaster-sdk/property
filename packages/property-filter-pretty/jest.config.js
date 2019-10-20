module.exports = {
  displayName: "property-filter-pretty",
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/tsconfig.json"
    }
  },
  testMatch: ["<rootDir>/src/**/*.test.ts?(x)"]
};
