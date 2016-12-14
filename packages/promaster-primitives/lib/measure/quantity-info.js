"use strict";
var Units = require("./units");
var quantityInfo = {};
addQuantity("Acceleration", Units.MeterPerSquareSecond, Units.MeterPerSquareSecond);
addQuantity("Alkalinity", Units.MilliGramHydrogenCarbonatePerLiter, Units.MilliGramHydrogenCarbonatePerLiter);
addQuantity("Angle", Units.Degrees, Units.Degrees);
addQuantity("Area", Units.SquareMeter, Units.SquareInch);
addQuantity("DeltaTemperature", Units.DeltaCelsius, Units.DeltaFahrenheit);
addQuantity("Density", Units.KilogramPerCubicMeter, Units.KilogramPerCubicMeter);
addQuantity("Dimensionless", Units.Percent, Units.Percent);
addQuantity("DimensionlessPerEnergy", Units.OnePerKiloWattHour, Units.OnePerKiloWattHour);
addQuantity("DimensionlessPerMass", Units.OnePerKilogram, Units.OnePerPoundLb);
addQuantity("DimensionlessPerVolume", Units.OnePerCubicMeter, Units.OnePerCubicMeter);
addQuantity("Duration", Units.Minute, Units.Minute);
addQuantity("ElectricCurrent", Units.Ampere, Units.Ampere);
addQuantity("ElectricPotential", Units.Volt, Units.Volt);
addQuantity("Energy", Units.KiloWattHour, Units.KiloWattHour);
addQuantity("Force", Units.Newton, Units.Newton);
addQuantity("Frequency", Units.Hertz, Units.Hertz);
addQuantity("HeatCapacityRate", Units.KilowattPerCelsius, Units.KilowattPerCelsius);
addQuantity("HeatingValue", Units.KiloWattHourPerCubicMeter, Units.KiloWattHourPerCubicMeter);
addQuantity("HumidityRatio", Units.GramPerKilogram, Units.GrainPerPoundLb);
addQuantity("Intensity", Units.WattPerSquareMeter, Units.WattPerSquareMeter);
addQuantity("Length", Units.Meter, Units.Foot);
addQuantity("Mass", Units.Kilogram, Units.PoundLb);
addQuantity("MassFlow", Units.StandardCubicMeterPerHour, Units.StandardCubicFeetPerMinute);
addQuantity("MassFlowPerArea", Units.KilogramPerSquareMeterSecond, Units.KilogramPerSquareMeterSecond);
addQuantity("MomentOfInertia", Units.KilogramSquareMeter, Units.KilogramSquareMeter);
addQuantity("Power", Units.KiloWatt, Units.HorsePower);
addQuantity("Pressure", Units.Pascal, Units.InchOfWaterColumn);
addQuantity("RelativeHumidity", Units.PercentHumidity, Units.PercentHumidity);
addQuantity("SoundPressureLevel", Units.Decibel, Units.Decibel);
addQuantity("SpecificEnthalpy", Units.KilojoulePerKilogram, Units.KilojoulePerKilogram);
addQuantity("SpecificFanPower", Units.WattPerCubicMeterPerSecond, Units.WattPerCubicMeterPerSecond);
addQuantity("SpecificHeatCapacity", Units.KilojoulePerKilogramCelsius, Units.KilojoulePerKilogramCelsius);
addQuantity("Temperature", Units.Celsius, Units.Fahrenheit);
addQuantity("Velocity", Units.MeterPerSecond, Units.FeetPerMinute);
addQuantity("Viscosity", Units.PascalSecond, Units.PascalSecond);
addQuantity("Volume", Units.CubicMeter, Units.CubicFeet);
addQuantity("VolumeFlow", Units.CubicMeterPerSecond, Units.CubicFeetPerMinute);
addQuantity("VolumeFlowPerPower", Units.LiterPerSecondPerKiloWatt, Units.GallonsPerMinutePerTonCooling);
addQuantity("WaterHardness", Units.MilliGramCalciumPerLiter, Units.MilliGramCalciumPerLiter);
addQuantity("WaterUseEfficiency", Units.LiterPerKiloWattHour, Units.LiterPerKiloWattHour);
addQuantity("WetTemperature", Units.CelsiusWet, Units.FahrenheitWet);
function addQuantity(quantity, siUnit, ipUnit) {
    quantityInfo[quantity] = { siUnit: siUnit, ipUnit: ipUnit };
}
exports.addQuantity = addQuantity;
function getQuantityInfo(quantity) {
    return quantityInfo[quantity];
}
exports.getQuantityInfo = getQuantityInfo;
//# sourceMappingURL=quantity-info.js.map