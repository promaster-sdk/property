import * as React from "react";
import {PropertySelectors as Selectors} from "promaster-react";
import {PropertyFiltering} from "promaster-portable";
import {Unit, Units, PropertyFilter, PropertyValueSet, PropertyValue} from "promaster-primitives";
import {merge} from "./utils";

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet
}

const filterPrettyPrint = (propertyFilter: PropertyFilter.PropertyFilter) =>
  PropertyFiltering.filterPrettyPrintIndented(
    PropertyFiltering.FilterPrettyPrintMessagesEnglish, 2, " ", propertyFilter);

export class ComboboxPropertySelectorExample1 extends React.Component<{}, State> {

  constructor() {
    super();
    this.state = {
      propertyValueSet: PropertyValueSet.fromString("a=1;b=3"),
    };
  }

  render() {

    const propSelClassNames: Selectors.ComboboxPropertySelectorClassNames = {
      select: "select",
      selectInvalid: "selectInvalid",
      selectLocked: "selectLocked",
      selectInvalidLocked: "selectInvalidLocked",
      option: "option",
      optionInvalid: "optionInvalid",
    };

    // console.log("state", this.state);

    const valueItems: Array<Selectors.ComboBoxPropertyValueItem> = [
      {
        value: PropertyValue.create("integer", 1),
        sortNo: 1,
        text: "Alternative 1",
        validationFilter: PropertyFilter.Empty
      },
      {
        value: PropertyValue.create("integer", 2),
        sortNo: 2,
        text: "Alternative 2",
        validationFilter: PropertyFilter.fromString("b=2")
      }
    ];

    return (
      <div>
        <div>
          ComboboxPropertySelector:
        </div>
        <div>
          PropertyValueSet: {PropertyValueSet.toString(this.state.propertyValueSet)}
        </div>
        <div>
          <Selectors.ComboboxPropertySelector
            propertyName="a"
            valueItems={valueItems}
            propertyValueSet={this.state.propertyValueSet}
            locked={false}
            showCodes={true}
            sortValidFirst={true}
            onValueChange={(pv) =>
            this.setState(merge(this.state, {
              propertyValueSet: PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, this.state.propertyValueSet)
            }))}
            filterPrettyPrint={filterPrettyPrint}
            readOnly={false}
            classNames={propSelClassNames}/>
        </div>
      </div>
    );

  }
}

