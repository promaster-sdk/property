module.exports = {
  projects: [
    {
      displayName: "property",
      preset: "ts-jest",
      testMatch: ["<rootDir>/packages/property/**/*.test.ts"]
    },
    {
      displayName: "react-property-selectors",
      preset: "ts-jest",
      testMatch: [
        "<rootDir>/packages/react-property-selectors/**/*.test.ts?(x)"
      ],
      globals: {
        "ts-jest": {
          tsConfig: "<rootDir>/packages/react-property-selectors/tsconfig.json"
        }
      }
    }
  ]
};
