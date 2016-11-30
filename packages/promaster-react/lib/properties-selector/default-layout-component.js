"use strict";
var React = require("react");
function DefaultLayoutComponent(_a) {
    var selectors = _a.selectors, translateGroupName = _a.translateGroupName, closedGroups = _a.closedGroups, onToggleGroupClosed = _a.onToggleGroupClosed, GroupComponent = _a.GroupComponent, GroupItemComponent = _a.GroupItemComponent, PropertySelectorComponent = _a.PropertySelectorComponent, PropertyLabelComponent = _a.PropertyLabelComponent;
    var groups = getDistinctGroupNames(selectors);
    return (React.createElement("div", {className: "properties-selector"}, groups.map(function (groupName) {
        var isClosedGroup = closedGroups.indexOf(groupName) !== -1;
        var renderedSelectorsForGroup = selectors.filter(function (selector) { return selector.groupName === (groupName || ''); });
        return (React.createElement(GroupComponent, {key: groupName, isClosedGroup: isClosedGroup, groupName: groupName, onToggleGroupClosed: onToggleGroupClosed, translateGroupName: translateGroupName}, renderedSelectorsForGroup.map(function (selector) { return (React.createElement(GroupItemComponent, {key: selector.propertyName, selector: selector, PropertySelectorComponent: PropertySelectorComponent, PropertyLabelComponent: PropertyLabelComponent})); })));
    })));
}
exports.DefaultLayoutComponent = DefaultLayoutComponent;
function getDistinctGroupNames(productPropertiesArray) {
    var groupNames = [];
    for (var _i = 0, productPropertiesArray_1 = productPropertiesArray; _i < productPropertiesArray_1.length; _i++) {
        var property = productPropertiesArray_1[_i];
        if (groupNames.indexOf(property.groupName) === -1 && !isNullOrWhiteSpace(property.groupName)) {
            groupNames.push(property.groupName);
        }
    }
    return groupNames;
}
function isNullOrWhiteSpace(str) {
    return str === null || str === undefined || str.length < 1 || str.replace(/\s/g, '').length < 1;
}
//# sourceMappingURL=default-layout-component.js.map