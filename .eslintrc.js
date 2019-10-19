module.exports = {
  extends: "divid",
  parserOptions: {
    project: [
      "./packages/_stories/tsconfig.json",
      "./packages/property/tsconfig.json",
      "./packages/property/test/tsconfig.json",
      "./packages/property-filter-pretty/tsconfig.json",
      "./packages/property-filter-pretty/test/tsconfig.json",
      "./packages/react-properties-selector/tsconfig.json",
      "./packages/react-properties-selector/test/tsconfig.json",
      "./packages/react-property-selectors/tsconfig.json",
      "./packages/react-property-selectors/test/tsconfig.json",
      "./packages/variant-listing/tsconfig.json",
      "./packages/variant-listing/test/tsconfig.json"
    ]
  },
  rules: {
    "import/no-extraneous-dependencies": "off"
  }
};
