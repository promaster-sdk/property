import * as React from "react";
import { PropertyValue } from "promaster-primitives";
export class TextboxPropertySelector extends React.Component {
    constructor() {
        super();
        this._debouncedOnValueChange = debounce(this._debouncedOnValueChange, 350);
    }
    componentWillMount() {
        const { value } = this.props;
        this.setState({ textValue: value });
    }
    componentWillReceiveProps(nextProps) {
        const { value } = nextProps;
        this.setState({ textValue: value });
    }
    render() {
        const { onValueChange, readOnly } = this.props;
        const { textValue } = this.state;
        return (React.createElement("input", {type: 'text', value: textValue, readOnly: readOnly, onChange: (e) => this._onChange(e, onValueChange)}));
    }
    _debouncedOnValueChange(newValue, onValueChange) {
        onValueChange(newValue);
    }
    _onChange(e, onValueChange) {
        let newStringValue = e.target.value;
        this.setState({ textValue: newStringValue });
        this._debouncedOnValueChange(PropertyValue.create("text", newStringValue), onValueChange);
    }
}
function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow)
            func.apply(context, args);
    };
}
