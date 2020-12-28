# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-property-selectors@9.1.0...master)

## [v9.1.0](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-property-selectors@9.0.0...9.1.0)

## Added

- React as peer dependency.

## [v9.0.0](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-property-selectors@8.1.0...9.0.0)

## Changed

- Moved all legacy component based selectors to the `@promaster-sdk/react-properties-selector` package. Legacy applications must now reference those selectors from that package instead.

## [v8.1.0](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-property-selectors@8.0.0...8.1.0)

### Added

- `useAmountFormatSelector()` better compability with <Select> in material-ui by not relying on `select.selectedIndex`.

## [v8.0.0](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-property-selectors@7.0.0...8.0.0)

## Changed

- Added generic DiscretePropertySelector hooks and removed specific hooks for Checkbox, Combobox, ImageCombo, RadioGroup.
- All discrete selectors now share a single hook.
- Move hook for usePropertiesSelector from package react-properties-selector to package react-property-selectores. Now all hooks are in the same package and the react-properties-selector package is deprecated.
- You can pass any items to the hooks. It now uses callbacks to extract data from your items. This means you can use any extra data you want in the items and use that during rendering.

## [v7.0.0](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-property-selectors@6.0.0...@promaster-sdk%2Freact-property-selectors@7.0.0) - 2020-10-15

### Added

- Added hooks-based property-selectors. See PR [#23](https://github.com/promaster-sdk/property/pull/23).
- The component based property-selectors and properties-selector are deprecated and will be removed in a future major release.

## [v6.0.0](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-property-selectors@5.0.0...@promaster-sdk%2Freact-property-selectors@6.0.0) - 2020-10-10

## Changed

- Upgrade uom packcage. Using unitlookup function instead of unit map.

## [v5.0.0](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-property-selectors@4.0.3...@promaster-sdk%2Freact-property-selectors@5.0.0) - 2020-01-09

## Changed

- Upgrade uom package to 4.0.0.

## [v4.0.3](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-property-selectors@4.0.2...@promaster-sdk%2Freact-property-selectors@4.0.3) - 2019-11-28

## Fixed

- Include `src/` folder in npm package so source maps work correctly in for example webpack.

## [v4.0.2](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-property-selectors@4.0.0...@promaster-sdk%2Freact-property-selectors@4.0.2) - 2019-11-07

## Fixed

- Add missing parameter for `UnitMap`.

## [v4.0.0](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-property-selectors@3.5.0...@promaster-sdk%2Freact-property-selectors@4.0.0) - 2019-11-05

## Changed

- Upgrade uom package to 3.0.0. Passing explicit `UnitMap` and `UnitFormatMap` is now required.

### Added

- Added custom units prop to `AmountFormatSelector` and `AmountPropertySelector`.

## [v3.5.0](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-property-selectors@3.4.1...@promaster-sdk%2Freact-property-selectors@3.5.0) - 2019-10-18

- License changed to MIT.

## [v3.4.1](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-property-selectors@3.3.1...@promaster-sdk%2Freact-property-selectors@3.4.1) - 2019-03-08

### Added

- More tests

## v3.3.1 - 2018-05-08

- Initial release.
