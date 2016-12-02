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
function createEllipse(topLeft, bottomRight, strokeColor, strokeThickness, fillColor) {
    return {
        type: "ellipse",
        topLeft: topLeft,
        bottomRight: bottomRight,
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
function createRectangle(topLeft, bottomRight, strokeColor, strokeThickness, fillColor) {
    return {
        type: "rectangle",
        topLeft: topLeft,
        bottomRight: bottomRight,
        strokeColor: strokeColor,
        strokeThickness: strokeThickness,
        fillColor: fillColor,
    };
}
exports.createRectangle = createRectangle;
function corners(rectangle) {
    return [
        rectangle.topLeft,
        Point.createPoint(rectangle.bottomRight.x, rectangle.topLeft.y),
        rectangle.bottomRight,
        Point.createPoint(rectangle.topLeft.x, rectangle.bottomRight.y),
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