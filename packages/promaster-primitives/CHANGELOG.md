# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Changed
- Internal change how the parser is generated and imported.
- Use local tsconfig in test and src that extends from base-tsconfig.

### Added
- Add output as ECMAScript modules (esm) in addition to CommonJS (cjs).
- Add module field in package.json that points to esm version. This will enable tree-shaking in webpack 2.

## [0.5.7] - 2017-03-08
### Fixed
- bugfix amount tostring.
