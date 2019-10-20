module.exports = {
  preset: "ts-jest",
  // projects: ["<rootDir>/packages/property/jest.config.js"]

  projects: [
    {
      displayName: "property",
      preset: "ts-jest",
      testMatch: ["<rootDir>/packages/property/**/*.test.ts"]
    }
    // {
    //   displayName: "module2",
    //   testMatch: ["<rootDir>/httpdocs/modules/module2/**/*.test.js"]
    // }
  ]

  // coverageDirectory: "<rootDir>/coverage/",
  // collectCoverageFrom: ["<rootDir>/packages/*/lib/**/*.{js,jsx}"],
  // coverageReporters: ["text-summary", "lcov"],
  // // Run only compiled tests (by default typescript files are matched)
  // // testMatch: ["**/?(*.)+(spec|test).[j]s?(x)"],
  // testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
  // // snapshotResolver: "./jest-snapshot-resolver.js",
  // roots: [
  //   "<rootDir>/packages/property/src",
  //   "<rootDir>/packages/property-filter-pretty/src",
  //   "<rootDir>/packages/react-properties-selector/src",
  //   "<rootDir>/packages/react-property-selectors/src",
  //   "<rootDir>/packages/variant-listing/src"
  // ]
};
