# @promaster-sdk/react-properties-selector

[![npm version][version-image]][version-url]
[![code style: prettier][prettier-image]][prettier-url]
[![types][types-image]][types-url]
[![MIT license][license-image]][license-url]

User interface for selecting a valid property value set

## Introduction

A common task in product selection tools is to have an UI that allows the user to make a valid `PropertyValueSet` selection for a product given it's `PropertyFilter` constraints. This package contains a react components for showing this UI and handling invalid selections.

This package uses [hooks](https://reactjs.org/docs/hooks-reference.html) and [prop-getters](https://kentcdodds.com/blog/how-to-give-rendering-control-to-users-with-prop-getters/) to create headless UI components. Similar to [downshift](https://github.com/downshift-js/downshift) and [react-table](https://github.com/tannerlinsley/react-table).

> NOTE: Starting with v7 the old component based versions of the selectors are deprecated. See the [old README](README_v6.md) for info on them.

## Installation

```bash
npm install --save @promaster-sdk/react-properties-selector
```

The library is compiled to ES5 and no polyfills are required.

## How to run

This is a library of react components so it cannot be run directly. To demonstrate and test the react component [react-storybook](https://storybook.js.org/) is used. To start storybook just run:

```bash
yarn storybook
```

## Examples

The [storybooks stories](https://github.com/promaster-sdk/property/tree/master/packages/_stories/src/react-properties-selector) is currently the best examples how to use this package.

## Available hooks

### usePropertiesSelector

```ts
const sel = PropertiesSelector.usePropertiesSelector({
  units,
  unitsFormat,
  unitLookup,
  productProperties: productProperties,
  selectedProperties: state,
  onChange: (properties: PropertyValueSet.PropertyValueSet, _changedProperties: ReadonlyArray<string>) => {
    setState(properties);
  },
});
```

[version-image]: https://img.shields.io/npm/v/@promaster-sdk/react-properties-selector.svg?style=flat
[version-url]: https://www.npmjs.com/package/@promaster-sdk/react-properties-selector
[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat
[prettier-url]: https://github.com/prettier/prettier
[types-image]: https://img.shields.io/npm/types/scrub-js.svg
[types-url]: https://www.typescriptlang.org/
[license-image]: https://img.shields.io/github/license/promaster-sdk/property.svg?style=flat
[license-url]: https://opensource.org/licenses/MIT
