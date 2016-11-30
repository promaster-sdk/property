"use strict";
var React = require("react");
function DefaultPropertyLabelComponent(_a) {
    var selectorIsValid = _a.selectorIsValid, selectorIsHidden = _a.selectorIsHidden, selectorLabel = _a.selectorLabel, translatePropertyLabelHover = _a.translatePropertyLabelHover, propertyName = _a.propertyName;
    return (React.createElement("label", {className: !selectorIsValid ? 'invalid' : undefined, title: translatePropertyLabelHover(propertyName)}, 
        React.createElement("span", {className: selectorIsHidden ? "hidden-property" : ""}, selectorLabel)
    ));
}
exports.DefaultPropertyLabelComponent = DefaultPropertyLabelComponent;
//# sourceMappingURL=default-property-label-component.js.map