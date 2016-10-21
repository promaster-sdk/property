"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_component_1 = require('./abstract_component');
var VectorImageComponent = (function (_super) {
    __extends(VectorImageComponent, _super);
    function VectorImageComponent(topLeft, rootComponent) {
        _super.call(this);
        this._topLeft = topLeft;
        this._rootComponent = rootComponent;
    }
    Object.defineProperty(VectorImageComponent.prototype, "topLeft", {
        get: function () {
            return this._topLeft;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VectorImageComponent.prototype, "rootComponent", {
        get: function () {
            return this._rootComponent;
        },
        enumerable: true,
        configurable: true
    });
    return VectorImageComponent;
}(abstract_component_1.AbstractComponent));
exports.VectorImageComponent = VectorImageComponent;
//# sourceMappingURL=vector_image_component.js.map