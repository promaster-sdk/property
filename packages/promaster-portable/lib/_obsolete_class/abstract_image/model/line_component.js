"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_component_1 = require('./abstract_component');
var LineComponent = (function (_super) {
    __extends(LineComponent, _super);
    function LineComponent(start, end, strokeColor, strokeThickness) {
        _super.call(this);
        this._start = start;
        this._end = end;
        this._strokeColor = strokeColor;
        this._strokeThickness = strokeThickness;
    }
    Object.defineProperty(LineComponent.prototype, "start", {
        get: function () {
            return this._start;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineComponent.prototype, "end", {
        get: function () {
            return this._end;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineComponent.prototype, "strokeColor", {
        get: function () {
            return this._strokeColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineComponent.prototype, "strokeThickness", {
        get: function () {
            return this._strokeThickness;
        },
        enumerable: true,
        configurable: true
    });
    return LineComponent;
}(abstract_component_1.AbstractComponent));
exports.LineComponent = LineComponent;
//# sourceMappingURL=line_component.js.map