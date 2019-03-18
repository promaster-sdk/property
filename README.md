# property

This is a [monorepo](https://medium.com/@maoberlehner/monorepos-in-the-wild-33c6eb246cb9) managed using [lerna](https://lernajs.io/).

For more information see the readme for each package:

| Package                                  | README                                                 | CHANGELOG                                                    |
| ---------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| @promaster-sdk/property                  | [README](packages/property/README.md)                  | [CHANGELOG](packages/property/CHANGELOG.md)                  |
| @promaster-sdk/property-filter-pretty    | [README](packages/property-filter-pretty/README.md)    | [CHANGELOG](packages/property-filter-pretty/CHANGELOG.md)    |
| @promaster-sdk/react-property-selectors  | [README](packages/react-property-selectors/README.md)  | [CHANGELOG](packages/react-property-selectors/CHANGELOG.md)  |
| @promaster-sdk/react-properties-selector | [README](packages/react-properties-selector/README.md) | [CHANGELOG](packages/react-properties-selector/CHANGELOG.md) |
| @promaster-sdk/variant-listing           | [README](packages/variant-listing/README.md)           | [CHANGELOG](packages/variant-listing/CHANGELOG.md)           |

## How to develop

For development of the react components, use `yarn storybook` to start storybook in development mode.

For the other packages, use `yarn test:packagename` to test them, or run `yarn test` to test all packages.

## How to publish

The packages are published under the @promaster-sdk orgnization on npmjs.org. To publish run this command:

```
yarn publish-npm
```

It will build the packages and call `lerna publish` which will figure out which packages has changed, ask for new versions of them, and then publish them.
