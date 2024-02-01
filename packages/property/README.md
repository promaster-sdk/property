# @promaster-sdk/property

[![npm version][version-image]][version-url]
[![code style: prettier][prettier-image]][prettier-url]
[![types][types-image]][types-url]
[![MIT license][license-image]][license-url]

Property values and filtering

## Introduction

When working with products that have many variants it is helpful to think of each variant as a combination of properties instead of an article number. In this library the properties are represented by a set of name/value pairs in the `PropertyValueSet` type. This set of properties can then be checked against a filter represented by the `PropertyFilter` type.

For more information about the property filter syntax please see the [documentation](https://docs.promaster.se/areas/product/#propertyfilters).

## Installation

`npm install --save @promaster-sdk/property`

The library is compiled to ES5 and no polyfills are required.

## Usage

```js
import { PropertyValueSet, PropertyFilter } from "@promaster-sdk/property";

const pvs1 = PropertyValueSet.fromString("a=1;b=2");
const pvs2 = PropertyValueSet.fromString("a=1;b=3");
const pf = PropertyFilter.fromString("a=1,2&b=3");
const pvs1valid = PropertyFilter.isValid(pvs1, pf); // false
const pvs2valid = PropertyFilter.isValid(pvs2, pf); // true
```

The library uses an LRU (Least Recently Used) cache to improve performance. The size of this cache is controlled by the `process.env.PROPERTY_FILTER_CACHE_SIZE` environment variable on node. By default the LRU cache can store up to 20000 items.

[version-image]: https://img.shields.io/npm/v/@promaster-sdk/property.svg?style=flat
[version-url]: https://www.npmjs.com/package/@promaster-sdk/property
[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat
[prettier-url]: https://github.com/prettier/prettier
[types-image]: https://img.shields.io/npm/types/scrub-js.svg
[types-url]: https://www.typescriptlang.org/
[license-image]: https://img.shields.io/github/license/promaster-sdk/property.svg?style=flat
[license-url]: https://opensource.org/licenses/MIT
