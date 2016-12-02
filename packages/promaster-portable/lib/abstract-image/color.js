"use strict";
function fromArgb(a, r, g, b) {
    return { a: a, r: r, g: g, b: b };
}
exports.fromArgb = fromArgb;
function fromString(s) {
    if (s === null || s === undefined || s.length !== 9 || s[0] !== "#") {
        return undefined;
    }
    var a = parseInt(s.substring(1, 1 + 2), 16);
    var r = parseInt(s.substring(3, 3 + 2), 16);
    var g = parseInt(s.substring(5, 5 + 2), 16);
    var b = parseInt(s.substring(7, 7 + 2), 16);
    if (isNaN(a) || isNaN(r) || isNaN(g) || isNaN(b)) {
        return undefined;
    }
    return fromArgb(a, r, g, b);
}
exports.fromString = fromString;
exports.black = fromArgb(0xFF, 0, 0, 0);
exports.blue = fromArgb(0xFF, 0x00, 0x00, 0xFF);
exports.brown = fromArgb(0xFF, 0xA5, 0x2A, 0x2A);
exports.cyan = fromArgb(0xFF, 0x00, 0xFF, 0xFF);
exports.darkGray = fromArgb(0xFF, 0xA9, 0xA9, 0xA9);
exports.gray = fromArgb(0xFF, 0x80, 0x80, 0x80);
exports.green = fromArgb(0xFF, 0x00, 0x80, 0x00);
exports.lightGray = fromArgb(0xFF, 0xD3, 0xD3, 0xD3);
exports.magenta = fromArgb(0xFF, 0xFF, 0x00, 0xFF);
exports.orange = fromArgb(0xFF, 0xFF, 0xA5, 0x00);
exports.purple = fromArgb(0xFF, 0x80, 0x00, 0x80);
exports.red = fromArgb(0xFF, 0xFF, 0x00, 0x00);
exports.transparent = fromArgb(0x00, 0xFF, 0xFF, 0xFF);
exports.white = fromArgb(0xFF, 0xFF, 0xFF, 0xFF);
exports.yellow = fromArgb(0xFF, 0xFF, 0xFF, 0x00);
exports.lightBlue = fromArgb(0xFF, 0xAD, 0xD8, 0xE6);
//# sourceMappingURL=color.js.map