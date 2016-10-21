"use strict";
var growth_direction_1 = require("../model/growth_direction");
function getBaselineAdjustment(d) {
    if (d == growth_direction_1.GrowthDirection.Up)
        return 0.0;
    if (d == growth_direction_1.GrowthDirection.Uniform)
        return 0.5;
    if (d == growth_direction_1.GrowthDirection.Down)
        return 1.0;
    throw "Unknown text alignment " + d;
}
exports.getBaselineAdjustment = getBaselineAdjustment;
function getTextAnchor(d) {
    if (d == growth_direction_1.GrowthDirection.Left)
        return "end";
    if (d == growth_direction_1.GrowthDirection.Uniform)
        return "middle";
    if (d == growth_direction_1.GrowthDirection.Right)
        return "start";
    throw "Unknown text alignment " + d;
}
exports.getTextAnchor = getTextAnchor;
exports.colorToRgb = function (color) { return color == null ? null : "rgb(" + color.r.toString() + "," + color.g.toString() + "," + color.b.toString() + ")"; };
//# sourceMappingURL=svgHelpers.js.map