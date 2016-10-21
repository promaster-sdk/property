"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_component_1 = require('./abstract_component');
var TextComponent = (function (_super) {
    __extends(TextComponent, _super);
    function TextComponent(position, text, fontFamily, fontSize, textColor, fontWeight, clockwiseRotationDegrees, textAlignment, horizontalGrowthDirection, verticalGrowthDirection, strokeThickness, strokeColor) {
        _super.call(this);
        this._position = position;
        this._text = text;
        this._fontFamily = fontFamily;
        this._fontSize = fontSize;
        this._textColor = textColor;
        this._fontWeight = fontWeight;
        this._clockwiseRotationDegrees = clockwiseRotationDegrees;
        this._textAlignment = textAlignment;
        this._horizontalGrowthDirection = horizontalGrowthDirection;
        this._verticalGrowthDirection = verticalGrowthDirection;
        this._strokeThickness = strokeThickness;
        this._strokeColor = strokeColor;
    }
    Object.defineProperty(TextComponent.prototype, "position", {
        get: function () {
            return this._position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextComponent.prototype, "text", {
        get: function () {
            return this._text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextComponent.prototype, "fontFamily", {
        get: function () {
            return this._fontFamily;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextComponent.prototype, "fontSize", {
        get: function () {
            return this._fontSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextComponent.prototype, "textColor", {
        get: function () {
            return this._textColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextComponent.prototype, "fontWeight", {
        get: function () {
            return this._fontWeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextComponent.prototype, "clockwiseRotationDegrees", {
        get: function () {
            return this._clockwiseRotationDegrees;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextComponent.prototype, "textAlignment", {
        get: function () {
            return this._textAlignment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextComponent.prototype, "horizontalGrowthDirection", {
        get: function () {
            return this._horizontalGrowthDirection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextComponent.prototype, "verticalGrowthDirection", {
        get: function () {
            return this._verticalGrowthDirection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextComponent.prototype, "strokeThickness", {
        get: function () {
            return this._strokeThickness;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextComponent.prototype, "strokeColor", {
        get: function () {
            return this._strokeColor;
        },
        enumerable: true,
        configurable: true
    });
    return TextComponent;
}(abstract_component_1.AbstractComponent));
exports.TextComponent = TextComponent;
//# sourceMappingURL=text_component.js.map