# @promaster-sdk/react-property-selectors

[![code style: prettier][prettier-image]][prettier-url]

User interface for selecting single property values

## Introduction

A common task in product selection tools is to have an UI that allows the user to make a valid property value selection. This package contains a react components for showing different UI for selection of a single property, such as a dropdown, textbox etc.

## Installation

`npm install --save @promaster-sdk/react-property-selectors`

The library is compiled to ES5 and no polyfills are required.

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
/>
```

[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat
[prettier-url]: https://github.com/prettier/prettier
