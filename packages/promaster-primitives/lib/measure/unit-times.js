"use strict";
var Unit = require("./unit");
function lengthByLength(left, right) {
    return Unit.times("Area", left, right);
}
exports.lengthByLength = lengthByLength;
function areaByLength(left, right) {
    return Unit.times("Volume", left, right);
}
exports.areaByLength = areaByLength;
function durationByElectricCurrent(left, right) {
    return Unit.times("ElectricCharge", left, right);
}
exports.durationByElectricCurrent = durationByElectricCurrent;
function massByAcceleration(left, right) {
    if (!left || !right)
        throw new Error("The arguments cannot be undefined");
    return Unit.times("Force", left, right);
}
exports.massByAcceleration = massByAcceleration;
function forceByLength(left, right) {
    return Unit.times("Energy", left, right);
}
exports.forceByLength = forceByLength;
function electricalPotentialByDuration(left, right) {
    return Unit.times("MagneticFlux", left, right);
}
exports.electricalPotentialByDuration = electricalPotentialByDuration;
function luminousIntensityBySolidAngle(left, right) {
    return Unit.times("LuminousFlux", left, right);
}
exports.luminousIntensityBySolidAngle = luminousIntensityBySolidAngle;
function massByArea(left, right) {
    return Unit.times("MomentOfInertia", left, right);
}
exports.massByArea = massByArea;
function dimensionlessByDimensionless(left, right) {
    return Unit.times("SoundPressureLevel", left, right);
}
exports.dimensionlessByDimensionless = dimensionlessByDimensionless;
function specificEnthalpyByTemperature(left, right) {
    return Unit.times("SpecificHeatCapacity", left, right);
}
exports.specificEnthalpyByTemperature = specificEnthalpyByTemperature;
function powerByDuration(left, right) {
    return Unit.times("Energy", left, right);
}
exports.powerByDuration = powerByDuration;
//# sourceMappingURL=unit-times.js.map