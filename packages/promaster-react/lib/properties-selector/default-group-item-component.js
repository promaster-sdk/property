"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require("react");
function DefaultGroupItemComponent(_a) {
    var selector = _a.selector, PropertyLabelComponent = _a.PropertyLabelComponent, PropertySelectorComponent = _a.PropertySelectorComponent;
    return (React.createElement("div", {key: selector.propertyName, className: "property-selector-row"}, 
        React.createElement(PropertyLabelComponent, __assign({}, selector.labelComponentProps)), 
        React.createElement(PropertySelectorComponent, __assign({}, selector.selectorComponentProps))));
}
exports.DefaultGroupItemComponent = DefaultGroupItemComponent;
//# sourceMappingURL=default-group-item-component.js.map