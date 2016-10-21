"use strict";
(function (GrowthDirection) {
    /// The element will grow upward
    GrowthDirection[GrowthDirection["Up"] = 0] = "Up";
    /// The element will grow downward
    GrowthDirection[GrowthDirection["Down"] = 1] = "Down";
    /// The element will grow in all directions from its center
    GrowthDirection[GrowthDirection["Uniform"] = 2] = "Uniform";
    /// The element will grow to the left
    GrowthDirection[GrowthDirection["Left"] = 3] = "Left";
    /// The element will grow to the right
    GrowthDirection[GrowthDirection["Right"] = 4] = "Right";
})(exports.GrowthDirection || (exports.GrowthDirection = {}));
var GrowthDirection = exports.GrowthDirection;
//# sourceMappingURL=growth_direction.js.map