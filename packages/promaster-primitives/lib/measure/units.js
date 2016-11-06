"use strict";
var Unit = require("./unit");
var UnitName = require("./unit-name");
var UnitDivide = require('./unit-divide');
var UnitTimes = require('./unit-times');
// const _unitToString: Map<Unit.Unit<any>, string> = new Map();
var _unitToString = {};
var _stringToUnit = {};
var _quantityToUnits = {};
function _register(unit, label) {
    if (label === void 0) { label = ""; }
    UnitName.registerLabel(label, unit);
    return unit;
}
exports.One = _register(Unit.One, " ");
exports.Percent = _register(Unit.divideNumber(100.0, exports.One), "%");
exports.PPM = _register(Unit.divideNumber(1000000.0, exports.One), "ppm");
///////////////////
/// SI BASE UNITS //
///////////////////
/**
 * The International System of Units (SI) defines seven units of measure as a basic set from which
 * all other SI units are derived. These SI base units and their physical quantities are:[1]
 * ampere for electric current
 * candela for luminous intensity
 * meter for length
 * kilogram for mass
 * second for time
 * kelvin for temperature
 * mole for the amount of substance
 */
/**
 * The base unit for electric current quantities ( <code>A</code> ).
 * The Ampere is that export constant current which,
 * if maintained in two straight parallel conductors of infinite length,
 * of negligible circular cross-section, and placed 1 metre apart in vacuum,
 * would produce between these conductors a force equal to 2 × 10-7 newton per metre of length.
 * It is named after the French physicist Andre Ampere (1775-1836).
 */
exports.Ampere = _register(Unit.createBase("ElectricCurrent", "A"), "A");
/**
 * The base unit for luminous intensity quantities ( <code>cd</code> ).
 * The candela is the luminous intensity, in a given direction, of a source
 * that emits monochromatic radiation of frequency 540 × 1012 hertz and that
 * has a radiant intensity in that direction of 1/683 watt per steradian.
 * @see <a href="http://en.wikipedia.org/wiki/Candela">Wikipedia: Candela</a>
 */
exports.Candela = _register(Si(Unit.createBase("LuminousIntensity", "cd")), "cd");
/**
 * The base unit for thermodynamic temperature quantities ( <code>K</code> ).
 * The kelvin is the 1/273.16th of the thermodynamic temperature of the triple point of water.
 * It is named after the Scottish mathematician and physicist William Thomson 1st Lord Kelvin (1824-1907).
 */
exports.Kelvin = _register(Unit.createBase("Temperature", "K"), "K");
/**
 * The base unit for mass quantities ( <code>kg</code> ).
 * It is the only SI unit with a prefix as part of its name and symbol.
 * The kilogram is equal to the mass of an international prototype in the form
 * of a platinum-iridium cylinder kept at Sevres in France.
 * @see #Gram
 */
exports.Kilogram = _register(Unit.createBase("Mass", "kg"), "kg");
/**
 * The base unit for length quantities ( <code>m</code> ).
 * One meter was redefined in 1983 as the distance traveled by light in a vacuum in 1/299,792,458 of a second.
 */
exports.Meter = _register(Unit.createBase("Length", "m"), "m");
/**
 * The base unit for amount of substance quantities ( <code>mol</code> ).
 * The mole is the amount of substance of a system which contains as many elementary
 * entities as there are atoms in 0.012 kilogram of carbon 12.
 */
exports.Mole = _register(Si(Unit.createBase("AmountOfSubstance", "mol")), "mol");
/**
 * The base unit for duration quantities ( <code>s</code> ). It is defined as the duration of 9,192,631,770 cycles of radiation corresponding to the transition between two hyperfine levels of the ground state of cesium (1967 Standard).
 */
exports.Second = _register(Unit.createBase("Duration", "s"), "s");
//////////////////////////////
/// SI DERIVED PRODUCT UNITS //
//////////////////////////////
/** The metric unit for velocity quantities ( <code>m/s</code> ). */
exports.MeterPerSecond = _register(UnitDivide.lengthByDuration(exports.Meter, exports.Second), "m/s");
/** The metric unit for acceleration quantities ( <code>m/s²</code> ). */
exports.MeterPerSquareSecond = _register(UnitDivide.velocityBySecond(exports.MeterPerSecond, exports.Second));
/** The metric unit for area quantities ( <code>m²</code> ). */
exports.SquareMeter = _register(Squared(exports.Meter), "m²");
/** The metric unit for volume quantities ( <code>m³</code> ). */
exports.CubicMeter = _register(Cubed(exports.Meter), "m³");
/** Equivalent to <code>KILO(METER)</code>. */
exports.Kilometer = _register(Kilo(exports.Meter), "km");
/** Equivalent to <code>CENTI(METRE)</code>. */
exports.CentiMeter = _register(Centi(exports.Meter), "cm");
/** Equivalent to <code>MILLI(METRE)</code>. */
exports.Millimeter = _register(Milli(exports.Meter), "mm");
////////////////////////////////
/// SI DERIVED ALTERNATE UNITS //
////////////////////////////////
/**
 * AlternateUnits seems to be units with names like "Newton", "Celsius" while
 * ProductUnits seem to be units with names like "MeterPerSecond"
 */
/** The derived unit for mass quantities ( <code>g</code> ).
 * The base unit for mass quantity is {@link #Kilogram}. */
exports.Gram = _register(Unit.divideNumber(1000.0, exports.Kilogram), "g");
/**
 * The unit for plane angle quantities ( <code>rad</code> ).
 * One radian is the angle between two radii of a circle such that the length of the arc between them is equal to the radius.
 */
exports.Radian = _register(Unit.createAlternate("rad", exports.One), "rad");
/**
 * The unit for solid angle quantities ( <code>sr</code> ).
 * One steradian is the solid angle subtended at the center of a sphere by an area on the
 * surface of the sphere that is equal to the radius squared. The total solid angle of a sphere is 4*Pi steradians.
 */
exports.Steradian = _register(Unit.createAlternate("sr", exports.One), "sr");
/**
 * The unit for binary information ( <code>bit</code> ).
 */
exports.Bit = _register(Unit.createAlternate("bit", exports.One), "bit");
/**
 * The derived unit for frequency ( <code>Hz</code> ).
 * A unit of frequency equal to one cycle per second. After Heinrich Rudolf Hertz (1857-1894),
 * German physicist who was the first to produce radio waves artificially.
 */
exports.Hertz = _register(Unit.createAlternate("Hz", UnitDivide.dimentionlessByDuration(exports.One, exports.Second)), "Hz");
/**
 * The derived unit for force ( <code>N</code> ).
 * One newton is the force required to give a mass of 1 kilogram an Force of 1 metre per second per second.
 * It is named after the English mathematician and physicist Sir Isaac Newton (1642-1727).
 */
