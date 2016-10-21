"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_size_1 = require('./abstract_size');
var abstract_component_1 = require('./abstract_component');
var abstract_color_1 = require('./abstract_color');
var bitmap_image_component_1 = require('./bitmap_image_component');
var abstract_point_1 = require("./abstract_point");
var AbstractImageRoot = (function (_super) {
    __extends(AbstractImageRoot, _super);
    function AbstractImageRoot(topLeft, size, backgroundColor, components) {
        _super.call(this);
        this._topLeft = topLeft;
        this._size = size;
        this._backgroundColor = backgroundColor;
        this._components = components;
    }
    // Factory method
    AbstractImageRoot.fromSingleImage = function (format, data, width, height) {
        var root = new AbstractImageRoot(new abstract_point_1.AbstractPoint(0.0, 0.0), new abstract_size_1.AbstractSize(width, height), abstract_color_1.AbstractColors.Transparent, [new bitmap_image_component_1.BitmapImageComponent(new abstract_point_1.AbstractPoint(0.0, 0.0), format, data)]);
        return root;
    };
    Object.defineProperty(AbstractImageRoot.prototype, "topLeft", {
        get: function () {
            return this._topLeft;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractImageRoot.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractImageRoot.prototype, "backgroundColor", {
        get: function () {
            return this._backgroundColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractImageRoot.prototype, "components", {
        get: function () {
            return this._components;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractImageRoot;
}(abstract_component_1.AbstractComponent));
exports.AbstractImageRoot = AbstractImageRoot;
//# sourceMappingURL=abstract_image_root.js.map