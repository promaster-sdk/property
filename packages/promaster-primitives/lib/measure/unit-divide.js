"use strict";
var Unit = require("./unit");
function volumeByDuration(left, right) {
    return Unit.divide("VolumeFlow", left, right);
}
exports.volumeByDuration = volumeByDuration;
function lengthByDuration(left, right) {
    return Unit.divide("Velocity", left, right);
}
exports.lengthByDuration = lengthByDuration;
function velocityBySecond(left, right) {
    return Unit.divide("Acceleration", left, right);
}
exports.velocityBySecond = velocityBySecond;
function amountOfSubstanceByDuration(left, right) {
    return Unit.divide("CatalyticActivity", left, right);
}
exports.amountOfSubstanceByDuration = amountOfSubstanceByDuration;
function massByVolume(left, right) {
    return Unit.divide("Density", left, right);
}
exports.massByVolume = massByVolume;
function electricChargeByElectricPotential(left, right) {
    return Unit.divide("ElectricCapacitance", left, right);
}
exports.electricChargeByElectricPotential = electricChargeByElectricPotential;
function energyByDuration(left, right) {
    return Unit.divide("Power", left, right);
}
exports.energyByDuration = energyByDuration;
function powerByElectricalCurrent(left, right) {
    return Unit.divide("ElectricPotential", left, right);
}
exports.powerByElectricalCurrent = powerByElectricalCurrent;
function electricalCurrentByElectricalPotential(left, right) {
    return Unit.divide("ElectricConductance", left, right);
}
exports.electricalCurrentByElectricalPotential = electricalCurrentByElectricalPotential;
function magneticFluxByElectricalCurrent(left, right) {
    return Unit.divide("ElectricInductance", left, right);
}
exports.magneticFluxByElectricalCurrent = magneticFluxByElectricalCurrent;
function electricalPotentialByElectricalCurrent(left, right) {
    return Unit.divide("ElectricResistance", left, right);
}
exports.electricalPotentialByElectricalCurrent = electricalPotentialByElectricalCurrent;
function dimentionlessByDuration(left, right) {
    return Unit.divide("Frequency", left, right);
}
exports.dimentionlessByDuration = dimentionlessByDuration;
function luminousFluxByArea(left, right) {
    return Unit.divide("Illuminance", left, right);
}
exports.luminousFluxByArea = luminousFluxByArea;
function magneticFluxByArea(left, right) {
    return Unit.divide("MagneticFluxDensity", left, right);
}
exports.magneticFluxByArea = magneticFluxByArea;
function massByDuration(left, right) {
    return Unit.divide("MassFlow", left, right);
}
exports.massByDuration = massByDuration;
function forceByArea(left, right) {
    return Unit.divide("Pressure", left, right);
}
exports.forceByArea = forceByArea;
function energyByMass(left, right) {
    return Unit.divide("SpecificEnthalpy", left, right);
}
exports.energyByMass = energyByMass;
function powerByVolumeFlow(left, right) {
    return Unit.divide("SpecificFanPower", left, right);
}
exports.powerByVolumeFlow = powerByVolumeFlow;
function powerByTemperature(left, right) {
    return Unit.divide("HeatCapacityRate", left, right);
}
exports.powerByTemperature = powerByTemperature;
function massByMass(left, right) {
    return Unit.divide("HumidityRatio", left, right);
}
exports.massByMass = massByMass;
function dimensionlessByVolume(left, right) {
    return Unit.divide("DimensionlessPerVolume", left, right);
}
exports.dimensionlessByVolume = dimensionlessByVolume;
function dimensionlessByEnergy(left, right) {
    return Unit.divide("DimensionlessPerEnergy", left, right);
}
exports.dimensionlessByEnergy = dimensionlessByEnergy;
function dimensionlessByDuration(left, right) {
    return Unit.divide("DimensionlessPerDuration", left, right);
}
exports.dimensionlessByDuration = dimensionlessByDuration;
function powerByArea(left, right) {
    return Unit.divide("Intensity", left, right);
}
exports.powerByArea = powerByArea;
function volumeByEnergy(left, right) {
    return Unit.divide("WaterUseEfficiency", left, right);
}
exports.volumeByEnergy = volumeByEnergy;
function massByEnergy(left, right) {
    return Unit.divide("Emission", left, right);
}
exports.massByEnergy = massByEnergy;
function massFlowByArea(left, right) {
    return Unit.divide("MassFlowPerArea", left, right);
}
exports.massFlowByArea = massFlowByArea;
function energyByVolume(left, right) {
    return Unit.divide("HeatingValue", left, right);
}
exports.energyByVolume = energyByVolume;
function volumeFlowByPower(left, right) {
    return Unit.divide("VolumeFlowPerPower", left, right);
}
exports.volumeFlowByPower = volumeFlowByPower;
function volumeFlowByArea(left, right) {
    return Unit.divide("VolumeFlowPerArea", left, right);
}
exports.volumeFlowByArea = volumeFlowByArea;
function dimensionlessByMass(left, right) {
    return Unit.divide("DimensionlessPerMass", left, right);
}
exports.dimensionlessByMass = dimensionlessByMass;
//# sourceMappingURL=unit-divide.js.map