module.exports = {
  displayName: "react-property-selectors",
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/tsconfig.json"
    }
  },
  testMatch: ["<rootDir>/src/**/*.test.ts?(x)"]
};
