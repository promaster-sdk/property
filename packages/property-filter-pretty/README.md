# @promaster-sdk/property-filter-pretty

[![npm version][version-image]][version-url]
[![code style: prettier][prettier-image]][prettier-url]

Pretty printing of property filters

## Introduction

When a user selection of a `PropertyValueSet` is invalid according to a `PropertyFilter` it can be useful to show the filter to the user so he can correct his selections. However showing the raw filter syntax is not very helpful so this package has functions to convert the property filter syntax into human readable form.

## Installation

`npm install --save @promaster-sdk/property-filter-pretty`

The library is compiled to ES5 and no polyfills are required.

## Usage

```js
import { PropertyFilter } from "@promaster-sdk/property";
import {
  filterPrettyPrintIndented,
  FilterPrettyPrintMessagesEnglish
} from "@promaster-sdk/property-filter-pretty";

const pf = PropertyFilter.fromString("a=1,2&b=3");
const pfPretty = filterPrettyPrintIndented(
  FilterPrettyPrintMessagesEnglish,
  2,
  " "
  pf
); // a should equal 1 or 2 and b should equal 3
```

[version-image]: https://img.shields.io/npm/v/@promaster-sdk/property-filter-pretty.svg?style=flat
[version-url]: https://www.npmjs.com/package/@promaster-sdk/property-filter-pretty
[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat
[prettier-url]: https://github.com/prettier/prettier
