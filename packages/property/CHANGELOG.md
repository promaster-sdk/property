# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased](https://github.com/promaster-sdk/property/compare/@promaster-sdk%2Fproperty@2.3.1...master)

## [v2.2.0](https://github.com/promaster-sdk/property/compare/@promaster%2Fproperty@2.0.5...@promaster-sdk%2Fproperty@2.2.0) - 2019-03-08

### Added

* Add functions `filter` and `map`, see [#10](https://github.com/promaster-sdk/property/issues/10). Thanks to [@JohKri](https://github.com/johankristiansson) for this addition!

* Added custom compare parameter to all compare functions in `PropertyValue`.

* Added custom compare parameter to `PropertyFilter.isValid`

* Added custom compare parameter to `PropertyValueSet.equals`

* Added custom compare parameter to all Property selectors and to Properties selector.

### Removed

* Function `addPrefixToValues` was removed, use the new `map` function instead.

* Function `getValuesWithoutPrefix` was removed, ust eh new `filter` function instead.

## [v2.0.5](https://github.com/promaster-sdk/property/compare/@promaster%2Fproperty@1.0.1...@promaster%2Fproperty@2.0.5) - 2019-01-01

### Added

* More unit tests

### Fixed

* Some bugs

## [v1.0.1](https://github.com/promaster-sdk/property/compare/@promaster%2Fproperty@1.0.0...@promaster%2Fproperty@1.0.1) - 2018-05-08

### Added

* More unit tests

## v1.0.0 - 2018-05-08

* Initial release.