exports.Newton = _register(Unit.createAlternate("N", UnitTimes.massByAcceleration(exports.Kilogram, exports.MeterPerSquareSecond)), "N");
/**
 * The derived unit for pressure, stress ( <code>Pa</code> ).
 * One pascal is equal to one newton per square meter.
 * It is named after the French philosopher and mathematician Blaise Pascal (1623-1662).
 */
exports.Pascal = _register(Unit.createAlternate("Pa", UnitDivide.forceByArea(exports.Newton, Squared(exports.Meter))), "Pa");
/**
 * The derived unit for energy, work, quantity of heat ( <code>J</code> ).
 * One joule is the amount of work done when an applied force of 1 newton moves
 * through a distance of 1 metre in the direction of the force.
 * It is named after the English physicist James Prescott Joule (1818-1889).
 */
exports.Joule = _register(Unit.createAlternate("J", UnitTimes.forceByLength(exports.Newton, exports.Meter)), "J");
/**
 * The derived unit for power, radiant, flux ( <code>W</code> ).
 * One watt is equal to one joule per second.
 * It is named after the British scientist James Watt (1736-1819).
 */
exports.Watt = _register(Unit.createAlternate("W", UnitDivide.energyByDuration(exports.Joule, exports.Second)), "W");
/**
 * The derived unit for electric charge, quantity of electricity ( <code>C</code> ).
 * One Coulomb is equal to the quantity of charge transferred in one second by a steady current of one ampere.
 * It is named after the French physicist Charles Augustin de Coulomb (1736-1806).
 */
exports.Coulomb = _register(Unit.createAlternate("C", UnitTimes.durationByElectricCurrent(exports.Second, exports.Ampere)), "C");
/**
 * The derived unit for electric potential difference, electromotive force ( <code>V</code> ).
 * One Volt is equal to the difference of electric potential between two points on a conducting
 * wire carrying a export constant current of one ampere when the power dissipated between the points is one watt.
 * It is named after the Italian physicist Count Alessandro Volta (1745-1827).
 */
exports.Volt = _register(Unit.createAlternate("V", UnitDivide.powerByElectricalCurrent(exports.Watt, exports.Ampere)), "V");
/**
 * The derived unit for capacitance ( <code>F</code> ).
 * One Farad is equal to the capacitance of a capacitor having an equal and opposite charge of 1 coulomb on
 * each plate and a potential difference of 1 volt between the plates.
 * It is named after the British physicist and chemist Michael Faraday (1791-1867).
 */
exports.Farad = _register(Unit.createAlternate("F", UnitDivide.electricChargeByElectricPotential(exports.Coulomb, exports.Volt)), "F");
/**
 * The derived unit for electric resistance ( <code>Ω</code> or <code>Ohm</code> ).
 * One Ohm is equal to the resistance of a conductor in which a current of one ampere is produced
 * by a potential of one volt across its terminals.
 * It is named after the German physicist Georg Simon Ohm (1789-1854).
 */
exports.Ohm = _register(Si(Unit.createAlternate("Ω", UnitDivide.electricalPotentialByElectricalCurrent(exports.Volt, exports.Ampere))));
/**
 * The derived unit for electric conductance ( <code>S</code> ).
 * One Siemens is equal to one ampere per volt.
 * It is named after the German engineer Ernst Werner von Siemens (1816-1892).
 */
exports.Siemens = _register(Si(Unit.createAlternate("S", UnitDivide.electricalCurrentByElectricalPotential(exports.Ampere, exports.Volt))));
/**
 * The derived unit for magnetic flux ( <code>Wb</code> ).
 * One Weber is equal to the magnetic flux that in linking a circuit of one turn produces in it an
 * electromotive force of one volt as it is uniformly reduced to zero within one second.
 * It is named after the German physicist Wilhelm Eduard Weber (1804-1891).
 */
exports.Weber = _register(Si(Unit.createAlternate("Wb", UnitTimes.electricalPotentialByDuration(exports.Volt, exports.Second))));
/**
 * The derived unit for magnetic flux density ( <code>T</code> ).
 * One Tesla is equal equal to one weber per square meter.
 * It is named after the Serbian-born American electrical engineer and physicist Nikola Tesla (1856-1943).
 */
exports.Tesla = _register(Si(Unit.createAlternate("T", UnitDivide.magneticFluxByArea(exports.Weber, Squared(exports.Meter)))));
/**
 * The derived unit for inductance ( <code>H</code> ).
 * One Henry is equal to the inductance for which an induced electromotive force of one volt is produced
 * when the current is varied at the rate of one ampere per second.
 * It is named after the American physicist Joseph Henry (1791-1878).
 */
exports.Henry = _register(Si(Unit.createAlternate("H", UnitDivide.magneticFluxByElectricalCurrent(exports.Weber, exports.Ampere))));
/**
 * The derived unit for Celsius temperature ( <code>℃</code> ).
 * This is a unit of temperature such as the freezing point of water (at one atmosphere of pressure)
 * is 0 ℃, while the boiling point is 100 ℃.
 */
exports.Celsius = _register(Si(Unit.plus(273.15, exports.Kelvin)), "°C");
/**
 * The derived unit for luminous flux ( <code>lm</code> ).
 * One Lumen is equal to the amount of light given out through a solid angle by a source of one
 * candela intensity radiating equally in all directions.
 */
exports.Lumen = _register(Si(Unit.createAlternate("lm", UnitTimes.luminousIntensityBySolidAngle(exports.Candela, exports.Steradian))));
/**
 * The derived unit for illuminance ( <code>lx</code> ).
 * One Lux is equal to one lumen per square meter.
 */
exports.Lux = _register(Si(Unit.createAlternate("lx", UnitDivide.luminousFluxByArea(exports.Lumen, Squared(exports.Meter)))));
/**
 * The derived unit for activity of a radionuclide ( <code>Bq</code> ).
 * One becquerel is the radiation caused by one disintegration per second.
 * It is named after the French physicist, Antoine-Henri Becquerel (1852-1908).
 */
exports.Becquerel = _register(Si(Unit.createAlternate("Bq", UnitDivide.dimentionlessByDuration(exports.One, exports.Second))));
/**
 * The derived unit for absorbed dose, specific energy (imparted), kerma ( <code>Gy</code> ).
 * One gray is equal to the dose of one joule of energy absorbed per one kilogram of matter.
 * It is named after the British physician L. H. Gray (1905-1965).
 */
exports.Gray = _register(Si(Unit.createAlternate("Gy", UnitDivide.energyByMass(exports.Joule, exports.Kilogram))));
/**
 * The derived unit for dose equivalent ( <code>Sv</code> ).
 * One Sievert is equal is equal to the actual dose, in grays, multiplied by a "quality factor" which is
 * larger for more dangerous forms of radiation.
 * It is named after the Swedish physicist Rolf Sievert (1898-1966).
 */
