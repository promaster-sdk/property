# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-properties-selector@9.0.0...master)

## [v9.0.0](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-properties-selector@8.0.0...@promaster-sdk%2Freact-properties-selector@9.0.0)

## Changed

- Moved all legacy component based selectors from `@promaster-sdk/react-property-selectors` to this package. Legacy applications must now reference those selectors from this package instead.

## [v8.0.0](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-properties-selector@7.0.0...@promaster-sdk%2Freact-properties-selector@8.0.0)

## Changed

- New uom package.

## [v7.0.0](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-properties-selector@6.0.0...@promaster-sdk%2Freact-properties-selector@7.0.0)

## Changed

- Move hook for usePropertiesSelector from package react-properties-selector to package react-property-selectores. Now all hooks are in the same package and the react-properties-selector package is deprecated.

## [v7.0.0](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-properties-selector@6.0.0...@promaster-sdk%2Freact-properties-selector@7.0.0)

### Added

- Added hooks-based properties-selector. See PR [#23](https://github.com/promaster-sdk/property/pull/23).
- The component based property-selectors and properties-selector are deprecated and will be removed in a future major release.

## [v6.0.0](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-properties-selector@5.0.0...@promaster-sdk%2Freact-properties-selector@6.0.0)

## Changed

- Upgrade uom packcage. Using unitlookup function instead of unit map.

## [v5.0.0](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-properties-selector@4.0.3...@promaster-sdk%2Freact-properties-selector@5.0.0)

## Changed

- Upgrade uom package to 4.0.0.

## [v4.0.3](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-properties-selector@4.0.2...@promaster-sdk%2Freact-properties-selector@4.0.3)

## Fixed

- Include `src/` folder in npm package so source maps work correctly in for example webpack.

## [v4.0.2](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-properties-selector@4.0.0...@promaster-sdk%2Freact-properties-selector@4.0.2)

## Fixed

- Add missing parameter for `UnitMap`.

## [v4.0.0](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-properties-selector@3.5.0...@promaster-sdk%2Freact-properties-selector@4.0.0)

## Changed

- Upgrade uom package to 3.0.0. Passing explicit `UnitMap` and `UnitFormatMap` is now required.

## [v3.5.0](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-properties-selector@3.4.1...@promaster-sdk%2Freact-properties-selector@3.5.0)

- License changed to MIT.

## [v3.4.1](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Freact-properties-selector@3.3.1...@promaster-sdk%2Freact-properties-selector@3.4.1)

### Added

- More tests

## v3.3.1 - 2018-05-08

- Initial release.
