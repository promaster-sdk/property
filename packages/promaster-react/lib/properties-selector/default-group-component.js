"use strict";
var React = require("react");
function DefaultGroupComponent(_a) {
    var isClosedGroup = _a.isClosedGroup, groupName = _a.groupName, onToggleGroupClosed = _a.onToggleGroupClosed, translateGroupName = _a.translateGroupName, children = _a.children;
    var className1 = 'group-container' + (isClosedGroup || groupName === "Main" ? ' expanded' : ' collapsed');
    return (React.createElement("div", { key: groupName, className: className1 },
        React.createElement("div", { className: "group-container-header", onClick: function () { return onToggleGroupClosed(groupName); } },
            React.createElement("button", { className: "expand-collapse" }, "\u00A0>>\u00A0"),
            translateGroupName(groupName)),
        children));
}
exports.DefaultGroupComponent = DefaultGroupComponent;
//# sourceMappingURL=default-group-component.js.map