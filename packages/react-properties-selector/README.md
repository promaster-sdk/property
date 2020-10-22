# @promaster-sdk/react-properties-selector

[![npm version][version-image]][version-url]
[![code style: prettier][prettier-image]][prettier-url]
[![types][types-image]][types-url]
[![MIT license][license-image]][license-url]

User interface for selecting a valid property value set

:warning: **This package is deprecated in favor of the hooks in the @promaster-sdk/react-property-selectors package**.

> :warning: **NOTE:** Starting with v9 the component based versions in the `@promaster-sdk/react-property-selectors` package was moved to this package. Legacy applications must now reference those selectors from this package instead.

> :warning: **NOTE:** Starting with v8 the hooks based versions of the selectors were moved to the `@promaster-sdk/react-property-selectors` package. This package now only has component based versions which are all deprecated.

## Introduction

A common task in product selection tools is to have an UI that allows the user to make a valid `PropertyValueSet` selection for a product given it's `PropertyFilter` constraints. This package contains a react components for showing this UI and handling invalid selections.

## Installation

`npm install --save @promaster-sdk/react-properties-selector`

The library is compiled to ES5 and no polyfills are required.

## Usage

## Usage

### ComboboxPropertySelector

```ts
<ComboboxPropertySelector
  propertyName="..."
  valueItems={...}
  propertyValueSet={...}
  locked={false}
  showCodes={true}
  sortValidFirst={true}
  onValueChange={pv => console.log("onValueChange")}
  filterPrettyPrint={filterPrettyPrint}
  readOnly={false}
/>
```

### TextboxPropertySelector

```ts
<TextboxPropertySelector
  propertyName="..."
  propertyValueSet={...}
  onValueChange={pv => console.log("onValueChange")}
  readOnly={false}
  debounceTime={600}
/>
```

### CheckboxPropertySelector

```ts
<CheckboxPropertySelector
  propertyName="..."
  valueItems={...}
  propertyValueSet={...}
  locked={false}
  showCodes={true}
  onValueChange={pv => console.log("onValueChange")}
  filterPrettyPrint={() => ""}
  readOnly={false}
/>
```

### AmountPropertySelector

```ts
<AmountPropertySelector
  fieldName="..."
  propertyName="..."
  propertyValueSet={...}
  inputUnit={...}
  inputDecimalCount={...}
  onValueChange={pv => console.log("onValueChange)}
  filterPrettyPrint={...}
  validationFilter={...}
  readOnly={false}
  isRequiredMessage="Is required"
  notNumericMessage="Not numeric"
  onFormatChanged={(selectedUnit, selectedDecimalCount) => console.log("onFormatChanged")}
  onFormatCleared={() => console.log("onFormatCleared")}
  unitsFormat={UnitsFormat}
  units={Units}
/>
```

### AmountInputBox

```ts
<AmountInputBox
  value={...}
  inputUnit={...}
  inputDecimalCount={...}
  onValueChange={amount => console.log("changed")}
  readOnly={false}
  errorMessage=""
  isRequiredMessage="Is required"
  notNumericMessage="Not numeric"
  debounceTime={350}
/>
```

### AmountFormatSelector

```ts
<AmountFormatSelector
  selectedUnit={...}
  selectedDecimalCount={...}
  onFormatChanged={(
    selectedUnit: Unit.Unit<any>,
    selectedDecimalCount: number
  ) => console.log(selectedUnit, selectedDecimalCount))}
  onFormatCleared={() => console.log("onFormatCleared")}
  onFormatSelectorActiveChanged={console.log("Toggle format selector")}
  unitsFormat={...}
  units={...}
/>
```

## How to run

This is a library of react components so it cannot be run directly. To demonstrate and test the react component [react-storybook](https://storybook.js.org/) is used. To start storybook just run:

```bash
yarn storybook
```

[version-image]: https://img.shields.io/npm/v/@promaster-sdk/react-properties-selector.svg?style=flat
[version-url]: https://www.npmjs.com/package/@promaster-sdk/react-properties-selector
[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat
[prettier-url]: https://github.com/prettier/prettier
[types-image]: https://img.shields.io/npm/types/scrub-js.svg
[types-url]: https://www.typescriptlang.org/
[license-image]: https://img.shields.io/github/license/promaster-sdk/property.svg?style=flat
[license-url]: https://opensource.org/licenses/MIT
