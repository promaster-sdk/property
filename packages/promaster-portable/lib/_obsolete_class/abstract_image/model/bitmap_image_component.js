"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_component_1 = require('./abstract_component');
var BitmapImageComponent = (function (_super) {
    __extends(BitmapImageComponent, _super);
    function BitmapImageComponent(topLeft, format, data) {
        _super.call(this);
        this._topLeft = topLeft;
        this._format = format;
        this._data = data;
    }
    Object.defineProperty(BitmapImageComponent.prototype, "topLeft", {
        get: function () {
            return this._topLeft;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BitmapImageComponent.prototype, "format", {
        get: function () {
            return this._format;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BitmapImageComponent.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    return BitmapImageComponent;
}(abstract_component_1.AbstractComponent));
exports.BitmapImageComponent = BitmapImageComponent;
//# sourceMappingURL=bitmap_image_component.js.map