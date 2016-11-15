import * as React from "react";
import {merge} from "./utils";
import {AbstractImageExample} from "./abstract-image-example";

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
      selectedExample: 0,
      examples: [
        {
          name: "AbstractImage",
          component: AbstractImageExample
        }
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