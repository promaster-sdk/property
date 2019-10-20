# @promaster-sdk/property

[![travis build][travis-image]][travis-url]
[![Coverage Status][codecov-image]][codecov-url]
[![code style: prettier][prettier-image]][prettier-url]
[![types][types-image]][types-url]
[![MIT license][license-image]][license-url]

This is a [monorepo](https://medium.com/@maoberlehner/monorepos-in-the-wild-33c6eb246cb9) managed using [lerna](https://lernajs.io/).

The core package of this repo is `@promaster-sdk/property` and the other packages are dependent on this package.

For more information see the readme for each package:

| Package                                                                        | Version                        | README                                                 | CHANGELOG                                                    |
| ------------------------------------------------------------------------------ | ------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------ |
| [@promaster-sdk/property](packages/property)                                   | [![npm version][i-p]][u-p]     | [README](packages/property/README.md)                  | [CHANGELOG](packages/property/CHANGELOG.md)                  |
| [@promaster-sdk/property-filter-pretty](packages/property-filter-pretty)       | [![npm version][i-pfp]][u-pfp] | [README](packages/property-filter-pretty/README.md)    | [CHANGELOG](packages/property-filter-pretty/CHANGELOG.md)    |
| [@promaster-sdk/react-properties-selector](packages/react-properties-selector) | [![npm version][i-rp]][u-rp]   | [README](packages/react-properties-selector/README.md) | [CHANGELOG](packages/react-properties-selector/CHANGELOG.md) |
| [@promaster-sdk/react-property-selectors](packages/react-property-selectors)   | [![npm version][i-rps]][u-rps] | [README](packages/react-property-selectors/README.md)  | [CHANGELOG](packages/react-property-selectors/CHANGELOG.md)  |
| [@promaster-sdk/variant-listing](packages/variant-listing)                     | [![npm version][i-vl]][u-vl]   | [README](packages/variant-listing/README.md)           | [CHANGELOG](packages/variant-listing/CHANGELOG.md)           |

## How to develop

For development of the react components, use `yarn storybook` to start storybook in development mode.

For the other packages, use `yarn test:packagename` to test them, or run `yarn test` to test all packages.

## How to publish

The packages are published under the @promaster-sdk orgnization on npmjs.org. To publish run this command:

```
yarn publish-npm
```

It will build the packages and call `lerna publish` which will figure out which packages has changed, ask for new versions of them, and then publish them.

[travis-image]: https://travis-ci.com/promaster-sdk/property.svg?branch=master&style=flat
[travis-url]: https://travis-ci.com/promaster-sdk/property
[codecov-image]: https://codecov.io/gh/promaster-sdk/property/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/promaster-sdk/property
[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat
[prettier-url]: https://github.com/prettier/prettier
[types-image]: https://img.shields.io/npm/types/scrub-js.svg
[types-url]: https://www.typescriptlang.org/
[license-image]: https://img.shields.io/github/license/promaster-sdk/property.svg?style=flat
[license-url]: https://opensource.org/licenses/MIT
[i-p]: https://img.shields.io/npm/v/@promaster-sdk/property.svg?style=flat
[u-p]: https://www.npmjs.com/package/@promaster-sdk/property
[i-pfp]: https://img.shields.io/npm/v/@promaster-sdk/property-filter-pretty.svg?style=flat
[u-pfp]: https://www.npmjs.com/package/@promaster-sdk/property-filter-pretty
[i-rps]: https://img.shields.io/npm/v/@promaster-sdk/react-property-selectors.svg?style=flat
[u-rps]: https://www.npmjs.com/package/@promaster-sdk/react-property-selectors
[i-rp]: https://img.shields.io/npm/v/@promaster-sdk/react-properties-selector.svg?style=flat
[u-rp]: https://www.npmjs.com/package/@promaster-sdk/react-properties-selector
[i-vl]: https://img.shields.io/npm/v/@promaster-sdk/variant-listing.svg?style=flat
[u-vl]: https://www.npmjs.com/package/@promaster-sdk/variant-listing
