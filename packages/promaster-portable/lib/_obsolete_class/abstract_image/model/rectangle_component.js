"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_component_1 = require('./abstract_component');
var abstract_point_1 = require('./abstract_point');
var RectangleComponent = (function (_super) {
    __extends(RectangleComponent, _super);
    function RectangleComponent(topLeft, size, strokeColor, strokeThickness, fillColor) {
        _super.call(this);
        this._topLeft = topLeft;
        this._size = size;
        this._strokeColor = strokeColor;
        this._strokeThickness = strokeThickness;
        this._fillColor = fillColor;
    }
    Object.defineProperty(RectangleComponent.prototype, "topLeft", {
        get: function () {
            return this._topLeft;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RectangleComponent.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RectangleComponent.prototype, "strokeColor", {
        get: function () {
            return this._strokeColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RectangleComponent.prototype, "strokeThickness", {
        get: function () {
            return this._strokeThickness;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RectangleComponent.prototype, "fillColor", {
        get: function () {
            return this._fillColor;
        },
        enumerable: true,
        configurable: true
    });
    RectangleComponent.prototype.corners = function () {
        var top = this._topLeft.y;
        var bottom = this._topLeft.y + this._size.height;
        var left = this._topLeft.x;
        var right = this._topLeft.x + this._size.width;
        return [new abstract_point_1.AbstractPoint(left, top),
            new abstract_point_1.AbstractPoint(right, top), new abstract_point_1.AbstractPoint(right, bottom),
            new abstract_point_1.AbstractPoint(left, bottom)];
    };
    return RectangleComponent;
}(abstract_component_1.AbstractComponent));
exports.RectangleComponent = RectangleComponent;
//# sourceMappingURL=rectangle_component.js.map