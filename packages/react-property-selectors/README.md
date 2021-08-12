# @promaster-sdk/react-property-selectors

[![npm version][version-image]][version-url]
[![code style: prettier][prettier-image]][prettier-url]
[![types][types-image]][types-url]
[![MIT license][license-image]][license-url]

Hooks for building UI for selection of property values

> :warning: **NOTE:** Starting with v9 the component based versions of the selectors was moved to the `@promaster-sdk/react-properties-selector` package. Legacy applications must now reference those selectors from this package instead.

> :warning: **NOTE**: Starting with v7 the old component based versions of the selectors are deprecated and the documentation was removed from this readme.

## Introduction

A common task in product selection tools is to have an UI that allows the user to make a valid property value selection. This package contains a react components for showing different UI for selection of a single property, such as a dropdown, textbox etc.

This package uses [hooks](https://reactjs.org/docs/hooks-reference.html) and [prop-getters](https://kentcdodds.com/blog/how-to-give-rendering-control-to-users-with-prop-getters/) to create headless UI components. Similar to [downshift](https://github.com/downshift-js/downshift) and [react-table](https://github.com/tannerlinsley/react-table).

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

### usePropertiesSelector

```ts
const sel = usePropertiesSelector<MyItem, MyPropertyInfo>({
  units,
  unitsFormat,
  unitLookup,
  properties: propInfo.properties,
  selectedProperties: pvs,
  onChange: (properties: PropertyValueSet.PropertyValueSet, _changedProperties: ReadonlyArray<string>) => {
    setPvs(properties);
  },
  getUndefinedValueItem: () => ({
    value: undefined,
    sortNo: -1,
    text: "",
    validationFilter: PropertyFilter.Empty,
  }),
  showCodes,
  getItemValue: (item) => item.value,
  getItemFilter: (item) => item.validationFilter,
  getPropertyInfo: (p) => p,
});
```

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
    setState({ ...state, selectedUnit, selectedDecimalCount }),
  onFormatCleared: () =>
    setState({
      ...state,
      selectedUnit: BaseUnits.Meter,
      selectedDecimalCount: 2,
    }),
  unitsFormat: unitsFormat,
  units: units,
});
```

### useAmountPropertySelector

```ts
const sel = useAmountPropertySelector({
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

### useDiscretePropertySelector

```ts
const sel = useDiscretePropertySelector({
  propertyName: "a",
  items: valueItems1,
  propertyValueSet: myState,
  onValueChange: (pv) => setMyState(PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, myState)),
  getUndefinedValueItem: () => undefinedValueItem,
  showCodes: true,
  sortValidFirst: true,
  filterPrettyPrint: filterPrettyPrint,
  getItemValue: (item) => item.value,
  getItemFilter: (item) => item.validationFilter,
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
