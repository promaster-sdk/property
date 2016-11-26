# promaster-primitives

## Introduction

This is the main implementation of `promaster-primitives`. There are other ports and clones but the goal is to keep this single repo well maintained, documented, and tested.

This implementaiton uses a functional approach with data-records and pure functions that uses those data-records. If desired, other approches such as class-based can be built on top by combining the data-records and functions into classes.

## Run-time requirements

This libarary is compiled to ES5 and does not require any polyfills. It does not use any ES6 specific API:s like `Map` or `Set`.

## How to install

### npm registry

To use this package you need to have a user for the npm registry [npm.divid.se](https://npm.divid.se). This registry acts both as a proxy for the public packages at [npmjs.org](http://npmjs.org) and as a private registry. To [login](https://docs.npmjs.com/cli/adduser) and use it for all packages (public and private) use this command:

`npm adduser --registry=https://npm.divid.se`

> NOTE: `npm login` is an alias to `npm adduser` and behaves exactly the same way.

All private packages are in a separate [scope](https://docs.npmjs.com/misc/scope). The promaster packages are in the @promaster [scope](https://docs.npmjs.com/getting-started/scoped-packages). If you only want to use npm.divid.se for the @promaster scope use this command:

`npm adduser --registry=https://npm.divid.se --scope=@promaster`

You can also set the registry withtout logging in using one of these command:

For all packages: `npm set registry https://npm.divid.se`
For @promaster only: `npm config set @promaster:registry https://npm.divid.se`

> NOTE: All settngs will be stored in the [.npmrc](https://docs.npmjs.com/files/npmrc) file in your home directory.

### Installation

Once you have the [promaster npm registry](#npm-registry) setup and working, you can install the package using this command:

`npm install --save @promaster/promaster-primitives`

## Libraries

### Measure

* [Amount](./doc/measure/amount.md)
* [Unit](./doc/measure/unit.md)
* [Units](./doc/measure/units.md)

## How to test

Run `npm test`.

## How to publish

To publish patch (`0.0.x`), minor (`0.x.0`), or major (`x.0.0`) run the
corresponding script:

```
  npm run publish:patch
  npm run publish:minor
  npm run publish:major
```

