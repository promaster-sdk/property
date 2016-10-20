import * as React from "react";
import {PropertyValue, PropertyType} from "promaster-primitives";

export interface TextboxPropertySelectorProps {
    readonly value: string,
    readonly readOnly: boolean,
    readonly onValueChange: (newValue: PropertyValue) => void
}

interface TextboxPropertySelectorState {
    readonly textValue: string,
}

export class TextboxPropertySelector extends React.Component<TextboxPropertySelectorProps, TextboxPropertySelectorState> {

    constructor() {
        super();
        // What the optimal debounce is may vary between users. 350ms seems like a nice value...
        this._debouncedOnValueChange = debounce(this._debouncedOnValueChange, 350);
    }

    componentWillMount() {
        const {value} = this.props;
        this.setState({textValue: value});
    }

    componentWillReceiveProps(nextProps: TextboxPropertySelectorProps) {
        const {value} = nextProps;
        this.setState({textValue: value});
    }

    render() {

        const {onValueChange, readOnly} = this.props;
        const {textValue} = this.state;

        return (
            <input type='text'
                   value={textValue}
                   readOnly={readOnly}
                   onChange={(e:any) => this._onChange(e, onValueChange)}/>
        );
    }

    _debouncedOnValueChange(newValue: PropertyValue, onValueChange: (newValue: PropertyValue) => void): void {
        // log("jk", "_debouncedOnValueChange");
        onValueChange(newValue);
    }

    _onChange(e: React.SyntheticEvent<any>, onValueChange: (newValue: PropertyValue) => void) {
        // log("jk", "_onChange");
        let newStringValue = (e.target as HTMLInputElement).value;
        this.setState({textValue: newStringValue});
        this._debouncedOnValueChange(new PropertyValue(PropertyType.Text, newStringValue), onValueChange);
    }

}

// (From underscore.js)
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func: Function, wait: number, immediate?: boolean): any {
    let timeout: any;
    return function (this: any) {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
