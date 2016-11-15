"use strict";
function createSVG(image) {
    var style = createElement("style", {}, ["* { vector-effect: non-scaling-stroke;}"]);
    var svgElements = [style];
    var imageElements = image.components.map(function (c) { return abstractComponentToSVG(c); });
    svgElements = svgElements.concat(imageElements);
    return createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 400 300"
    }, svgElements);
}
exports.createSVG = createSVG;
function abstractComponentToSVG(component) {
    switch (component.type) {
        case "bitmapimage":
            return "";
        case "vectorimage":
            return "";
        case "line":
            return createElement("line", {
                "x1": component.start.x.toString(),
                "y1": component.start.y.toString(),
                "x2": component.end.x.toString(),
                "y2": component.end.y.toString(),
                "stroke": colorToRgb(component.strokeColor),
                "strokeWidth": component.strokeThickness.toString()
            }, []);
        case "text":
            var shadowStyle = {
                textAnchor: getTextAnchor(component.horizontalGrowthDirection),
                fontSize: component.fontSize.toString() + "px",
                fontWeight: component.fontWeight,
                fontFamily: component.fontFamily,
                stroke: colorToRgb(component.strokeColor),
                strokeWidth: component.strokeThickness.toString() + "px"
            };
            var style = {
                textAnchor: getTextAnchor(component.horizontalGrowthDirection),
                fontSize: component.fontSize.toString() + "px",
                fontWeight: component.fontWeight,
                fontFamily: component.fontFamily,
                fill: colorToRgb(component.textColor),
            };
            var dy_1 = getBaselineAdjustment(component.verticalGrowthDirection);
            var transform = "rotate(" + component.clockwiseRotationDegrees.toString() + " " +
                component.position.x.toString() + "," + component.position.y.toString() + ")";
            var lines_1 = component.text != null ? component.text.split('\n') : [];
            var tSpans = lines_1.map(function (t) { return createElement("tspan", {
                x: component.position.x.toString(),
                y: component.position.y.toString(),
                dy: (dy_1 + lines_1.indexOf(t)).toString() + "em"
            }, [t]); });
            var cs = [];
            if (component.strokeThickness > 0 && component.strokeColor != null) {
                cs.push(createElement("text", {
                    "x": component.position.x.toString(),
                    "y": component.position.y.toString(),
                    "dy": dy_1.toString() + "em",
                    "style": objectToAttributeValue(shadowStyle),
                    "transform": transform
                }, tSpans));
            }
            cs.push(createElement("text", {
                "x": component.position.x.toString(),
                "y": component.position.y.toString(),
                "dy": dy_1.toString() + "em", "style": objectToAttributeValue(style),
                "transform": transform
            }, tSpans));
            return flattenElements(cs);
        case "ellipse":
            var rx = Math.abs(component.bottomRight.x - component.topLeft.x) * 0.5;
            var ry = Math.abs(component.bottomRight.y - component.topLeft.y) * 0.5;
            var cx = (component.bottomRight.x + component.topLeft.x) * 0.5;
            var cy = (component.bottomRight.y + component.topLeft.y) * 0.5;
            return createElement("ellipse", {
                cx: cx.toString(),
                cy: cy.toString(),
                rx: rx.toString(),
                ry: ry.toString(),
                stroke: colorToRgb(component.strokeColor),
                strokeWidth: component.strokeThickness.toString(),
                fill: colorToRgb(component.fillColor)
            }, []);
        case "polygon":
            var points = component.points.map(function (p) { return p.x.toString() + "," + p.y.toString(); }).join(' ');
            return createElement("polygon", {
                points: points,
                stroke: colorToRgb(component.strokeColor),
                strokeWidth: component.strokeThickness.toString(),
                fill: colorToRgb(component.fillColor)
            }, []);
        case "rectangle":
            return createElement("rect", {
                x: component.topLeft.x.toString(),
                y: component.topLeft.y.toString(),
                width: Math.abs(component.bottomRight.x - component.topLeft.x).toString(),
                height: Math.abs(component.bottomRight.y - component.topLeft.y).toString(),
                stroke: colorToRgb(component.strokeColor),
                strokeWidth: component.strokeThickness.toString(),
                fill: colorToRgb(component.fillColor)
            }, []);
        default:
            return "";
    }
}
function createElement(elementName, attributes, innerElements) {
    var formattedName = convertUpperToHyphenLower(elementName);
    var element = "<" + formattedName;
    if (Object.keys(attributes).length > 0) {
        element = Object.keys(attributes).reduce(function (previousValue, currentValue) {
            if (attributes[currentValue]) {
                return previousValue + (" " + convertUpperToHyphenLower(currentValue) + "=\"" + attributes[currentValue] + "\"");
            }
            else {
                return previousValue;
            }
        }, element);
    }
    element += ">";
    if (innerElements.length > 0) {
        element = innerElements.reduce(function (previousValue, currentValue) {
            if (!currentValue || currentValue.length < 1) {
                return previousValue;
            }
            else {
                return previousValue + ("\n" + currentValue);
            }
        }, element);
        element += "\n";
    }
    element += "</" + formattedName + ">";
    return element;
}
function objectToAttributeValue(attributes) {
    if (attributes && Object.keys(attributes).length > 0) {
        return Object.keys(attributes).reduce(function (previousValue, currentValue) {
            if (attributes[currentValue]) {
                return previousValue + (convertUpperToHyphenLower(currentValue) + ":" + attributes[currentValue] + ";");
            }
            else {
                return previousValue;
            }
        }, "");
    }
    return "";
}
function convertUpperToHyphenLower(elementName) {
    function upperToHyphenLower(match) {
        return '-' + match.toLowerCase();
    }
    return elementName !== "viewBox" ? elementName.replace(/[A-Z]/g, upperToHyphenLower) : elementName;
}
function flattenElements(elements) {
    return elements.reduce(function (previousValue, currentValue) {
        return previousValue + ("\n" + currentValue);
    }, "");
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
//# sourceMappingURL=svg-export-image.js.map