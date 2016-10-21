"use strict";
var ProductUnit = require('./units/product_unit');
function lengthByLength(left, right) {
    return ProductUnit.Product("Area", left, right);
}
exports.lengthByLength = lengthByLength;
function areaByLength(left, right) {
    return ProductUnit.Product("Volume", left, right);
}
exports.areaByLength = areaByLength;
function durationByElectricCurrent(left, right) {
    return ProductUnit.Product("ElectricCharge", left, right);
}
exports.durationByElectricCurrent = durationByElectricCurrent;
function massByAcceleration(left, right) {
    if (!left || !right)
        throw new Error("The arguments cannot be undefined");
    return ProductUnit.Product("Force", left, right);
}
exports.massByAcceleration = massByAcceleration;
function forceByLength(left, right) {
    return ProductUnit.Product("Energy", left, right);
}
exports.forceByLength = forceByLength;
function electricalPotentialByDuration(left, right) {
    return ProductUnit.Product("MagneticFlux", left, right);
}
exports.electricalPotentialByDuration = electricalPotentialByDuration;
function luminousIntensityBySolidAngle(left, right) {
    return ProductUnit.Product("LuminousFlux", left, right);
}
exports.luminousIntensityBySolidAngle = luminousIntensityBySolidAngle;
function massByArea(left, right) {
    return ProductUnit.Product("MomentOfInertia", left, right);
}
exports.massByArea = massByArea;
function dimensionlessByDimensionless(left, right) {
    return ProductUnit.Product("SoundPressureLevel", left, right);
}
exports.dimensionlessByDimensionless = dimensionlessByDimensionless;
function specificEnthalpyByTemperature(left, right) {
    return ProductUnit.Product("SpecificHeatCapacity", left, right);
}
exports.specificEnthalpyByTemperature = specificEnthalpyByTemperature;
function powerByDuration(left, right) {
    return ProductUnit.Product("Energy", left, right);
}
exports.powerByDuration = powerByDuration;
//# sourceMappingURL=unit-times.js.map