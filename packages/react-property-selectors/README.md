# @promaster-sdk/react-property-selectors

[![npm version][version-image]][version-url]
[![code style: prettier][prettier-image]][prettier-url]
[![types][types-image]][types-url]
[![MIT license][license-image]][license-url]

Hooks for building UI for selection of a single property value.

## Introduction

A common task in product selection tools is to have an UI that allows the user to make a valid property value selection. This package contains a react components for showing different UI for selection of a single property, such as a dropdown, textbox etc.

This package uses [hooks](https://reactjs.org/docs/hooks-reference.html) and [prop-getters](https://kentcdodds.com/blog/how-to-give-rendering-control-to-users-with-prop-getters/) to create headless UI components. Similar to [downshift](https://github.com/downshift-js/downshift) and [react-table](https://github.com/tannerlinsley/react-table).

> NOTE: Starting with v7 the old component based versions of the selectors are deprecated. See the [old README](README_v6.md) for info on them.

## Installation

`npm install --save @promaster-sdk/react-property-selectors`

The library is compiled to ES5 and no polyfills are required.

## How to run

This is a library of react components so it cannot be run directly. To demonstrate and test the react component [react-storybook](https://storybook.js.org/) is used. To start storybook just run:

```bash
yarn storybook
```

## Examples

The [storybooks stories](https://github.com/promaster-sdk/property/tree/master/packages/_stories/src/react-property-selectors) is currently the best examples how to use this package.

## Available hooks

### useAmountInputBox

```ts
const sel = useAmountInputBox({
  value: state.amount,
  inputUnit: state.selectedUnit,
  inputDecimalCount: state.selectedDecimalCount,
  onValueChange,
  readonly: false,
  errorMessage: "",
  isRequiredMessage: "Is required",
  notNumericMessage: "Not numeric",
  debounceTime: 350,
});
```

### useAmountFormatSelector

```ts
const sel = useAmountFormatSelector({
  selectedUnit: state.selectedUnit,
  selectedDecimalCount: state.selectedDecimalCount,
  onFormatChanged: (selectedUnit: Unit.Unit<unknown>, selectedDecimalCount: number) =>
    setState(merge(state, { selectedUnit, selectedDecimalCount })),
  onFormatCleared: () =>
    setState(
      merge(state, {
        selectedUnit: BaseUnits.Meter,
        selectedDecimalCount: 2,
      })
    ),
  unitsFormat: unitsFormat,
  units: units,
});
```

### useAmountPropertySelector

```ts
const sel = useAmountPropertySelector({
  fieldName: "a",
  propertyName: "a",
  propertyValueSet: state.propertyValueSet,
  inputUnit: state.selectedUnit,
  inputDecimalCount: state.selectedDecimalCount,
  onValueChange,
  filterPrettyPrint: filterPrettyPrint,
  validationFilter: validationFilter,
  readonly: false,
  isRequiredMessage: "Is required",
  notNumericMessage: "Not numeric",
  onFormatChanged,
  onFormatCleared,
  unitsFormat: unitsFormat,
  units: units,
});
```

### useCheckboxPropertySelector

```ts
const sel = useCheckboxPropertySelector({
  propertyName: "a",
  valueItems: valueItems1,
  propertyValueSet: myState,
  locked: false,
  showCodes: true,
  onValueChange: (pv) => setMyState(PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, myState)),

  filterPrettyPrint: () => "",
  readOnly: false,
});
```

### useComboboxPropertySelector

```ts
const sel = useComboboxPropertySelector({
  propertyName: "a",
  valueItems: valueItems1,
  propertyValueSet: myState,
  locked: false,
  showCodes: true,
  sortValidFirst: true,

  onValueChange: (pv) => setMyState(PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, myState)),

  filterPrettyPrint: filterPrettyPrint,
  readOnly: false,
});
```

### useImageComboboxPropertySelector

```ts
const sel = useImageComboboxPropertySelector({
  propertyName: "b",
  valueItems: valueItems2,
  propertyValueSet: myState,
  locked: false,
  showCodes: true,
  sortValidFirst: true,
  onValueChange: (pv) => setMyState(PropertyValueSet.set("b", pv as PropertyValue.PropertyValue, myState)),

  filterPrettyPrint: filterPrettyPrint,
  readOnly: false,
});
```

### useRadiogroupPropertySelector

```ts
const sel = useRadioGroupPropertySelector({
  propertyName: "a",
  valueItems: valueItems1,
  propertyValueSet: state,
  locked: false,
  showCodes: true,
  onValueChange: (pv) => setState(PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, state)),
  filterPrettyPrint: filterPrettyPrint,
  readOnly: false,
});
```

## useTextboxPropertySelector

```ts
const { getInputProps } = useTextboxPropertySelector({
  propertyName: "a",
  propertyValueSet: myState,
  onValueChange,
  readOnly: false,
  debounceTime: 600,
});
```

[version-image]: https://img.shields.io/npm/v/@promaster-sdk/react-property-selectors.svg?style=flat
[version-url]: https://www.npmjs.com/package/@promaster-sdk/react-property-selectors
[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat
[prettier-url]: https://github.com/prettier/prettier
[types-image]: https://img.shields.io/npm/types/scrub-js.svg
[types-url]: https://www.typescriptlang.org/
[license-image]: https://img.shields.io/github/license/promaster-sdk/property.svg?style=flat
[license-url]: https://opensource.org/licenses/MIT