exports.Sievert = _register(Si(Unit.createAlternate("Sv", UnitDivide.energyByMass(exports.Joule, exports.Kilogram))));
/**
 * The derived unit for catalytic activity ( <code>kat</code> ).
 */
exports.Katal = _register(Si(Unit.createAlternate("kat", UnitDivide.amountOfSubstanceByDuration(exports.Mole, exports.Second))));
/////////////////
/// SI PREFIXES //
/////////////////
function Giga(u) {
    return Unit.timesNumber(Math.pow(10, 9), u);
}
function Mega(u) {
    return Unit.timesNumber(Math.pow(10, 6), u);
}
/**
 * Returns the specified unit multiplied by the factor <code>10<sup>3</sup></code>
 * @param unit Any unit.
 * @returns <code>unit.multiply(1e3)</code> .
 */
function Kilo(unit) {
    return Unit.timesNumber(Math.pow(10.0, 3), unit);
}
/**
 * Returns the specified unit multiplied by the factor <code>10<sup>2</sup></code>.
 * @param unit any unit.
 * @returns <code>unit.multiply(1e2)</code> .
 */
function Hecto(unit) {
    return Unit.timesNumber(Math.pow(10, 2), unit);
}
/**
 * Returns the specified unit multiplied by the factor <code>10<sup>-1</sup></code>.
 * @param unit any unit.
 * @return <code>unit.multiply(1e-1)</code>.
 */
function Deci(unit) {
    return Unit.timesNumber(Math.pow(10, -1), unit);
}
/**
 * Returns the specified unit multiplied by the factor <code>10<sup>-2</sup></code>.
 * @param unit any unit.
 * @returns <code>unit.multiply(1e-2)</code> .
 */
function Centi(unit) {
    return Unit.timesNumber(Math.pow(10, -2), unit);
}
/**
 * Returns the specified unit multiplied by the factor <code>10<sup>-3</sup></code>.
 * @param unit any unit. @return <code>unit.multiply(1e-3)</code> .
 */
