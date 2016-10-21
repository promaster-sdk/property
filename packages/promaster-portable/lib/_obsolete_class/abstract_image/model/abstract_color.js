"use strict";
var AbstractColor = (function () {
    function AbstractColor(a, r, g, b) {
        this.a = a;
        this.r = r;
        this.g = g;
        this.b = b;
        Object.freeze(this);
    }
    AbstractColor.fromArgb = function (a, r, g, b) {
        return new AbstractColor(a, r, g, b);
    };
    AbstractColor.fromString = function (s) {
        if (s == null || s.length != 9 || s[0] != '#')
            return null;
        var a = parseInt(s.substring(1, 1 + 2), 16);
        var r = parseInt(s.substring(3, 3 + 2), 16);
        var g = parseInt(s.substring(5, 5 + 2), 16);
        var b = parseInt(s.substring(7, 7 + 2), 16);
        if (isNaN(a) || isNaN(r) || isNaN(g) || isNaN(b))
            return null;
        return this.fromArgb(a, r, g, b);
    };
    return AbstractColor;
}());
exports.AbstractColor = AbstractColor;
var AbstractColors = (function () {
    function AbstractColors() {
    }
    AbstractColors.Black = AbstractColor.fromArgb(0xFF, 0, 0, 0);
    AbstractColors.Blue = AbstractColor.fromArgb(0xFF, 0x00, 0x00, 0xFF);
    AbstractColors.Brown = AbstractColor.fromArgb(0xFF, 0xA5, 0x2A, 0x2A);
    AbstractColors.Cyan = AbstractColor.fromArgb(0xFF, 0x00, 0xFF, 0xFF);
    AbstractColors.DarkGray = AbstractColor.fromArgb(0xFF, 0xA9, 0xA9, 0xA9);
    AbstractColors.Gray = AbstractColor.fromArgb(0xFF, 0x80, 0x80, 0x80);
    AbstractColors.Green = AbstractColor.fromArgb(0xFF, 0x00, 0x80, 0x00);
    AbstractColors.LightGray = AbstractColor.fromArgb(0xFF, 0xD3, 0xD3, 0xD3);
    AbstractColors.Magenta = AbstractColor.fromArgb(0xFF, 0xFF, 0x00, 0xFF);
    AbstractColors.Orange = AbstractColor.fromArgb(0xFF, 0xFF, 0xA5, 0x00);
    AbstractColors.Purple = AbstractColor.fromArgb(0xFF, 0x80, 0x00, 0x80);
    AbstractColors.Red = AbstractColor.fromArgb(0xFF, 0xFF, 0x00, 0x00);
    AbstractColors.Transparent = AbstractColor.fromArgb(0x00, 0xFF, 0xFF, 0xFF);
    AbstractColors.White = AbstractColor.fromArgb(0xFF, 0xFF, 0xFF, 0xFF);
    AbstractColors.Yellow = AbstractColor.fromArgb(0xFF, 0xFF, 0xFF, 0x00);
    AbstractColors.LightBlue = AbstractColor.fromArgb(0xFF, 0xAD, 0xD8, 0xE6);
    return AbstractColors;
}());
exports.AbstractColors = AbstractColors;
//# sourceMappingURL=abstract_color.js.map