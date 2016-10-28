"use strict";
var Point = require("./point");
function createBitmapImage(topLeft, format, data) {
    return {
        type: "bitmapimage",
        topLeft: topLeft,
        format: format,
        data: data,
    };
}
exports.createBitmapImage = createBitmapImage;
function createEllipse(topLeft, size, strokeColor, strokeThickness, fillColor) {
    return {
        type: "ellipse",
        topLeft: topLeft,
        size: size,
        strokeColor: strokeColor,
        strokeThickness: strokeThickness,
        fillColor: fillColor,
    };
}
exports.createEllipse = createEllipse;
function createLine(start, end, strokeColor, strokeThickness) {
    return {
        type: "line",
        start: start,
        end: end,
        strokeColor: strokeColor,
        strokeThickness: strokeThickness,
    };
}
exports.createLine = createLine;
function createPolygon(points, strokeColor, strokeThickness, fillColor) {
    return {
        type: "polygon",
        points: points,
        strokeColor: strokeColor,
        strokeThickness: strokeThickness,
        fillColor: fillColor,
    };
}
exports.createPolygon = createPolygon;
function createRectangle(topLeft, size, strokeColor, strokeThickness, fillColor) {
    return {
        type: "rectangle",
        topLeft: topLeft,
        size: size,
        strokeColor: strokeColor,
        strokeThickness: strokeThickness,
        fillColor: fillColor,
    };
}
exports.createRectangle = createRectangle;
function corners(rectangle) {
    var top = rectangle.topLeft.y;
    var bottom = rectangle.topLeft.y + rectangle.size.height;
    var left = rectangle.topLeft.x;
    var right = rectangle.topLeft.x + rectangle.size.width;
    return [
        Point.createPoint(left, top),
        Point.createPoint(right, top),
        Point.createPoint(right, bottom),
        Point.createPoint(left, bottom),
    ];
}
exports.corners = corners;
function createText(position, text, fontFamily, fontSize, textColor, fontWeight, clockwiseRotationDegrees, textAlignment, horizontalGrowthDirection, verticalGrowthDirection, strokeThickness, strokeColor) {
    return {
        type: "text",
        position: position,
        text: text,
        fontFamily: fontFamily,
        fontSize: fontSize,
        textColor: textColor,
        fontWeight: fontWeight,
        clockwiseRotationDegrees: clockwiseRotationDegrees,
        textAlignment: textAlignment,
        horizontalGrowthDirection: horizontalGrowthDirection,
        verticalGrowthDirection: verticalGrowthDirection,
        strokeThickness: strokeThickness,
        strokeColor: strokeColor,
    };
}
exports.createText = createText;
function createVectorImage(topLeft, image) {
    return {
        type: "vectorimage",
        topLeft: topLeft,
        image: image,
    };
}
exports.createVectorImage = createVectorImage;
//# sourceMappingURL=model.js.map