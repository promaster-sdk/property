"use strict";
var rendered_image_1 = require("../../model/rendered_image");
var abstract_image_root_1 = require("../../model/abstract_image_root");
var bitmap_image_component_1 = require("../../model/bitmap_image_component");
var vector_image_component_1 = require("../../model/vector_image_component");
var line_component_1 = require("../../model/line_component");
var text_component_1 = require("../../model/text_component");
var abstract_font_weight_1 = require("../../model/abstract_font_weight");
var svgHelpers_1 = require("../svgHelpers");
var ellipse_component_1 = require("../../model/ellipse_component");
var polygon_component_1 = require("../../model/polygon_component");
var rectangle_component_1 = require("../../model/rectangle_component");
exports.svgExportImage = function (root, scale) {
    if (scale === void 0) { scale = 1.0; }
    return new rendered_image_1.RenderedImage("svg", createSVG(root));
};
function createSVG(root) {
    var style = createElement("style", null, ["* { vector-effect: non-scaling-stroke;}"]);
    var svgElements = [style];
    var imageElements = root.components.map(function (c) { return abstractComponentToSVG(c); });
    svgElements = svgElements.concat(imageElements);
    return createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 400 300"
    }, svgElements);
}
function abstractComponentToSVG(component) {
    if (component instanceof abstract_image_root_1.AbstractImageRoot) {
        return "";
    }
    if (component instanceof bitmap_image_component_1.BitmapImageComponent) {
        return "";
    }
    if (component instanceof vector_image_component_1.VectorImageComponent) {
        throw "TODO!";
    }
    if (component instanceof line_component_1.LineComponent) {
        var c = component;
        return createElement("line", {
            "x1": c.start.x.toString(),
            "y1": c.start.y.toString(),
            "x2": c.end.x.toString(),
            "y2": c.end.y.toString(),
            "stroke": svgHelpers_1.colorToRgb(c.strokeColor),
            "strokeWidth": c.strokeThickness.toString()
        }, null);
    }
    if (component instanceof text_component_1.TextComponent) {
        var c_1 = component;
        var shadowStyle = {
            textAnchor: svgHelpers_1.getTextAnchor(c_1.horizontalGrowthDirection),
            fontSize: c_1.fontSize.toString() + "px",
            fontWeight: c_1.fontWeight == abstract_font_weight_1.AbstractFontWeight.Bold ? "bold" : "normal",
            fontFamily: c_1.fontFamily,
            stroke: svgHelpers_1.colorToRgb(c_1.strokeColor),
            strokeWidth: c_1.strokeThickness.toString() + "px"
        };
        var style = {
            textAnchor: svgHelpers_1.getTextAnchor(c_1.horizontalGrowthDirection),
            fontSize: c_1.fontSize.toString() + "px",
            fontWeight: c_1.fontWeight == abstract_font_weight_1.AbstractFontWeight.Bold ? "bold" : "normal",
            fontFamily: c_1.fontFamily,
            fill: svgHelpers_1.colorToRgb(c_1.textColor),
        };
        var dy_1 = svgHelpers_1.getBaselineAdjustment(c_1.verticalGrowthDirection);
        var transform = "rotate(" + c_1.clockwiseRotationDegrees.toString() + " " + c_1.position.x.toString() + "," + c_1.position.y.toString() + ")";
        var lines_1 = c_1.text != null ? c_1.text.split('\n') : [];
        var tSpans = lines_1.map(function (t) { return createElement("tspan", {
            x: c_1.position.x.toString(),
            y: c_1.position.y.toString(),
            dy: (dy_1 + lines_1.indexOf(t)).toString() + "em"
        }, [t]); });
        var cs = [];
        if (c_1.strokeThickness > 0 && c_1.strokeColor != null) {
            cs.push(createElement("text", {
                "x": c_1.position.x.toString(),
                "y": c_1.position.y.toString(),
                "dy": dy_1.toString() + "em",
                "style": objectToAttributeValue(shadowStyle),
                "transform": transform
            }, tSpans));
        }
        cs.push(createElement("text", {
            "x": c_1.position.x.toString(),
            "y": c_1.position.y.toString(),
            "dy": dy_1.toString() + "em", "style": objectToAttributeValue(style),
            "transform": transform
        }, tSpans));
        return flattenElements(cs);
    }
    if (component instanceof ellipse_component_1.EllipseComponent) {
        var c = component;
        var rx = c.size.width * 0.5;
        var ry = c.size.width * 0.5;
        var cx = c.topLeft.x + rx;
        var cy = c.topLeft.y + ry;
        return createElement("ellipse", {
            cx: cx.toString(),
            cy: cy.toString(),
            rx: rx.toString(),
            ry: ry.toString(),
            stroke: svgHelpers_1.colorToRgb(c.strokeColor),
            strokeWidth: c.strokeThickness.toString(),
            fill: svgHelpers_1.colorToRgb(c.fillColor)
        }, null);
    }
    if (component instanceof polygon_component_1.PolygonComponent) {
        var c = component;
        var points = c.points.map(function (p) { return p.x.toString() + "," + p.y.toString(); }).join(' ');
        return createElement("polygon", {
            points: points,
            stroke: svgHelpers_1.colorToRgb(c.strokeColor),
            strokeWidth: c.strokeThickness.toString(),
            fill: svgHelpers_1.colorToRgb(c.fillColor)
        }, null);
    }
    if (component instanceof rectangle_component_1.RectangleComponent) {
        var c = component;
        return createElement("rect", {
            x: c.topLeft.x.toString(),
            y: c.topLeft.y.toString(),
            width: c.size.width.toString(),
            height: c.size.height.toString(),
            stroke: svgHelpers_1.colorToRgb(c.strokeColor),
            strokeWidth: c.strokeThickness.toString(),
            fill: svgHelpers_1.colorToRgb(c.fillColor)
        }, null);
    }
    return "";
}
function createElement(elementName, attributes, innerElements) {
    var formattedName = convertUpperToHyphenLower(elementName);
    var hasInnerElements = innerElements && innerElements.length > 0;
    var element = "<" + formattedName;
    if (attributes && Object.keys(attributes).length > 0) {
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
    if (hasInnerElements)
        element = innerElements.reduce(function (previousValue, currentValue) {
            if (!currentValue || currentValue.length < 1) {
                return previousValue;
            }
            else {
                return previousValue + ("\n" + currentValue);
            }
        }, element);
    if (hasInnerElements) {
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
        return previousValue += "\n" + currentValue;
    }, "");
}
//# sourceMappingURL=svg_export_image.js.map