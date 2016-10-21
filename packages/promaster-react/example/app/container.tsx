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
                    <ExampleSelector examples={this.state.examples}/>
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
}

function ExampleSelector({examples}:ExampleSelectorProps) {
    return (
        <select>
            {
                examples.map((example) => <option key={example.name}>{example.name}</option>)
            }
        </select>
    );
}
