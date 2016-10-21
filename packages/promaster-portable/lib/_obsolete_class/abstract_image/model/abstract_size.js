"use strict";
var AbstractSize = (function () {
    function AbstractSize(width, height) {
        this._width = width;
        this._height = height;
    }
    Object.defineProperty(AbstractSize.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractSize.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractSize;
}());
exports.AbstractSize = AbstractSize;
//# sourceMappingURL=abstract_size.js.map