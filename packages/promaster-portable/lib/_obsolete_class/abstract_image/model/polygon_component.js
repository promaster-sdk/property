"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_component_1 = require('./abstract_component');
var PolygonComponent = (function (_super) {
    __extends(PolygonComponent, _super);
    function PolygonComponent(points, strokeColor, strokeThickness, fillColor) {
        _super.call(this);
        this._points = points;
        this._strokeColor = strokeColor;
        this._strokeThickness = strokeThickness;
        this._fillColor = fillColor;
    }
    Object.defineProperty(PolygonComponent.prototype, "points", {
        get: function () {
            return this._points;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PolygonComponent.prototype, "strokeColor", {
        get: function () {
            return this._strokeColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PolygonComponent.prototype, "strokeThickness", {
        get: function () {
            return this._strokeThickness;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PolygonComponent.prototype, "fillColor", {
        get: function () {
            return this._fillColor;
        },
        enumerable: true,
        configurable: true
    });
    return PolygonComponent;
}(abstract_component_1.AbstractComponent));
exports.PolygonComponent = PolygonComponent;
//# sourceMappingURL=polygon_component.js.map