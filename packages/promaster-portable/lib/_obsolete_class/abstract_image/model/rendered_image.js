"use strict";
var RenderedImage = (function () {
    function RenderedImage(format, output) {
        this._format = format;
        this._output = output;
        Object.freeze(this);
    }
    Object.defineProperty(RenderedImage.prototype, "format", {
        get: function () {
            return this._format;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderedImage.prototype, "output", {
        get: function () {
            return this._output;
        },
        enumerable: true,
        configurable: true
    });
    return RenderedImage;
}());
exports.RenderedImage = RenderedImage;
//# sourceMappingURL=rendered_image.js.map