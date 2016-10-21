"use strict";
var index_1 = require('./model/index');
var AbstractImageBuilder = (function () {
    function AbstractImageBuilder(width, height, backgroundColor) {
        this._components = [];
        this.width = width;
        this.height = height;
        this.backgroundColor = backgroundColor;
    }
    AbstractImageBuilder.create = function () {
        return new AbstractImageBuilder(0.0, 0.0, index_1.AbstractColors.Transparent);
    };
    AbstractImageBuilder.createFromWidthHeight = function (width, height) {
        return new AbstractImageBuilder(width, height, index_1.AbstractColors.Transparent);
    };
    AbstractImageBuilder.prototype.addText = function (x, y, text, fontFamily, fontSize, textColor, fontWeight, clockwiseRotationDegrees, textAlignment, horizontalGrowthDirection, verticalGrowthDirection, strokeThickness, strokeColor) {
        if (clockwiseRotationDegrees === void 0) { clockwiseRotationDegrees = 0.0; }
        if (textAlignment === void 0) { textAlignment = index_1.TextAlignment.Left; }
        if (horizontalGrowthDirection === void 0) { horizontalGrowthDirection = index_1.GrowthDirection.Right; }
        if (verticalGrowthDirection === void 0) { verticalGrowthDirection = index_1.GrowthDirection.Down; }
        if (strokeThickness === void 0) { strokeThickness = 0.0; }
        if (strokeColor === void 0) { strokeColor = index_1.AbstractColors.Black; }
        this._components.push(new index_1.TextComponent(new index_1.AbstractPoint(x, y), text, fontFamily, fontSize, textColor, fontWeight, clockwiseRotationDegrees, textAlignment, horizontalGrowthDirection, verticalGrowthDirection, strokeThickness, strokeColor));
    };
    AbstractImageBuilder.prototype.addBitmapImage = function (format, data) {
        this._components.push(new index_1.BitmapImageComponent(new index_1.AbstractPoint(0.0, 0.0), format, data));
    };
    AbstractImageBuilder.prototype.addVectorImage = function (rootComponent) {
        this._components.push(new index_1.VectorImageComponent(new index_1.AbstractPoint(0.0, 0.0), rootComponent));
    };
    AbstractImageBuilder.prototype.addImageXY = function (x, y, format, data) {
        this._components.push(new index_1.BitmapImageComponent(new index_1.AbstractPoint(x, y), format, data));
    };
    AbstractImageBuilder.prototype.addLine = function (x, y, x2, y2, strokeColor, strokeThickness) {
        this._components.push(new index_1.LineComponent(new index_1.AbstractPoint(x, y), new index_1.AbstractPoint(x2, y2), strokeColor, strokeThickness));
    };
    AbstractImageBuilder.prototype.addEllipse = function (x, y, width, height, strokeColor, strokeThickness, fillColor) {
        this._components.push(new index_1.EllipseComponent(new index_1.AbstractPoint(x, y), new index_1.AbstractSize(width, height), strokeColor, strokeThickness, fillColor));
    };
    AbstractImageBuilder.prototype.addRectangle = function (x, y, width, height, strokeColor, strokeThickness, fillColor) {
        this._components.push(new index_1.RectangleComponent(new index_1.AbstractPoint(x, y), new index_1.AbstractSize(width, height), strokeColor, strokeThickness, fillColor));
    };
    AbstractImageBuilder.prototype.addPolygon = function (points, strokeColor, strokeThickness, fillColor) {
        this._components.push(new index_1.PolygonComponent(points, strokeColor, strokeThickness, fillColor));
    };
    AbstractImageBuilder.prototype.addPolyLine = function (points, strokeColor, strokeThickness) {
        if (points.length == 0)
            return;
        var previous = points[0];
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var p = points_1[_i];
            this._components.push(new index_1.LineComponent(previous, p, strokeColor, strokeThickness));
            previous = p;
        }
    };
    AbstractImageBuilder.prototype.addAbstractImage = function (x, y, image) {
        this._components.push(new index_1.AbstractImageRoot(new index_1.AbstractPoint(x, y), image.size, image.backgroundColor, image.components));
    };
    AbstractImageBuilder.prototype.build = function () {
        var immutableClone = this._components.slice();
        return new index_1.AbstractImageRoot(new index_1.AbstractPoint(0.0, 0.0), new index_1.AbstractSize(this.width, this.height), this.backgroundColor, immutableClone);
    };
    AbstractImageBuilder.prototype.setSizeToFitContent = function (measure) {
        var maxWidth = 0.0;
        var maxHeight = 0.0;
        for (var _i = 0, _a = this._components; _i < _a.length; _i++) {
            var component = _a[_i];
            var size = measure(component);
            if (size.width > maxWidth)
                maxWidth = size.width;
            if (size.height > maxHeight)
                maxHeight = size.height;
        }
        this.width = maxWidth;
        this.height = maxHeight;
    };
    return AbstractImageBuilder;
}());
exports.AbstractImageBuilder = AbstractImageBuilder;
//# sourceMappingURL=abstract_image_builder.js.map