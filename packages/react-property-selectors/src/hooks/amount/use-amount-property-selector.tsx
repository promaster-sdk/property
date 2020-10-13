import React from "react";
import {
  PropertyValueSet,
  PropertyFilter,
  PropertyValue
} from "@promaster-sdk/property";
import { Amount, Unit, UnitFormat } from "uom";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import {
  UseAmountFormatSelector,
  useAmountFormatSelector,
  UseAmountFormatSelectorOnFormatChanged,
  UseAmountFormatSelectorOnFormatCleared,
  UseAmountFormatSelectorOnFormatSelectorToggled
} from "./use-amount-format-selector";
import { UseAmountInputBox, useAmountInputBox } from "./use-amount-input-box";

export type UseAmountPropertySelectorParams = {
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly inputUnit: Unit.Unit<unknown>;
  readonly inputDecimalCount: number;
  readonly validationFilter: PropertyFilter.PropertyFilter;
  readonly notNumericMessage: string;
  readonly isRequiredMessage: string;
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
  readonly readonly: boolean;
  readonly onFormatChanged: UseAmountFormatSelectorOnFormatChanged;
  readonly onFormatCleared: UseAmountFormatSelectorOnFormatCleared;
  readonly onFormatSelectorToggled?: UseAmountFormatSelectorOnFormatSelectorToggled;
  readonly onValueChange: (
    newValue: PropertyValue.PropertyValue | undefined
  ) => void;
  readonly debounceTime?: number;
  readonly fieldName: string;
  readonly unitsFormat: {
    readonly [key: string]: UnitFormat.UnitFormat;
  };
  readonly units: {
    readonly [key: string]: Unit.Unit<unknown>;
  };
  readonly comparer?: PropertyValue.Comparer;
};

export type UseAmountPropertySelector = {
  readonly getWrapperProps: () => React.HTMLAttributes<HTMLSpanElement>;
  readonly amountInputBox: UseAmountInputBox;
  readonly amountFormatSelector: UseAmountFormatSelector;
};

export function useAmountPropertySelector(
  params: UseAmountPropertySelectorParams
): UseAmountPropertySelector {
  const {
    onValueChange,
    onFormatChanged,
    onFormatCleared,
    onFormatSelectorToggled,
    notNumericMessage,
    isRequiredMessage,
    validationFilter,
    propertyValueSet,
    propertyName,
    filterPrettyPrint,
    inputUnit,
    inputDecimalCount,
    readonly,
    debounceTime = 350,
    unitsFormat,
    units,
    comparer = PropertyValue.defaultComparer
  } = params;

  const value: Amount.Amount<unknown> | undefined = PropertyValueSet.getAmount(
    propertyName,
    propertyValueSet
  );

  // return (
  //   <AmountPropertySelectorWrapper>
  //     <AmountInputBox
  //       value={value}
  //       inputUnit={inputUnit}
  //       inputDecimalCount={inputDecimalCount}
  //       notNumericMessage={notNumericMessage}
  //       isRequiredMessage={isRequiredMessage}
  //       errorMessage={_getValidationMessage(
  //         propertyValueSet,
  //         value,
  //         validationFilter,
  //         filterPrettyPrint,
  //         comparer
  //       )}
  //       readOnly={readOnly}
  //       onValueChange={(newAmount) =>
  //         onValueChange(
  //           newAmount !== undefined
  //             ? PropertyValue.create("amount", newAmount)
  //             : undefined
  //         )
  //       }
  //       debounceTime={debounceTime}
  //     />
  //     <AmountFormatSelector
  //       selectedUnit={inputUnit}
  //       selectedDecimalCount={inputDecimalCount}
  //       onFormatChanged={onFormatChanged}
  //       onFormatCleared={onFormatCleared}
  //       onFormatSelectorActiveChanged={onFormatSelectorToggled}
  //       unitsFormat={unitsFormat}
  //       units={units}
  //     />
  //   </AmountPropertySelectorWrapper>
  // );

  const amountInputBox = useAmountInputBox({
    value,
    inputUnit,
    inputDecimalCount,
    notNumericMessage,
    isRequiredMessage,
    readonly,
    debounceTime,
    errorMessage: _getValidationMessage(
      propertyValueSet,
      value,
      validationFilter,
      filterPrettyPrint,
      comparer
    ),
    onValueChange: newAmount =>
      onValueChange(
        newAmount !== undefined
          ? PropertyValue.create("amount", newAmount)
          : undefined
      )
  });
  const amountFormatSelector = useAmountFormatSelector({
    selectedUnit: inputUnit,
    selectedDecimalCount: inputDecimalCount,
    onFormatChanged,
    onFormatCleared,
    onFormatSelectorActiveChanged: onFormatSelectorToggled,
    unitsFormat,
    units
  });

  return { getWrapperProps: () => ({}), amountInputBox, amountFormatSelector };
}

