module.exports = {
  // projects: [
  //   {
  //     displayName: "property",
  //     preset: "ts-jest",
  //     globals: {
  //       "ts-jest": {
  //         tsConfig: "<rootDir>/packages/property/tsconfig.json"
  //       }
  //     },
  //     testMatch: ["<rootDir>/packages/property/**/*.test.ts?(x)"]
  //   },
  //   {
  //     displayName: "property-filter-pretty",
  //     preset: "ts-jest",
  //     globals: {
  //       "ts-jest": {
  //         tsConfig: "<rootDir>/packages/property-filter-pretty/tsconfig.json"
  //       }
  //     },
  //     testMatch: ["<rootDir>/packages/property-filter-pretty/**/*.test.ts?(x)"]
  //   },
  //   {
  //     displayName: "react-properties-selector",
  //     preset: "ts-jest",
  //     globals: {
  //       "ts-jest": {
  //         tsConfig: "<rootDir>/packages/react-properties-selector/tsconfig.json"
  //       }
  //     },
  //     testMatch: [
  //       "<rootDir>/packages/react-properties-selector/**/*.test.ts?(x)"
  //     ]
  //   },
  //   {
  //     displayName: "react-property-selectors",
  //     preset: "ts-jest",
  //     globals: {
  //       "ts-jest": {
  //         tsConfig: "<rootDir>/packages/react-property-selectors/tsconfig.json"
  //       }
  //     },
  //     testMatch: [
  //       "<rootDir>/packages/react-property-selectors/**/*.test.ts?(x)"
  //     ]
  //   },
  //   {
  //     displayName: "variant-listing",
  //     preset: "ts-jest",
  //     globals: {
  //       "ts-jest": {
  //         tsConfig: "<rootDir>/packages/variant-listing/tsconfig.json"
  //       }
  //     },
  //     testMatch: ["<rootDir>/packages/variant-listing/**/*.test.ts?(x)"]
  //   }
  // ],
  projects: ["<rootDir>/packages/*/jest.config.js"],
  coverageDirectory: "<rootDir>/coverage/",
  collectCoverageFrom: [
    "<rootDir>/packages/*/src/**/*.ts?(x)",
    "!<rootDir>/packages/_stories/**/*",
    "!<rootDir>/packages/*/src/**/*.test.ts?(x)"
  ]
};
