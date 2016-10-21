"use strict";
var ProductUnit = require('./units/product_unit');
function volumeByDuration(left, right) {
    return ProductUnit.Quotient("VolumeFlow", left, right);
}
exports.volumeByDuration = volumeByDuration;
function lengthByDuration(left, right) {
    return ProductUnit.Quotient("Velocity", left, right);
}
exports.lengthByDuration = lengthByDuration;
function velocityBySecond(left, right) {
    return ProductUnit.Quotient("Acceleration", left, right);
}
exports.velocityBySecond = velocityBySecond;
function amountOfSubstanceByDuration(left, right) {
    return ProductUnit.Quotient("CatalyticActivity", left, right);
}
exports.amountOfSubstanceByDuration = amountOfSubstanceByDuration;
function massByVolume(left, right) {
    return ProductUnit.Quotient("Density", left, right);
}
exports.massByVolume = massByVolume;
function electricChargeByElectricPotential(left, right) {
    return ProductUnit.Quotient("ElectricCapacitance", left, right);
}
exports.electricChargeByElectricPotential = electricChargeByElectricPotential;
function energyByDuration(left, right) {
    return ProductUnit.Quotient("Power", left, right);
}
exports.energyByDuration = energyByDuration;
function powerByElectricalCurrent(left, right) {
    return ProductUnit.Quotient("ElectricPotential", left, right);
}
exports.powerByElectricalCurrent = powerByElectricalCurrent;
function electricalCurrentByElectricalPotential(left, right) {
    return ProductUnit.Quotient("ElectricConductance", left, right);
}
exports.electricalCurrentByElectricalPotential = electricalCurrentByElectricalPotential;
function magneticFluxByElectricalCurrent(left, right) {
    return ProductUnit.Quotient("ElectricInductance", left, right);
}
exports.magneticFluxByElectricalCurrent = magneticFluxByElectricalCurrent;
function electricalPotentialByElectricalCurrent(left, right) {
    return ProductUnit.Quotient("ElectricResistance", left, right);
}
exports.electricalPotentialByElectricalCurrent = electricalPotentialByElectricalCurrent;
function dimentionlessByDuration(left, right) {
    return ProductUnit.Quotient("Frequency", left, right);
}
exports.dimentionlessByDuration = dimentionlessByDuration;
function luminousFluxByArea(left, right) {
    return ProductUnit.Quotient("Illuminance", left, right);
}
exports.luminousFluxByArea = luminousFluxByArea;
function magneticFluxByArea(left, right) {
    return ProductUnit.Quotient("MagneticFluxDensity", left, right);
}
exports.magneticFluxByArea = magneticFluxByArea;
function massByDuration(left, right) {
    return ProductUnit.Quotient("MassFlow", left, right);
}
exports.massByDuration = massByDuration;
function forceByArea(left, right) {
    return ProductUnit.Quotient("Pressure", left, right);
}
exports.forceByArea = forceByArea;
function energyByMass(left, right) {
    return ProductUnit.Quotient("SpecificEnthalpy", left, right);
}
exports.energyByMass = energyByMass;
function powerByVolumeFlow(left, right) {
    return ProductUnit.Quotient("SpecificFanPower", left, right);
}
exports.powerByVolumeFlow = powerByVolumeFlow;
function powerByTemperature(left, right) {
    return ProductUnit.Quotient("HeatCapacityRate", left, right);
}
exports.powerByTemperature = powerByTemperature;
function massByMass(left, right) {
    return ProductUnit.Quotient("HumidityRatio", left, right);
}
exports.massByMass = massByMass;
function dimensionlessByVolume(left, right) {
    return ProductUnit.Quotient("DimensionlessPerVolume", left, right);
}
exports.dimensionlessByVolume = dimensionlessByVolume;
function dimensionlessByEnergy(left, right) {
    return ProductUnit.Quotient("DimensionlessPerEnergy", left, right);
}
exports.dimensionlessByEnergy = dimensionlessByEnergy;
function dimensionlessByDuration(left, right) {
    return ProductUnit.Quotient("DimensionlessPerDuration", left, right);
}
exports.dimensionlessByDuration = dimensionlessByDuration;
function powerByArea(left, right) {
    return ProductUnit.Quotient("Intensity", left, right);
}
exports.powerByArea = powerByArea;
function volumeByEnergy(left, right) {
    return ProductUnit.Quotient("WaterUseEfficiency", left, right);
}
exports.volumeByEnergy = volumeByEnergy;
function massByEnergy(left, right) {
    return ProductUnit.Quotient("Emission", left, right);
}
exports.massByEnergy = massByEnergy;
function massFlowByArea(left, right) {
    return ProductUnit.Quotient("MassFlowPerArea", left, right);
}
exports.massFlowByArea = massFlowByArea;
function energyByVolume(left, right) {
    return ProductUnit.Quotient("HeatingValue", left, right);
}
exports.energyByVolume = energyByVolume;
function volumeFlowByPower(left, right) {
    return ProductUnit.Quotient("VolumeFlowPerPower", left, right);
}
exports.volumeFlowByPower = volumeFlowByPower;
function volumeFlowByArea(left, right) {
    return ProductUnit.Quotient("VolumeFlowPerArea", left, right);
}
exports.volumeFlowByArea = volumeFlowByArea;
function dimensionlessByMass(left, right) {
    return ProductUnit.Quotient("DimensionlessPerMass", left, right);
}
exports.dimensionlessByMass = dimensionlessByMass;
//# sourceMappingURL=unit-divide.js.map