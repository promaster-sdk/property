"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_component_1 = require('./abstract_component');
var EllipseComponent = (function (_super) {
    __extends(EllipseComponent, _super);
    function EllipseComponent(topLeft, size, strokeColor, strokeThickness, fillColor) {
        _super.call(this);
        this._topLeft = topLeft;
        this._size = size;
        this._strokeColor = strokeColor;
        this._strokeThickness = strokeThickness;
        this._fillColor = fillColor;
    }
    Object.defineProperty(EllipseComponent.prototype, "topLeft", {
        get: function () {
            return this._topLeft;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EllipseComponent.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EllipseComponent.prototype, "strokeColor", {
        get: function () {
            return this._strokeColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EllipseComponent.prototype, "strokeThickness", {
        get: function () {
            return this._strokeThickness;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EllipseComponent.prototype, "fillColor", {
        get: function () {
            return this._fillColor;
        },
        enumerable: true,
        configurable: true
    });
    return EllipseComponent;
}(abstract_component_1.AbstractComponent));
exports.EllipseComponent = EllipseComponent;
//# sourceMappingURL=ellipse_component.js.map