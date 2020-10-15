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
