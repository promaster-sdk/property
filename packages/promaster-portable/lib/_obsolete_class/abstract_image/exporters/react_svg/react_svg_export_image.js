"use strict";
var react_1 = require('react');
var Uuid = require('node-uuid');
var index_1 = require("../../model/index");
var svgHelpers_1 = require("../svgHelpers");
exports.reactSvgExportImage = function (root, scale) {
    if (scale === void 0) { scale = 1.0; }
    var svg = render_react(root);
    return new index_1.RenderedImage("react_svg", svg);
};
function render_react(image) {
    return react_1.DOM.svg({
        "key": Uuid.v1().toString(),
        "viewBox": [
            0,
            0,
            image.size.width,
            image.size.height
        ].join(' ')
    }, 
    // Keeps the lines from scaling.
    react_1.DOM.style({}, "\n\t\t\t* {\n\t\t\t\tvector-effect: non-scaling-stroke;\n\t\t\t}\n\t\t"), _flatMap(image.components, function (c) { return _visit(c); }));
}
function _flatMap(array, lambda) {
    return Array.prototype.concat.apply([], array.map(lambda));
}
function _visit(c_in) {
    if (c_in instanceof index_1.AbstractImageRoot) {
        return [];
    }
    if (c_in instanceof index_1.BitmapImageComponent) {
        return [];
    }
    if (c_in instanceof index_1.VectorImageComponent) {
        throw "TODO!";
    }
    if (c_in instanceof index_1.LineComponent) {
        var c = c_in;
        return [react_1.DOM.line({
                "x1": c.start.x.toString(),
                "y1": c.start.y.toString(),
                "x2": c.end.x.toString(),
                "y2": c.end.y.toString(),
                "stroke": svgHelpers_1.colorToRgb(c.strokeColor),
                "strokeWidth": c.strokeThickness.toString()
            })];
    }
    if (c_in instanceof index_1.TextComponent) {
        var c_1 = c_in;
        var shadowStyle = {
            textAnchor: svgHelpers_1.getTextAnchor(c_1.horizontalGrowthDirection),
            fontSize: c_1.fontSize.toString() + "px",
            fontWeight: c_1.fontWeight == index_1.AbstractFontWeight.Bold ? "bold" : "normal",
            fontFamily: c_1.fontFamily,
            stroke: svgHelpers_1.colorToRgb(c_1.strokeColor),
            strokeWidth: c_1.strokeThickness.toString() + "px"
        };
        var style = {
            textAnchor: svgHelpers_1.getTextAnchor(c_1.horizontalGrowthDirection),
            fontSize: c_1.fontSize.toString() + "px",
            fontWeight: c_1.fontWeight == index_1.AbstractFontWeight.Bold ? "bold" : "normal",
            fontFamily: c_1.fontFamily,
            fill: svgHelpers_1.colorToRgb(c_1.textColor),
        };
        var dy_1 = svgHelpers_1.getBaselineAdjustment(c_1.verticalGrowthDirection);
        var transform_1 = "rotate(" + c_1.clockwiseRotationDegrees.toString() + " " + c_1.position.x.toString() + "," + c_1.position.y.toString() + ")";
        var lines_1 = c_1.text != null ? c_1.text.split('\n') : [];
        var tSpans = lines_1.map(function (t) { return react_1.DOM.tspan({
            x: c_1.position.x.toString(),
            y: c_1.position.y.toString(),
            dy: (dy_1 + lines_1.indexOf(t)).toString() + "em",
            transform: transform_1
        }, t); });
        var cs = [];
        if (c_1.strokeThickness > 0 && c_1.strokeColor != null)
            cs.push(react_1.DOM.text({
                "x": c_1.position.x.toString(),
                "y": c_1.position.y.toString(),
                "dy": dy_1.toString() + "em",
                "style": shadowStyle,
                "transform": transform_1
            }, tSpans));
        cs.push(react_1.DOM.text({
            "x": c_1.position.x.toString(),
            "y": c_1.position.y.toString(),
            "dy": dy_1.toString() + "em",
            "style": style,
            "transform": transform_1
        }, tSpans));
        return cs;
    }
    if (c_in instanceof index_1.EllipseComponent) {
        var c = c_in;
        var rx = c.size.width * 0.5;
        var ry = c.size.width * 0.5;
        var cx = c.topLeft.x + rx;
        var cy = c.topLeft.y + ry;
        //return [DOM.ellipse({
        //  cx: cx.toString(),
        //  cy: cy.toString(),
        //  rx: rx.toString(),
        //  ry: ry.toString(),
        //  style: style
        //})];
        return [react_1.DOM.ellipse({
                cx: cx.toString(),
                cy: cy.toString(),
                rx: rx.toString(),
                ry: ry.toString(),
                stroke: svgHelpers_1.colorToRgb(c.strokeColor),
                strokeWidth: c.strokeThickness.toString(),
                fill: svgHelpers_1.colorToRgb(c.fillColor)
            })];
    }
    if (c_in instanceof index_1.PolygonComponent) {
        var c = c_in;
        var points = c.points.map(function (p) { return p.x.toString() + "," + p.y.toString(); }).join(' ');
        //return [DOM.polygon({points: points, style: style})];
        return [react_1.DOM.polygon({
                points: points,
                stroke: svgHelpers_1.colorToRgb(c.strokeColor),
                strokeWidth: c.strokeThickness.toString(),
                fill: svgHelpers_1.colorToRgb(c.fillColor)
            })];
    }
    if (c_in instanceof index_1.RectangleComponent) {
        var c = c_in;
        //return [DOM.rect({
        //  x: c.topLeft.x.toString(),
        //  y: c.topLeft.y.toString(),
        //  width: c.size.width.toString(),
        //  height: c.size.height.toString(),
        //  style: style
        //})];
        return [react_1.DOM.rect({
                x: c.topLeft.x.toString(),
                y: c.topLeft.y.toString(),
                width: c.size.width.toString(),
                height: c.size.height.toString(),
                stroke: svgHelpers_1.colorToRgb(c.strokeColor),
                strokeWidth: c.strokeThickness.toString(),
                fill: svgHelpers_1.colorToRgb(c.fillColor)
            })];
    }
    return [];
}
//# sourceMappingURL=react_svg_export_image.js.map