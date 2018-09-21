# @promaster/property

[![code style: prettier][prettier-image]][prettier-url]

Property values and filtering

## Introduction

When working with products that have many variants it is helpful to think of each variant as a combination of properties instead of an article number. In this library the properties are represented by a set of name/value pairs in the `PropertyValueSet` type. This set of properties can then be checked against a filter represented by the `PropertyFilter` type.

For more information about the property filter syntax please see the [documentation](https://docs.promaster.se/areas/product/#propertyfilters).

## Installation

`npm install --save @promaster/property`

The library is compiled to ES5 and no polyfills are required.

## Usage

```js
import { PropertyValueSet, PropertyFilter } from "@promaster/property";

const pvs1 = PropertyValueSet.fromString("a=1;b=2");
const pvs2 = PropertyValueSet.fromString("a=1;b=3");
const pf = PropertyFilter.fromString("a=1,2&b=3");
const pvs1valid = PropertyFilter.isValid(pvs1, pf); // false
const pvs2valid = PropertyFilter.isValid(pvs2, pf); // true
```

[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat
[prettier-url]: https://github.com/prettier/prettier
