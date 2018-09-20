# promaster-sdk

This is a [monorepo](https://medium.com/@maoberlehner/monorepos-in-the-wild-33c6eb246cb9) managed using [lerna](https://lernajs.io/). 

For more information see the readme for each package:

* [property](packages/property/README.md)
* [property-filter-pretty](packages/property-filter-pretty/README.md)
* [react-property-selectors](packages/react-property-selectors/README.md)
* [react-properties-selector](packages/react-properties-selector/README.md)
* [variant-listing](packages/variant-listing/README.md)

## How to install

In order to install the packages in this repo you need to have certain settings for npm, see [npm registry](#npm-registry).

Once you have the [npm registry](#npm-registry) setup and working, you can install the package using this command:

`npm install --save @promaster/property`

## npm registry

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

You may also have to set the `always-auth` option in .npmrc for yarn to work with verdaccio. The complete .npmrc would look like this:

```
@promaster:registry=https://npm.divid.se/
//npm.divid.se/:always-auth=true
//npm.divid.se/:_authToken="**REDUCTED**"
```

## How to publish

Publishing is handed by lerna. Run this command:

```
yarn publish-npm
```

It will build the packages and call `lerna publish` which will figure out which packages has changed, ask for new versions of them, and then publish them.