function Milli(unit) {
    return Unit.timesNumber(Math.pow(10, -3), unit);
}
function Si(toAdd) {
    // TODO
    return toAdd;
}
function Squared(u) {
    return UnitTimes.lengthByLength(u, u);
    // TODO was return u.Times <q.Area> (u);
}
function Cubed(u) {
    var area = UnitTimes.lengthByLength(u, u);
    return UnitTimes.areaByLength(area, u);
    // TODO was return u.Times < IArea > (u).Times < IVolume > (u);
}
////////////////////////////////////////////////////////////////////////////
/// END: System of Units - SI
////////////////////////////////////////////////////////////////////////////
/// Alternative Quantities for Humidity
// export const HumidityFactor: Unit.Unit<q.RelativeHumidity> = _register(Unit.createProductUnit<q.RelativeHumidity>("RelativeHumidity", []), "r.H. factor");
exports.HumidityFactor = _register(Unit.createAlternate("r.H.", exports.One), "r.H. factor");
/** Factor of humidity, eg., 0.01 means 1% */
exports.PercentHumidity = _register((Unit.divideNumber(100.0, exports.HumidityFactor)), "% r.H.");
/** Percent of humidity, eg., 10.0 means 10% */
exports.CelsiusWet = _register(Unit.createBase("WetTemperature", "wb°C"), "wb°C");
exports.FahrenheitWet = _register((Unit.minus(32.0, Unit.timesNumber((5.0 / 9.0), exports.CelsiusWet))), "wb°F");
exports.KelvinWet = _register((Unit.minus(273.15, exports.CelsiusWet)), "wb°K");
exports.CelsiusDewPoint = _register(Unit.createBase("DewPointTemperature", "dp°C"), "dp°C");
exports.FahrenheitDewPoint = _register((Unit.minus(32.0, Unit.timesNumber((5.0 / 9.0), exports.CelsiusDewPoint))), "dp°F");
exports.KelvinDewPoint = _register((Unit.minus(273.15, exports.CelsiusDewPoint)), "dp°K");
/// Mass
exports.PoundLb = _register(Unit.divideNumber((100000000.0 / 45359237.0), exports.Kilogram), "lb");
// http://www.wolframalpha.com/input/?i=kg
exports.Grain = _register(Unit.divideNumber((100000000000.0 / 6479891.0), exports.Kilogram), "gr");
// http://www.wolframalpha.com/input/?i=grain
exports.Slug = _register(Unit.timesNumber(14.5939, exports.Kilogram), "slug");
exports.Tonne = _register(Unit.timesNumber(1000.0, exports.Kilogram), "t");
exports.MilliGram = _register(Milli(exports.Gram), "mg");
// Per mass
exports.OnePerKilogram = _register(UnitDivide.dimensionlessByMass(exports.One, exports.Kilogram), "/kg");
exports.OnePerPoundLb = _register(UnitDivide.dimensionlessByMass(exports.One, exports.PoundLb), "/lb");
// Length
exports.Foot = _register(Unit.timesNumber(0.3048, exports.Meter), "ft");
exports.Yard = _register(Unit.timesNumber(3.0, exports.Foot), "yd");
exports.Inch = _register(Unit.divideNumber(12.0, exports.Foot), "in");
exports.Mile = _register(Unit.timesNumber(5280.0, exports.Foot), "mi");
exports.Decimeter = _register(Deci(exports.Meter), "dm");
// Temperature
exports.Rankine = _register(Unit.divideNumber(9.0, Unit.timesNumber(5.0, exports.Kelvin)), "Rankine");
exports.Fahrenheit = _register(Unit.plus(459.67, Unit.divideNumber(9.0, Unit.timesNumber(5.0, exports.Kelvin))), "°F");
// Delta temperature
exports.DeltaCelsius = _register(Unit.createBase("DeltaTemperature", "°C"), "°C");
exports.DeltaFahrenheit = _register(Unit.timesNumber((5.0 / 9.0), exports.DeltaCelsius), "°F");
// Duration / Time
exports.Minute = _register(Unit.timesNumber(60.0, exports.Second), "min");
exports.Hour = _register(Unit.timesNumber(60.0, exports.Minute), "h");
exports.Day = _register(Unit.timesNumber(24.0, exports.Hour), "days");
exports.Week = _register(Unit.timesNumber(7.0, exports.Day), "weeks");
exports.Year = _register(Unit.timesNumber(8760.0, exports.Hour), "year");
// Frequency
exports.RevolutionsPerMinute = _register(Unit.createAlternate("rpm", UnitDivide.dimentionlessByDuration(exports.One, exports.Minute)), "rpm");
exports.RevolutionsPerHour = _register(Unit.createAlternate("rph", UnitDivide.dimentionlessByDuration(exports.One, exports.Hour)), "rph");
/// Area
exports.SquareInch = _register(Squared(exports.Inch), "in²");
exports.SquareFeet = _register(Squared(exports.Foot), "ft²");
exports.SquareMillimeter = _register(Squared(exports.Millimeter), "mm²");
exports.SquareCentimeter = _register(Squared(exports.CentiMeter), "cm²");
exports.SquareDecimeter = _register(Squared(exports.Decimeter), "dm²");
// Angle
exports.Degrees = _register(Unit.timesNumber((180.0 / Math.PI), exports.Radian), "°");
// Volume
exports.CubicCentiMeter = _register(Cubed(exports.CentiMeter), "cm³");
exports.CubicFeet = _register(Cubed(exports.Foot), "ft³");
exports.HundredCubicFeet = _register((Unit.timesNumber(100.0, exports.CubicFeet)), "100 ft³");
exports.Liter = _register((Unit.divideNumber(1000.0, exports.CubicMeter)), "L");
exports.MilliLiter = _register(Milli(exports.Liter), "ml");
exports.Gallon = _register((Unit.timesNumber(3.785, exports.Liter)), "gal");
// Velocity
exports.FeetPerSecond = _register(UnitDivide.lengthByDuration(exports.Foot, exports.Second), "ft/s");
exports.FeetPerMinute = _register(UnitDivide.lengthByDuration(exports.Foot, exports.Minute), "ft/min");
exports.KilometerPerHour = _register(UnitDivide.lengthByDuration(exports.Kilometer, exports.Hour), "km/h");
exports.MeterPerHour = _register(UnitDivide.lengthByDuration(exports.Meter, exports.Hour), "m/h");
// Acceleration
// Density
exports.KilogramPerCubicMeter = _register(UnitDivide.massByVolume(exports.Kilogram, exports.CubicMeter), "kg/m³");
exports.GramPerCubicCentiMeter = _register(UnitDivide.massByVolume(exports.Gram, exports.CubicCentiMeter), "g/cm³");
exports.SlugPerCubicFeet = _register(UnitDivide.massByVolume(exports.Slug, exports.CubicFeet), "slug/ft³");
// Force
exports.PoundForce = _register(Unit.divideNumber(8896443230521.0, Unit.timesNumber(2000000000000.0, exports.Newton)), "lb");
// Pressure
exports.KiloPascal = _register(Kilo(exports.Pascal), "kPa");
exports.HectoPascal = _register(Hecto(exports.Pascal), "hPa");
exports.NewtonPerSquareMeter = _register(UnitDivide.forceByArea(exports.Newton, exports.SquareMeter), "N/m²");
exports.PoundForcePerSquareInch = _register(Unit.divideNumber(1290320000.0, Unit.timesNumber(8896443230521.0, exports.Pascal)), "psi");
// http://www.wolframalpha.com/input/?i=psi and select 'Show exact conversions'
exports.InchOfMercury = _register(Unit.divideNumber(152.0, Unit.timesNumber(514731.0, exports.Pascal)), "in HG");
// http://www.wolframalpha.com/input/?i=inHg and select 'Show exact conversions'
exports.InchOfWaterColumn = _register(Unit.timesNumber(249.0889, exports.Pascal), "in WC");
// http://www.wolframalpha.com/input/?i=inWC
exports.FeetOfWaterColumn = _register(Unit.timesNumber(2989.067, exports.Pascal), "ft WC");
exports.Bar = _register(Unit.timesNumber(100000.0, exports.Pascal), "bar");
exports.MilliBar = _register(Milli(exports.Bar), "mbar");
// Power
exports.KiloWatt = _register(Kilo(exports.Watt), "kW");
exports.MegaWatt = _register(Mega(exports.Watt), "MW");
exports.GigaWatt = _register(Giga(exports.Watt), "GW");
exports.BtuPerHour = _register(Unit.divideNumber(3600.0, Unit.timesNumber(52752792631.0 / 50000000.0, exports.Watt)), "BTU/h");
exports.TonCooling = _register(Unit.timesNumber(12000.0, exports.BtuPerHour), "tons");
exports.KiloBtuPerHour = _register(Kilo(exports.BtuPerHour), "MBH");
exports.HorsePower = _register(Unit.timesNumber(745.699872, exports.Watt), "hp");
exports.VoltAmpere = _register(Unit.createAlternate("VA", exports.Watt), "VA");
// Energy
exports.NewtonMeter = _register(UnitTimes.forceByLength(exports.Newton, exports.Meter), "Nm");
exports.Kilojoule = _register(Kilo(exports.Joule), "kJ");
exports.KiloWattHour = _register(UnitTimes.powerByDuration(exports.KiloWatt, exports.Hour), "kWh");
exports.MegaWattHour = _register(UnitTimes.powerByDuration(exports.MegaWatt, exports.Hour), "MWh");
exports.GigaWattHour = _register(UnitTimes.powerByDuration(exports.GigaWatt, exports.Hour), "GWh");
exports.WattHour = _register(UnitTimes.powerByDuration(exports.Watt, exports.Hour), "Wh");
exports.WattSecond = _register(UnitTimes.powerByDuration(exports.Watt, exports.Second), "Ws");
exports.Btu = _register(Unit.timesNumber((52752792631.0 / 50000000.0), exports.Joule), "BTU");
/// http://www.wolframalpha.com/input/?i=BTU and select 'Show exact conversions'
// Per Energy
exports.OnePerKiloWattHour = _register(UnitDivide.dimensionlessByEnergy(exports.One, exports.KiloWattHour), "/kWh");
exports.OnePerBtu = _register(UnitDivide.dimensionlessByEnergy(exports.One, exports.Btu), "/BTU");
exports.OnePerKilojoule = _register(UnitDivide.dimensionlessByEnergy(exports.One, exports.Kilojoule), "/kJ");
exports.OnePerJoule = _register(UnitDivide.dimensionlessByEnergy(exports.One, exports.Joule), "/J");
// Emission
exports.KilogramPerKiloWattHour = _register(UnitDivide.massByEnergy(exports.Kilogram, exports.KiloWattHour), "kg/kWh");
exports.GramPerKiloWattHour = _register(UnitDivide.massByEnergy(exports.Gram, exports.KiloWattHour), "g/kWh");
// MassFlow
exports.KilogramPerSecond = _register(UnitDivide.massByDuration(exports.Kilogram, exports.Second), "kg/s");
exports.GramPerSecond = _register(UnitDivide.massByDuration(exports.Gram, exports.Second), "g/s");
exports.KilogramPerHour = _register(UnitDivide.massByDuration(exports.Kilogram, exports.Hour), "kg/h");
exports.SlugPerSecond = _register(UnitDivide.massByDuration(exports.Slug, exports.Second), "slug/s");
exports.SlugPerHour = _register(UnitDivide.massByDuration(exports.Slug, exports.Hour), "slug/h");
exports.PoundLbPerHour = _register(UnitDivide.massByDuration(exports.PoundLb, exports.Hour), "lb/h");
exports.StandardCubicMeterPerHour = _register(Unit.timesNumber(1.2041, exports.KilogramPerHour), "Sm³/h");
exports.StandardCubicFeetPerMinute = _register(Unit.timesNumber(0.02831684660923049289319782819867, Unit.timesNumber(60.0, exports.StandardCubicMeterPerHour)), "SCFM");
// VolumeFlow
exports.CubicMeterPerSecond = _register(UnitDivide.volumeByDuration(exports.CubicMeter, exports.Second), "m³/s");
exports.CubicMeterPerHour = _register(UnitDivide.volumeByDuration(exports.CubicMeter, exports.Hour), "m³/h");
exports.CubicFeetPerMinute = _register(UnitDivide.volumeByDuration(exports.CubicFeet, exports.Minute), "acfm");
exports.CubicFeetPerHour = _register(UnitDivide.volumeByDuration(exports.CubicFeet, exports.Hour), "acfh");
exports.HundredCubicFeetPerHour = _register(UnitDivide.volumeByDuration(exports.HundredCubicFeet, exports.Hour), "cch");
exports.LiterPerSecond = _register(UnitDivide.volumeByDuration(exports.Liter, exports.Second), "l/s");
exports.LiterPerMinute = _register(UnitDivide.volumeByDuration(exports.Liter, exports.Minute), "l/m");
exports.LiterPerHour = _register(UnitDivide.volumeByDuration(exports.Liter, exports.Hour), "l/h");
exports.GallonsPerMinute = _register(UnitDivide.volumeByDuration(exports.Gallon, exports.Minute), "gal/min");
exports.GallonsPerHour = _register(UnitDivide.volumeByDuration(exports.Gallon, exports.Hour), "gal/h");
// VolumeFlowPerArea
exports.CubicMeterPerSecondPerSquareMeter = _register(UnitDivide.volumeFlowByArea(exports.CubicMeterPerSecond, exports.SquareMeter), "m³/s/m²");
exports.CubicFeetPerMinutePerSquareFeet = _register(UnitDivide.volumeFlowByArea(exports.CubicFeetPerMinute, exports.SquareFeet), "acfm/ft²");
exports.LiterPerSecondPerSquareMeter = _register(UnitDivide.volumeFlowByArea(exports.LiterPerSecond, exports.SquareMeter), "l/s/m²");
// Per Volume
exports.OnePerLiter = _register(UnitDivide.dimensionlessByVolume(exports.One, exports.Liter), "/l");
exports.OnePerCubicMeter = _register(UnitDivide.dimensionlessByVolume(exports.One, exports.CubicMeter), "/m³");
exports.OnePerGallon = _register(UnitDivide.dimensionlessByVolume(exports.One, exports.Gallon), "/gal");
exports.OnePerHundredCubicFeet = _register(UnitDivide.dimensionlessByVolume(exports.One, exports.HundredCubicFeet), "/100 ft³");
// Per Duration
exports.OnePerHour = _register(UnitDivide.dimensionlessByDuration(exports.One, exports.Hour), "/h");
exports.OnePerSecond = _register(UnitDivide.dimensionlessByDuration(exports.One, exports.Second), "/s");
/// Water use efficiency
exports.LiterPerKiloWattHour = _register(UnitDivide.volumeByEnergy(exports.Liter, exports.KiloWattHour), "l/kWh");
exports.KilogramPerSquareMeterSecond = _register(UnitDivide.massFlowByArea(exports.KilogramPerSecond, exports.SquareMeter), "kg/m²s");
// Humidity
exports.KilogramPerKilogram = _register(UnitDivide.massByMass(exports.Kilogram, exports.Kilogram), "kg/kg");
exports.GramPerKilogram = _register(UnitDivide.massByMass(exports.Gram, exports.Kilogram), "g/kg");
exports.PoundLbPerPoundLb = _register(UnitDivide.massByMass(exports.PoundLb, exports.PoundLb), "lb/lb");
exports.GrainPerPoundLb = _register(UnitDivide.massByMass(exports.Grain, exports.PoundLb), "gr/lb");
// Specific energy
exports.KilojoulePerKilogram = _register(UnitDivide.energyByMass(exports.Kilojoule, exports.Kilogram), "kJ/kg");
exports.KiloWattHourPerKilogram = _register(UnitDivide.energyByMass(exports.KiloWattHour, exports.Kilogram), "kWh/kg");
exports.BtuPerPoundLb = _register(((Unit.minus(7.68, Unit.timesNumber(2.326, exports.KilojoulePerKilogram)))), "BTU/lb");
// Energy per volume
exports.KiloWattHourPerCubicMeter = _register(UnitDivide.energyByVolume(exports.KiloWattHour, exports.CubicMeter), "kWh/m³");
// Specific heat capacity of air at constant pressure (kJ/kg°C, kWs/kgK, Btu/lb°F)
// Heat capacity is the measurable physical quantity that characterizes the amount of heat required to change a body's temperature by a given amount.
// Check if this really is correct
exports.KilojoulePerKilogramKelvin = _register(UnitTimes.specificEnthalpyByTemperature(exports.KilojoulePerKilogram, exports.Kelvin), "kJ/kg°K");
exports.KilojoulePerKilogramCelsius = _register(UnitTimes.specificEnthalpyByTemperature(exports.KilojoulePerKilogram, exports.Celsius), "kJ/kg°C");
// Heat Capacity Rate
exports.KilowattPerCelsius = _register(UnitDivide.powerByTemperature(exports.KiloWatt, exports.Celsius), "kW/°C");
exports.KilowattPerKelvin = _register(UnitDivide.powerByTemperature(exports.KiloWatt, exports.Kelvin), "kW/K");
/// Moment of inertia
exports.KilogramSquareMeter = _register(UnitTimes.massByArea(exports.Kilogram, exports.SquareMeter), "kg·m²");
// Intensity
exports.WattPerSquareMeter = _register(UnitDivide.powerByArea(exports.Watt, exports.SquareMeter), "W/m²");
// Specific Fan Power
exports.KiloWattPerCubicMeterPerSecond = _register(UnitDivide.powerByVolumeFlow(exports.KiloWatt, exports.CubicMeterPerSecond), "kW/m³/s");
exports.WattPerCubicMeterPerSecond = _register(UnitDivide.powerByVolumeFlow(exports.Watt, exports.CubicMeterPerSecond), "W/m³/s");
// Sound pressure level
exports.Decibel = _register(Unit.createAlternate("dB", UnitTimes.dimensionlessByDimensionless(exports.One, exports.One)), "dB");
// Sound power level
exports.DecibelLw = _register(Unit.createAlternate("dB", UnitTimes.dimensionlessByDimensionless(exports.One, exports.One)), "dB");
// Water hardness
exports.MilliGramCalciumPerLiter = _register(Unit.createBase("WaterHardness", "mg Ca²⁺/l"), "mg Ca²⁺/l");
exports.FrenchDegree = _register(Unit.timesNumber(4.0043, exports.MilliGramCalciumPerLiter), "°f");
// ElectricPotential
exports.MilliVolt = _register(Milli(exports.Volt), "mV");
exports.KiloVolt = _register(Kilo(exports.Volt), "kV");
// Discrete
// export const Integer: Unit.Unit<q.Discrete> = _register(Unit.createProductUnit<q.Discrete>("Discrete", []), " ");
exports.Integer = _register(Unit.createBase("Discrete", " "), " ");
// Text
// export const Text: Unit.Unit<q.Text> = _register(Unit.createProductUnit<q.Text>("Text", []), " ");
exports.Text = _register(Unit.createBase("Text", " "), " ");
// Alkalinity
exports.MilliGramHydrogenCarbonatePerLiter = _register(Unit.createBase("Alkalinity", "mg HCO₃⁻/l"), "mg HCO₃⁻/l");
// Viscosity
exports.PascalSecond = _register(Unit.createBase("Viscosity", "Pa·s"));
// Volume flow per cooling power
exports.GallonsPerMinutePerTonCooling = _register(UnitDivide.volumeFlowByPower(exports.GallonsPerMinute, exports.TonCooling), "gpm/ton");
exports.LiterPerSecondPerKiloWatt = _register(UnitDivide.volumeFlowByPower(exports.LiterPerSecond, exports.KiloWatt), "l/s/kW");
function isUnit(unit) {
    _ensureMetaAdded();
    return _stringToUnit.hasOwnProperty(unit.trim().toLowerCase());
}
exports.isUnit = isUnit;
function getUnitFromString(unitString, onError) {
    _ensureMetaAdded();
    var unit = _stringToUnit[unitString.trim().toLowerCase()];
    if (unit === undefined) {
        if (onError == null)
            throw new Error("Unknown unit " + unitString);
        else
            return onError(unitString);
    }
    return unit;
}
exports.getUnitFromString = getUnitFromString;
function getStringFromUnit(unit) {
    _ensureMetaAdded();
    var name = _unitToString[JSON.stringify(unit)];
    if (name === undefined)
        throw new Error("Unknown Unit " + unit);
    return name;
}
exports.getStringFromUnit = getStringFromUnit;
function getQuantityTypeFromString(quantityString, onError) {
    _ensureMetaAdded();
    var quantityArray = Object.keys(_quantityToUnits);
    var foundIndex = quantityArray.indexOf(quantityString);
    if (foundIndex < 0)
        throw new Error("Unknown quantity '" + quantityString + "'");
    return quantityString;
}
exports.getQuantityTypeFromString = getQuantityTypeFromString;
function getStringFromQuantityType(quantity) {
    return quantity;
}
exports.getStringFromQuantityType = getStringFromQuantityType;
function getUnitsForQuantity(quantityType) {
    _ensureMetaAdded();
    var units = _quantityToUnits[quantityType];
    if (units === undefined)
        throw new Error("Unknown quantity type");
    return units;
}
exports.getUnitsForQuantity = getUnitsForQuantity;
function getAllUnits() {
    _ensureMetaAdded();
    var unitsArray = Object.keys(_stringToUnit).map(function (key) { return _stringToUnit[key]; });
    return unitsArray;
}
exports.getAllUnits = getAllUnits;
function getAllQuantities() {
    _ensureMetaAdded();
    var quantityArray = Object.keys(_quantityToUnits);
    return quantityArray;
}
exports.getAllQuantities = getAllQuantities;
// == BEGIN META: Manually added meta data needed becuase reflection does not work ==
var _metaAdded = false;
function _addMeta(quantity, name, unit) {
    var lowerName = name.toLowerCase();
    _unitToString[JSON.stringify(unit)] = lowerName;
    _stringToUnit[lowerName] = unit;
    var quantityUnits = _quantityToUnits[quantity];
    if (quantityUnits === undefined) {
        quantityUnits = [];
        _quantityToUnits[quantity] = quantityUnits;
    }
    quantityUnits.push(unit);
}
// Since Dart uses lazy init for static member variables, we need to access them all to make them register.
// While accessing them we also register meta-data for them
function _ensureMetaAdded() {
    if (_metaAdded)
        return;
    _addMeta("Dimensionless", "One", exports.One);
    _addMeta("Dimensionless", "Percent", exports.Percent);
    _addMeta("Dimensionless", "PPM", exports.PPM);
    _addMeta("ElectricCurrent", "Ampere", exports.Ampere);
    _addMeta("LuminousIntensity", "Candela", exports.Candela);
    _addMeta("Temperature", "Kelvin", exports.Kelvin);
    _addMeta("Mass", "Kilogram", exports.Kilogram);
    _addMeta("Length", "Meter", exports.Meter);
    _addMeta("AmountOfSubstance", "Mole", exports.Mole);
    _addMeta("Duration", "Second", exports.Second);
    _addMeta("Mass", "Gram", exports.Gram);
    _addMeta("Angle", "Radian", exports.Radian);
    _addMeta("SolidAngle", "Steradian", exports.Steradian);
    _addMeta("DataAmount", "Bit", exports.Bit);
    _addMeta("Frequency", "Hertz", exports.Hertz);
    _addMeta("Force", "Newton", exports.Newton);
    _addMeta("Pressure", "Pascal", exports.Pascal);
    _addMeta("Energy", "Joule", exports.Joule);
    _addMeta("Power", "Watt", exports.Watt);
    _addMeta("ElectricCharge", "Coulomb", exports.Coulomb);
    _addMeta("ElectricPotential", "Volt", exports.Volt);
    _addMeta("ElectricCapacitance", "Farad", exports.Farad);
    _addMeta("ElectricResistance", "Ohm", exports.Ohm);
    _addMeta("ElectricConductance", "Siemens", exports.Siemens);
    _addMeta("MagneticFlux", "Weber", exports.Weber);
    _addMeta("MagneticFluxDensity", "Tesla", exports.Tesla);
    _addMeta("ElectricInductance", "Henry", exports.Henry);
    _addMeta("Temperature", "Celsius", exports.Celsius);
    _addMeta("LuminousFlux", "Lumen", exports.Lumen);
    _addMeta("Illuminance", "Lux", exports.Lux);
    _addMeta("RadioactiveActivity", "Becquerel", exports.Becquerel);
    _addMeta("RadiationDoseAbsorbed", "Gray", exports.Gray);
    _addMeta("RadiationDoseEffective", "Sievert", exports.Sievert);
    _addMeta("CatalyticActivity", "Katal", exports.Katal);
    _addMeta("Velocity", "MeterPerSecond", exports.MeterPerSecond);
    _addMeta("Acceleration", "MeterPerSquareSecond", exports.MeterPerSquareSecond);
    _addMeta("Area", "SquareMeter", exports.SquareMeter);
    _addMeta("Volume", "CubicMeter", exports.CubicMeter);
    _addMeta("Length", "Kilometer", exports.Kilometer);
    _addMeta("Length", "CentiMeter", exports.CentiMeter);
    _addMeta("Length", "Millimeter", exports.Millimeter);
    _addMeta("RelativeHumidity", "HumidityFactor", exports.HumidityFactor);
    _addMeta("RelativeHumidity", "PercentHumidity", exports.PercentHumidity);
    _addMeta("WetTemperature", "CelsiusWet", exports.CelsiusWet);
    _addMeta("WetTemperature", "FahrenheitWet", exports.FahrenheitWet);
    _addMeta("WetTemperature", "KelvinWet", exports.KelvinWet);
    _addMeta("DewPointTemperature", "CelsiusDewPoint", exports.CelsiusDewPoint);
    _addMeta("DewPointTemperature", "FahrenheitDewPoint", exports.FahrenheitDewPoint);
    _addMeta("DewPointTemperature", "KelvinDewPoint", exports.KelvinDewPoint);
    _addMeta("Mass", "PoundLb", exports.PoundLb);
    _addMeta("Mass", "Grain", exports.Grain);
    _addMeta("Mass", "Slug", exports.Slug);
    _addMeta("Mass", "Tonne", exports.Tonne);
    _addMeta("Mass", "MilliGram", exports.MilliGram);
    _addMeta("DimensionlessPerMass", "OnePerKilogram", exports.OnePerKilogram);
    _addMeta("DimensionlessPerMass", "OnePerPoundLb", exports.OnePerPoundLb);
    _addMeta("Length", "Foot", exports.Foot);
    _addMeta("Length", "Yard", exports.Yard);
    _addMeta("Length", "Inch", exports.Inch);
    _addMeta("Length", "Mile", exports.Mile);
    _addMeta("Length", "Decimeter", exports.Decimeter);
    _addMeta("Temperature", "Rankine", exports.Rankine);
    _addMeta("Temperature", "Fahrenheit", exports.Fahrenheit);
    _addMeta("DeltaTemperature", "DeltaCelsius", exports.DeltaCelsius);
    _addMeta("DeltaTemperature", "DeltaFahrenheit", exports.DeltaFahrenheit);
    _addMeta("Duration", "Minute", exports.Minute);
    _addMeta("Duration", "Hour", exports.Hour);
    _addMeta("Duration", "Day", exports.Day);
    _addMeta("Duration", "Week", exports.Week);
    _addMeta("Duration", "Year", exports.Year);
    _addMeta("Frequency", "RevolutionsPerMinute", exports.RevolutionsPerMinute);
    _addMeta("Frequency", "RevolutionsPerHour", exports.RevolutionsPerHour);
    _addMeta("Area", "SquareInch", exports.SquareInch);
    _addMeta("Area", "SquareFeet", exports.SquareFeet);
    _addMeta("Area", "SquareMillimeter", exports.SquareMillimeter);
    _addMeta("Area", "SquareCentimeter", exports.SquareCentimeter);
    _addMeta("Area", "SquareDecimeter", exports.SquareDecimeter);
    _addMeta("Angle", "Degrees", exports.Degrees);
    _addMeta("Volume", "CubicCentiMeter", exports.CubicCentiMeter);
    _addMeta("Volume", "CubicFeet", exports.CubicFeet);
    _addMeta("Volume", "HundredCubicFeet", exports.HundredCubicFeet);
    _addMeta("Volume", "Liter", exports.Liter);
    _addMeta("Volume", "MilliLiter", exports.MilliLiter);
    _addMeta("Volume", "Gallon", exports.Gallon);
    _addMeta("Velocity", "FeetPerSecond", exports.FeetPerSecond);
    _addMeta("Velocity", "FeetPerMinute", exports.FeetPerMinute);
    _addMeta("Velocity", "KilometerPerHour", exports.KilometerPerHour);
    _addMeta("Velocity", "MeterPerHour", exports.MeterPerHour);
    _addMeta("Density", "KilogramPerCubicMeter", exports.KilogramPerCubicMeter);
    _addMeta("Density", "GramPerCubicCentiMeter", exports.GramPerCubicCentiMeter);
    _addMeta("Density", "SlugPerCubicFeet", exports.SlugPerCubicFeet);
    _addMeta("Force", "PoundForce", exports.PoundForce);
    _addMeta("Pressure", "KiloPascal", exports.KiloPascal);
    _addMeta("Pressure", "HectoPascal", exports.HectoPascal);
    _addMeta("Pressure", "NewtonPerSquareMeter", exports.NewtonPerSquareMeter);
    _addMeta("Pressure", "PoundForcePerSquareInch", exports.PoundForcePerSquareInch);
    _addMeta("Pressure", "InchOfMercury", exports.InchOfMercury);
    _addMeta("Pressure", "InchOfWaterColumn", exports.InchOfWaterColumn);
    _addMeta("Pressure", "FeetOfWaterColumn", exports.FeetOfWaterColumn);
    _addMeta("Pressure", "Bar", exports.Bar);
    _addMeta("Pressure", "MilliBar", exports.MilliBar);
    _addMeta("Power", "KiloWatt", exports.KiloWatt);
    _addMeta("Power", "MegaWatt", exports.MegaWatt);
    _addMeta("Power", "GigaWatt", exports.GigaWatt);
    _addMeta("Power", "BtuPerHour", exports.BtuPerHour);
    _addMeta("Power", "TonCooling", exports.TonCooling);
    _addMeta("Power", "KiloBtuPerHour", exports.KiloBtuPerHour);
    _addMeta("Power", "HorsePower", exports.HorsePower);
    _addMeta("Power", "VoltAmpere", exports.VoltAmpere);
    _addMeta("Energy", "NewtonMeter", exports.NewtonMeter);
    _addMeta("Energy", "Kilojoule", exports.Kilojoule);
    _addMeta("Energy", "KiloWattHour", exports.KiloWattHour);
    _addMeta("Energy", "MegaWattHour", exports.MegaWattHour);
    _addMeta("Energy", "GigaWattHour", exports.GigaWattHour);
    _addMeta("Energy", "WattHour", exports.WattHour);
    _addMeta("Energy", "WattSecond", exports.WattSecond);
    _addMeta("Energy", "Btu", exports.Btu);
    _addMeta("DimensionlessPerEnergy", "OnePerKiloWattHour", exports.OnePerKiloWattHour);
    _addMeta("DimensionlessPerEnergy", "OnePerBtu", exports.OnePerBtu);
    _addMeta("DimensionlessPerEnergy", "OnePerKilojoule", exports.OnePerKilojoule);
    _addMeta("DimensionlessPerEnergy", "OnePerJoule", exports.OnePerJoule);
    _addMeta("Emission", "KilogramPerKiloWattHour", exports.KilogramPerKiloWattHour);
    _addMeta("Emission", "GramPerKiloWattHour", exports.GramPerKiloWattHour);
    _addMeta("MassFlow", "KilogramPerSecond", exports.KilogramPerSecond);
    _addMeta("MassFlow", "GramPerSecond", exports.GramPerSecond);
    _addMeta("MassFlow", "KilogramPerHour", exports.KilogramPerHour);
    _addMeta("MassFlow", "SlugPerSecond", exports.SlugPerSecond);
    _addMeta("MassFlow", "SlugPerHour", exports.SlugPerHour);
    _addMeta("MassFlow", "PoundLbPerHour", exports.PoundLbPerHour);
    _addMeta("MassFlow", "StandardCubicMeterPerHour", exports.StandardCubicMeterPerHour);
    _addMeta("MassFlow", "StandardCubicFeetPerMinute", exports.StandardCubicFeetPerMinute);
    _addMeta("VolumeFlow", "CubicMeterPerSecond", exports.CubicMeterPerSecond);
    _addMeta("VolumeFlow", "CubicMeterPerHour", exports.CubicMeterPerHour);
    _addMeta("VolumeFlow", "CubicFeetPerMinute", exports.CubicFeetPerMinute);
    _addMeta("VolumeFlow", "CubicFeetPerHour", exports.CubicFeetPerHour);
    _addMeta("VolumeFlow", "HundredCubicFeetPerHour", exports.HundredCubicFeetPerHour);
    _addMeta("VolumeFlow", "LiterPerSecond", exports.LiterPerSecond);
    _addMeta("VolumeFlow", "LiterPerMinute", exports.LiterPerMinute);
    _addMeta("VolumeFlow", "LiterPerHour", exports.LiterPerHour);
    _addMeta("VolumeFlow", "GallonsPerMinute", exports.GallonsPerMinute);
    _addMeta("VolumeFlow", "GallonsPerHour", exports.GallonsPerHour);
    _addMeta("DimensionlessPerVolume", "OnePerLiter", exports.OnePerLiter);
    _addMeta("DimensionlessPerVolume", "OnePerCubicMeter", exports.OnePerCubicMeter);
    _addMeta("DimensionlessPerVolume", "OnePerGallon", exports.OnePerGallon);
    _addMeta("DimensionlessPerVolume", "OnePerHundredCubicFeet", exports.OnePerHundredCubicFeet);
    _addMeta("DimensionlessPerDuration", "OnePerHour", exports.OnePerHour);
    _addMeta("DimensionlessPerDuration", "OnePerSecond", exports.OnePerSecond);
    _addMeta("WaterUseEfficiency", "LiterPerKiloWattHour", exports.LiterPerKiloWattHour);
    _addMeta("MassFlowPerArea", "KilogramPerSquareMeterSecond", exports.KilogramPerSquareMeterSecond);
    _addMeta("HumidityRatio", "KilogramPerKilogram", exports.KilogramPerKilogram);
    _addMeta("HumidityRatio", "GramPerKilogram", exports.GramPerKilogram);
    _addMeta("HumidityRatio", "PoundLbPerPoundLb", exports.PoundLbPerPoundLb);
    _addMeta("HumidityRatio", "GrainPerPoundLb", exports.GrainPerPoundLb);
    _addMeta("SpecificEnthalpy", "KilojoulePerKilogram", exports.KilojoulePerKilogram);
    _addMeta("SpecificEnthalpy", "KiloWattHourPerKilogram", exports.KiloWattHourPerKilogram);
    _addMeta("SpecificEnthalpy", "BtuPerPoundLb", exports.BtuPerPoundLb);
    _addMeta("HeatingValue", "KiloWattHourPerCubicMeter", exports.KiloWattHourPerCubicMeter);
    _addMeta("SpecificHeatCapacity", "KilojoulePerKilogramKelvin", exports.KilojoulePerKilogramKelvin);
    _addMeta("SpecificHeatCapacity", "KilojoulePerKilogramCelsius", exports.KilojoulePerKilogramCelsius);
    _addMeta("HeatCapacityRate", "KilowattPerCelsius", exports.KilowattPerCelsius);
    _addMeta("HeatCapacityRate", "KilowattPerKelvin", exports.KilowattPerKelvin);
    _addMeta("MomentOfInertia", "KilogramSquareMeter", exports.KilogramSquareMeter);
    _addMeta("Intensity", "WattPerSquareMeter", exports.WattPerSquareMeter);
    _addMeta("SpecificFanPower", "KiloWattPerCubicMeterPerSecond", exports.KiloWattPerCubicMeterPerSecond);
    _addMeta("SpecificFanPower", "WattPerCubicMeterPerSecond", exports.WattPerCubicMeterPerSecond);
    _addMeta("SoundPressureLevel", "Decibel", exports.Decibel);
    _addMeta("SoundPowerLevel", "DecibelLw", exports.DecibelLw);
    _addMeta("WaterHardness", "MilliGramCalciumPerLiter", exports.MilliGramCalciumPerLiter);
    _addMeta("WaterHardness", "FrenchDegree", exports.FrenchDegree);
    _addMeta("ElectricPotential", "MilliVolt", exports.MilliVolt);
    _addMeta("ElectricPotential", "KiloVolt", exports.KiloVolt);
    _addMeta("Discrete", "Integer", exports.Integer);
    _addMeta("Text", "Text", exports.Text);
    _addMeta("Alkalinity", "MilliGramHydrogenCarbonatePerLiter", exports.MilliGramHydrogenCarbonatePerLiter);
    _addMeta("Viscosity", "PascalSecond", exports.PascalSecond);
    _addMeta("VolumeFlowPerPower", "GallonsPerMinutePerTonCooling", exports.GallonsPerMinutePerTonCooling);
    _addMeta("VolumeFlowPerPower", "LiterPerSecondPerKiloWatt", exports.LiterPerSecondPerKiloWatt);
    _addMeta("VolumeFlowPerPower", "CubicFeetPerMinutePerSquareFeet", exports.CubicFeetPerMinutePerSquareFeet);
    _addMeta("VolumeFlowPerPower", "CubicMeterPerSecondPerSquareMeter", exports.CubicMeterPerSecondPerSquareMeter);
    _addMeta("VolumeFlowPerPower", "LiterPerSecondPerSquareMeter", exports.LiterPerSecondPerSquareMeter);
    _addMeta("VolumeFlowPerArea", "CubicMeterPerSecondPerSquareMeter", exports.CubicMeterPerSecondPerSquareMeter);
    _addMeta("VolumeFlowPerArea", "CubicFeetPerMinutePerSquareFeet", exports.CubicFeetPerMinutePerSquareFeet);
    _addMeta("VolumeFlowPerArea", "LiterPerSecondPerSquareMeter", exports.LiterPerSecondPerSquareMeter);
    _metaAdded = true;
}
//# sourceMappingURL=units.js.map