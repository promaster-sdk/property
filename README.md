# property

This is a [monorepo](https://medium.com/@maoberlehner/monorepos-in-the-wild-33c6eb246cb9) managed using [lerna](https://lernajs.io/).

For more information see the readme for each package:

- [property](packages/property/README.md)
- [property-filter-pretty](packages/property-filter-pretty/README.md)
- [react-property-selectors](packages/react-property-selectors/README.md)
- [react-properties-selector](packages/react-properties-selector/README.md)
- [variant-listing](packages/variant-listing/README.md)

## How to install

In order to install the packages in this repo you need to have certain settings for npm, see [npm registry](#npm-registry).

Once you have the [npm registry](#npm-registry) setup and working, you can install the package using this command:

`npm install --save @promaster-sdk/property`

## How to develop

For development of the react components, use `yarn storybook` to start storybook in development mode.

For the other packages, use `yarn test:packagename` to test them, or run `yarn test` to test all packages.

## How to publish

The packages are published under the @promaster-sdk orgnization on npmjs.org. To publish run this command:

```
yarn publish-npm
```

It will build the packages and call `lerna publish` which will figure out which packages has changed, ask for new versions of them, and then publish them.
