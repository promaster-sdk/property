import * as React from "react";
import {AmountFormatSelectorExample1} from "./amount-format-selector-example-1";
import {AmountPropertySelectorExample1} from "./amount-property-selector-example-1";
import {ComboboxPropertySelectorExample1} from "./combobox-property-selector-example-1";
import {TextboxPropertySelectorExample1} from "./textbox-property-selector-example-1";
import {PropertiesSelectorExample1} from "./properties-selector-example-1";
import {merge} from "./utils";

interface Example {
  readonly name: string;
  readonly component: React.ComponentClass<any> | React.StatelessComponent<any>;
}

interface State {
  readonly examples: Array<Example>,
  readonly selectedExample: number,
}

export class Container extends React.Component<void, State> {

  constructor() {
    super();
    this.state = {
      selectedExample: 4,
      examples: [
        {name: "AmountFormatSelector #1", component: AmountFormatSelectorExample1},
        {name: "AmountPropertySelector #1", component: AmountPropertySelectorExample1},
        {name: "ComboboxPropertySelector #1", component: ComboboxPropertySelectorExample1},
        {name: "TextboxPropertySelector #1", component: TextboxPropertySelectorExample1},
        {name: "PropertiesSelector #1", component: PropertiesSelectorExample1},
      ]
    };
  }

  render() {
    return (
      <div>
        <div>
          <ExampleSelector examples={this.state.examples}
                           selectedExample={this.state.selectedExample}
                           selectedExampleChanged={(index) =>
                                        this.setState(merge(this.state, {selectedExample: index}))}/>
        </div>
        <div>
          <ExampleRenderer example={this.state.examples[this.state.selectedExample]}/>
        </div>
      </div>
    );
  }

}


interface ExampleRendererProps {
  example: Example;
}

function ExampleRenderer({example}:ExampleRendererProps) {
  const element = React.createElement(example.component);
  return element;
}


interface ExampleSelectorProps {
  readonly examples: Array<Example>,
  readonly selectedExample: number,
  readonly selectedExampleChanged: (index: number) => void
}

function ExampleSelector({examples, selectedExample, selectedExampleChanged}:ExampleSelectorProps) {
  return (
    <select value={selectedExample}
            onChange={(e) => selectedExampleChanged((e.target as any).value)}>
      {
        examples.map((example, index) =>
          <option key={example.name}
                  value={index}>
            {example.name}
          </option>)
      }
    </select>
  );
}
