# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Fproperty@6.0.0...master)

## [v6.0.0](https://github.com/promaster-sdk/property/compare/@promaster%2Fproperty@4.0.0...@promaster-sdk%2Fproperty@6.0.0) - 2022-03-22

- Spaces in property names will no longer be parsed (before they were removed and then parsed so the new behaviour is breaking if you relied on that). See PR [#10](https://github.com/promaster-sdk/property/pull/47). Thanks to [@esakylli](https://github.com/esakylli) for this fix!


## [v4.0.0](https://github.com/promaster-sdk/property/compare/@promaster%2Fproperty@3.0.3...@promaster-sdk%2Fproperty@3.0.4) - 2020-01-09

## Changed

- Upgrade uom package to 4.0.0.

## [v3.0.3](https://github.com/promaster-sdk/property/compare/@promaster%2Fproperty@3.0.2...@promaster-sdk%2Fproperty@3.0.3) - 2019-11-28

## Fixed

- Include `src/` folder in npm package so source maps work correctly in for example webpack.

## [v3.0.2](https://github.com/promaster-sdk/property/compare/@promaster%2Fproperty@3.0.0...@promaster-sdk%2Fproperty@3.0.2) - 2019-11-07

## Fixed

- Add missing parameter for `UnitMap`.

## [v3.0.0](https://github.com/promaster-sdk/property/compare/@promaster%2Fproperty@2.4.0...@promaster-sdk%2Fproperty@3.0.0) - 2019-11-05

## Changed

- Upgrade uom package to 3.0.0. Passing explicit `UnitMap` and `UnitFormatMap` is now required.

## [v2.4.0](https://github.com/promaster-sdk/property/compare/@promaster%2Fproperty@2.3.1...@promaster-sdk%2Fproperty@2.4.0) - 2019-10-18

- License changed to MIT.

## [v2.2.0](https://github.com/promaster-sdk/property/compare/@promaster%2Fproperty@2.0.5...@promaster-sdk%2Fproperty@2.2.0) - 2019-03-08

### Added

- Add functions `filter` and `map`, see [#10](https://github.com/promaster-sdk/property/issues/10). Thanks to [@johankristiansson](https://github.com/johankristiansson) for this addition!

- Added custom compare parameter to all compare functions in `PropertyValue`.

- Added custom compare parameter to `PropertyFilter.isValid`

- Added custom compare parameter to `PropertyValueSet.equals`

- Added custom compare parameter to all Property selectors and to Properties selector.

### Removed

- Function `addPrefixToValues` was removed, use the new `map` function instead.

- Function `getValuesWithoutPrefix` was removed, ust eh new `filter` function instead.

## [v2.0.5](https://github.com/promaster-sdk/property/compare/@promaster%2Fproperty@1.0.1...@promaster%2Fproperty@2.0.5) - 2019-01-01

### Added

- More unit tests

### Fixed

- Some bugs

## [v1.0.1](https://github.com/promaster-sdk/property/compare/@promaster%2Fproperty@1.0.0...@promaster%2Fproperty@1.0.1) - 2018-05-08

### Added

- More unit tests

## v1.0.0 - 2018-05-08

- Initial release.
