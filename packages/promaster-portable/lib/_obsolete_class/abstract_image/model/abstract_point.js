"use strict";
var AbstractPoint = (function () {
    function AbstractPoint(x, y) {
        this._x = x;
        this._y = y;
    }
    Object.defineProperty(AbstractPoint.prototype, "x", {
        //bool operator ==(other) => other is AbstractPoint && other.y == y && other.x == x;
        //
        //int get hashCode => hash2(x, y);
        get: function () {
            return this._x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractPoint.prototype, "y", {
        get: function () {
            return this._y;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractPoint;
}());
exports.AbstractPoint = AbstractPoint;
//# sourceMappingURL=abstract_point.js.map