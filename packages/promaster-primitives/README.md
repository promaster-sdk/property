# promaster-primitives

[![build status](https://gitlab.divid.se/promaster-sdk/promaster-primitives/badges/master/build.svg)](https://gitlab.divid.se/promaster-sdk/promaster-primitives/commits/master)
[![coverage report](https://gitlab.divid.se/promaster-sdk/promaster-primitives/badges/master/coverage.svg)](https://gitlab.divid.se/promaster-sdk/promaster-primitives/commits/master)

## Introduction

This is the main implementation of `promaster-primitives`. There are other ports and clones but the goal is to keep this single repo well maintained, documented, and tested.

This implementaiton uses a functional approach with data-records and pure functions that uses those data-records. If desired, other approches such as class-based can be built on top by combining the data-records and functions into classes.

## Run-time requirements

This libarary is compiled to ES5 and does not require any polyfills. It does not use any ES6 specific API:s like `Map` or `Set`.

## How to install

### npm registry

The promaster packages reside on a private npm registry at [npm.divid.se](https://npm.divid.se). To use this registry you need to have an account and add two things to your [.npmrc](https://docs.npmjs.com/files/npmrc) file:

1. Authentication information for your registry account.
2. Config for which packages to fetch from the registry.

The registry acts both as a private registry and as a proxy for the public packages at [npmjs.org](http://npmjs.org). To [add authentication information](https://docs.npmjs.com/cli/adduser) and use it for all packages (private and public) use these commands:

`npm adduser --registry=https://npm.divid.se`
`npm set registry https://npm.divid.se`

> NOTE: `npm login` is an alias to `npm adduser` and behaves exactly the same way.

All private packages exists in a [scope](https://docs.npmjs.com/misc/scope). The promaster packages are in the @promaster [scope](https://docs.npmjs.com/getting-started/scoped-packages). If you only want to use the registry for that scope use this command:

`npm adduser --registry=https://npm.divid.se --scope=@promaster`

The above command will add both authentication information and config to use the registry for only the @promaster scope. If you already have the authentication set and just want to add the registry you can use:

`npm config set @promaster:registry https://npm.divid.se`

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