// export interface AmountPropertySelectorProps {
//   readonly propertyName: string;
//   readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
//   readonly inputUnit: Unit.Unit<unknown>;
//   readonly inputDecimalCount: number;
//   readonly validationFilter: PropertyFilter.PropertyFilter;
//   readonly notNumericMessage: string;
//   readonly isRequiredMessage: string;
//   readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
//   readonly readOnly: boolean;
//   readonly onFormatChanged: OnFormatChanged;
//   readonly onFormatCleared: OnFormatCleared;
//   readonly onFormatSelectorToggled?: OnFormatSelectorToggled;
//   readonly onValueChange: (
//     newValue: PropertyValue.PropertyValue | undefined
//   ) => void;
//   readonly debounceTime?: number;
//   readonly fieldName: string;
//   readonly unitsFormat: {
//     readonly [key: string]: UnitFormat.UnitFormat;
//   };
//   readonly units: {
//     readonly [key: string]: Unit.Unit<unknown>;
//   };
//   readonly comparer?: PropertyValue.Comparer;
// }

// export type AmountPropertySelector = React.ComponentClass<
//   AmountPropertySelectorProps
// >;
// export interface CreateAmountPropertySelectorProps {
//   readonly AmountPropertySelectorWrapper?: React.ComponentType<
//     React.DetailedHTMLProps<
//       React.HTMLAttributes<HTMLSpanElement>,
//       HTMLSpanElement
//     >
//   >;
//   readonly AmountFormatSelector?: AmountFormatSelector;
//   readonly AmountInputBox?: AmountInputBox;
// }

// const defaultAmountPropertySelectorWrapper = (
//   props: React.DetailedHTMLProps<
//     React.HTMLAttributes<HTMLSpanElement>,
//     HTMLSpanElement
//   >
// ): JSX.Element => <span {...props} />;

// const defaultAmountFormatSelector = createAmountFormatSelector({});
// const defaultAmountInputBox = createAmountInputBox({});

// export function createAmountPropertySelector({
//   AmountPropertySelectorWrapper = defaultAmountPropertySelectorWrapper,
//   AmountFormatSelector = defaultAmountFormatSelector,
//   AmountInputBox = defaultAmountInputBox,
// }: CreateAmountPropertySelectorProps): AmountPropertySelector {
//   // eslint-disable-next-line functional/no-class
//   return class AmountPropertySelector extends React.Component<
//     AmountPropertySelectorProps,
//     {}
//   > {
//     render(): React.ReactElement<AmountPropertySelectorProps> {
//       const {
//         onValueChange,
//         onFormatChanged,
//         onFormatCleared,
//         onFormatSelectorToggled,
//         notNumericMessage,
//         isRequiredMessage,
//         validationFilter,
//         propertyValueSet,
//         propertyName,
//         filterPrettyPrint,
//         inputUnit,
//         inputDecimalCount,
//         readOnly,
//         debounceTime = 350,
//         unitsFormat,
//         units,
//         comparer = PropertyValue.defaultComparer,
//         // eslint-disable-next-line functional/no-this-expression
//       } = this.props;

//       const value:
//         | Amount.Amount<unknown>
//         | undefined = PropertyValueSet.getAmount(
//         propertyName,
//         propertyValueSet
//       );

//       return (
//         <AmountPropertySelectorWrapper>
//           <AmountInputBox
//             value={value}
//             inputUnit={inputUnit}
//             inputDecimalCount={inputDecimalCount}
//             notNumericMessage={notNumericMessage}
//             isRequiredMessage={isRequiredMessage}
//             errorMessage={_getValidationMessage(
//               propertyValueSet,
//               value,
//               validationFilter,
//               filterPrettyPrint,
//               comparer
//             )}
//             readOnly={readOnly}
//             onValueChange={(newAmount) =>
//               onValueChange(
//                 newAmount !== undefined
//                   ? PropertyValue.create("amount", newAmount)
//                   : undefined
//               )
//             }
//             debounceTime={debounceTime}
//           />
//           <AmountFormatSelector
//             selectedUnit={inputUnit}
//             selectedDecimalCount={inputDecimalCount}
//             onFormatChanged={onFormatChanged}
//             onFormatCleared={onFormatCleared}
//             onFormatSelectorActiveChanged={onFormatSelectorToggled}
//             unitsFormat={unitsFormat}
//             units={units}
//           />
//         </AmountPropertySelectorWrapper>
//       );
//     }
//   };
// }

function _getValidationMessage(
  propertyValueSet: PropertyValueSet.PropertyValueSet,
  value: Amount.Amount<unknown> | undefined,
  validationFilter: PropertyFilter.PropertyFilter,
  filterPrettyPrint: PropertyFiltering.FilterPrettyPrint,
  comparer: PropertyValue.Comparer
): string {
  if (!value || !validationFilter) {
    return "";
  }

  if (PropertyFilter.isValid(propertyValueSet, validationFilter, comparer)) {
    return "";
  } else {
    return filterPrettyPrint(validationFilter);
  }
}
