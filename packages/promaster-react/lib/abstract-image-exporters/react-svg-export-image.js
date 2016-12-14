"use strict";
var React = require("react");
function createReactSvg(image) {
    return (React.createElement("svg", { viewBox: [0, 0, image.size.width, image.size.height].join(' ') }, _flatMap(image.components, function (c) { return _visit(c); })));
}
exports.createReactSvg = createReactSvg;
function _flatMap(array, lambda) {
    return Array.prototype.concat.apply([], array.map(lambda));
}
function _visit(component) {
    switch (component.type) {
        case "bitmapimage":
            return [];
        case "line":
            return [(React.createElement("line", { x1: component.start.x, y1: component.start.y, x2: component.end.x, y2: component.end.y, stroke: colorToRgb(component.strokeColor), strokeWidth: component.strokeThickness }))];
        case "text":
            var shadowStyle = {
                textAnchor: getTextAnchor(component.horizontalGrowthDirection),
                fontSize: component.fontSize.toString() + "px",
                fontWeight: component.fontWeight,
                fontFamily: component.fontFamily,
                stroke: colorToRgb(component.strokeColor),
                strokeWidth: component.strokeThickness
            };
            var style = {
                textAnchor: getTextAnchor(component.horizontalGrowthDirection),
                fontSize: component.fontSize.toString() + "px",
                fontWeight: component.fontWeight,
                fontFamily: component.fontFamily,
                fill: colorToRgb(component.textColor),
            };
            var dy_1 = getBaselineAdjustment(component.verticalGrowthDirection);
            var transform_1 = "rotate(" + component.clockwiseRotationDegrees.toString() + " "
                + component.position.x.toString() + "," + component.position.y.toString() + ")";
            var lines_1 = component.text != null ? component.text.split('\n') : [];
            var tSpans = lines_1.map(function (t) {
                return (React.createElement("tspan", { x: component.position.x, y: component.position.y, dy: (dy_1 + lines_1.indexOf(t)).toString() + "em", transform: transform_1 }, t));
            });
            var cs = [];
            if (component.strokeThickness > 0 && component.strokeColor) {
                cs.push(React.createElement("text", { x: component.position.x, y: component.position.y, dy: dy_1.toString() + "em", style: shadowStyle, transform: transform_1 }, tSpans));
            }
            cs.push(React.createElement("text", { x: component.position.x, y: component.position.y, dy: dy_1.toString() + "em", style: style, transform: transform_1 }, tSpans));
            return cs;
        case "ellipse":
            var rx = Math.abs(component.bottomRight.x - component.topLeft.x) * 0.5;
            var ry = Math.abs(component.bottomRight.y - component.topLeft.y) * 0.5;
            var cx = (component.bottomRight.x + component.topLeft.x) * 0.5;
            var cy = (component.bottomRight.y + component.topLeft.y) * 0.5;
            return [React.createElement("ellipse", { cx: cx, cy: cy, rx: rx, ry: ry, stroke: colorToRgb(component.strokeColor), strokeWidth: component.strokeThickness, fill: colorToRgb(component.fillColor) })];
        case "polygon":
            var points = component.points.map(function (p) { return p.x.toString() + "," + p.y.toString(); }).join(' ');
            return [React.createElement("polygon", { points: points, stroke: colorToRgb(component.strokeColor), strokeWidth: component.strokeThickness, fill: colorToRgb(component.fillColor) })];
        case "rectangle":
            return [React.createElement("rect", { x: component.topLeft.x, y: component.topLeft.y, width: Math.abs(component.bottomRight.x - component.topLeft.x), height: Math.abs(component.bottomRight.y - component.topLeft.y), stroke: colorToRgb(component.strokeColor), strokeWidth: component.strokeThickness, fill: colorToRgb(component.fillColor) })];
        default:
            return [];
    }
}
function getBaselineAdjustment(d) {
    if (d === "up")
        return 0.0;
    if (d === "uniform")
        return 0.5;
    if (d === "down")
        return 1.0;
    throw "Unknown text alignment " + d;
}
function getTextAnchor(d) {
    if (d === "left")
        return "end";
    if (d === "uniform")
        return "middle";
    if (d === "right")
        return "start";
    throw "Unknown text alignment " + d;
}
function colorToRgb(color) {
    return "rgb(" + color.r.toString() + "," + color.g.toString() + "," + color.b.toString() + ")";
}
//# sourceMappingURL=react-svg-export-image.js.map