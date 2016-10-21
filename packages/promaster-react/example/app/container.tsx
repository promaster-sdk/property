import * as React from "react";
import {AmountFieldExample1} from "./amount-field-example-1";
import {AmountFieldExample2} from "./amount-field-example-2";

interface Example {
    readonly name: string;
    readonly component: React.ComponentClass<any> | React.StatelessComponent<any>;
}

interface ContainerState {
    readonly examples: Array<Example>,
    readonly selectedExample: number,
}

export class Container extends React.Component<void, ContainerState> {

    constructor() {
        super();
        this.state = {
            selectedExample: 1,
            examples: [
                {name: "Example1", component: AmountFieldExample1},
                {name: "Example2", component: AmountFieldExample2},
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

function merge<T1, T2>(a: T1, b: T2): T1 & T2 {
    return Object.assign({}, a, b);
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
