module.exports = {
  extends: "divid",
  parserOptions: {
    project: [
      "./packages/_stories/tsconfig.json",
      "./packages/property/tsconfig.json",
      "./packages/property-filter-pretty/tsconfig.json",
      "./packages/react-properties-selector/tsconfig.json",
      "./packages/react-property-selectors/tsconfig.json",
      "./packages/variant-listing/tsconfig.json",
    ],
  },
  rules: {
    // Should be fixed in eslint-config-divid:
    "@typescript-eslint/no-unused-vars": "off", // Should allow underscored?
    // Enable these rules once code is fixed (or perhaps disable in eslint-config-divid):
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/consistent-type-imports": "off",
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/no-unnecessary-condition": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "@typescript-eslint/prefer-readonly-parameter-types": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/prefer-optional-chain": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-redeclare": "off", // We want to name type same as const
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/dot-notation": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-implicit-any-catch": "off",
    "@typescript-eslint/init-declarations": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/prefer-enum-initializers": "off",
    "import/no-extraneous-dependencies": "off",
    "@typescript-eslint/no-extra-non-null-assertion": "off",
    "@typescript-eslint/no-implied-eval": "off",
    "@typescript-eslint/no-base-to-string": "off",
  },
};
