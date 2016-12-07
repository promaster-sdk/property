import * as Unit from "./unit";
import * as q from "./quantity";
import { Quantity } from "./quantity";
export declare const One: Unit.Unit<q.Dimensionless>;
export declare const Percent: Unit.Unit<q.Dimensionless>;
export declare const PPM: Unit.Unit<q.Dimensionless>;
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
export declare const Ampere: Unit.Unit<q.ElectricCurrent>;
/**
 * The base unit for luminous intensity quantities ( <code>cd</code> ).
 * The candela is the luminous intensity, in a given direction, of a source
 * that emits monochromatic radiation of frequency 540 × 1012 hertz and that
 * has a radiant intensity in that direction of 1/683 watt per steradian.
 * @see <a href="http://en.wikipedia.org/wiki/Candela">Wikipedia: Candela</a>
 */
export declare const Candela: Unit.Unit<q.LuminousIntensity>;
/**
 * The base unit for thermodynamic temperature quantities ( <code>K</code> ).
 * The kelvin is the 1/273.16th of the thermodynamic temperature of the triple point of water.
 * It is named after the Scottish mathematician and physicist William Thomson 1st Lord Kelvin (1824-1907).
 */
export declare const Kelvin: Unit.Unit<q.Temperature>;
/**
 * The base unit for mass quantities ( <code>kg</code> ).
 * It is the only SI unit with a prefix as part of its name and symbol.
 * The kilogram is equal to the mass of an international prototype in the form
 * of a platinum-iridium cylinder kept at Sevres in France.
 * @see #Gram
 */
export declare const Kilogram: Unit.Unit<q.Mass>;
/**
 * The base unit for length quantities ( <code>m</code> ).
 * One meter was redefined in 1983 as the distance traveled by light in a vacuum in 1/299,792,458 of a second.
 */
export declare const Meter: Unit.Unit<q.Length>;
/**
 * The base unit for amount of substance quantities ( <code>mol</code> ).
 * The mole is the amount of substance of a system which contains as many elementary
 * entities as there are atoms in 0.012 kilogram of carbon 12.
 */
export declare const Mole: Unit.Unit<q.AmountOfSubstance>;
/**
 * The base unit for duration quantities ( <code>s</code> ). It is defined as the duration of 9,192,631,770 cycles of radiation corresponding to the transition between two hyperfine levels of the ground state of cesium (1967 Standard).
 */
export declare const Second: Unit.Unit<q.Duration>;
/** The metric unit for velocity quantities ( <code>m/s</code> ). */
export declare const MeterPerSecond: Unit.Unit<q.Velocity>;
/** The metric unit for acceleration quantities ( <code>m/s²</code> ). */
export declare const MeterPerSquareSecond: Unit.Unit<q.Acceleration>;
/** The metric unit for area quantities ( <code>m²</code> ). */
export declare const SquareMeter: Unit.Unit<q.Area>;
/** The metric unit for volume quantities ( <code>m³</code> ). */
export declare const CubicMeter: Unit.Unit<q.Volume>;
/** Equivalent to <code>KILO(METER)</code>. */
export declare const Kilometer: Unit.Unit<q.Length>;
/** Equivalent to <code>CENTI(METRE)</code>. */
export declare const CentiMeter: Unit.Unit<q.Length>;
/** Equivalent to <code>MILLI(METRE)</code>. */
export declare const Millimeter: Unit.Unit<q.Length>;
/**
 * AlternateUnits seems to be units with names like "Newton", "Celsius" while
 * ProductUnits seem to be units with names like "MeterPerSecond"
 */
/** The derived unit for mass quantities ( <code>g</code> ).
 * The base unit for mass quantity is {@link #Kilogram}. */
export declare const Gram: Unit.Unit<q.Mass>;
/**
 * The unit for plane angle quantities ( <code>rad</code> ).
 * One radian is the angle between two radii of a circle such that the length of the arc between them is equal to the radius.
 */
export declare const Radian: Unit.Unit<q.Angle>;
/**
 * The unit for solid angle quantities ( <code>sr</code> ).
 * One steradian is the solid angle subtended at the center of a sphere by an area on the
 * surface of the sphere that is equal to the radius squared. The total solid angle of a sphere is 4*Pi steradians.
 */
export declare const Steradian: Unit.Unit<q.SolidAngle>;
/**
 * The unit for binary information ( <code>bit</code> ).
 */
export declare const Bit: Unit.Unit<q.DataAmount>;
/**
 * The derived unit for frequency ( <code>Hz</code> ).
 * A unit of frequency equal to one cycle per second. After Heinrich Rudolf Hertz (1857-1894),
 * German physicist who was the first to produce radio waves artificially.
 */
export declare const Hertz: Unit.Unit<q.Frequency>;
/**
 * The derived unit for force ( <code>N</code> ).
 * One newton is the force required to give a mass of 1 kilogram an Force of 1 metre per second per second.
 * It is named after the English mathematician and physicist Sir Isaac Newton (1642-1727).
 */
export declare const Newton: Unit.Unit<q.Force>;
/**
 * The derived unit for pressure, stress ( <code>Pa</code> ).
 * One pascal is equal to one newton per square meter.
 * It is named after the French philosopher and mathematician Blaise Pascal (1623-1662).
 */
export declare const Pascal: Unit.Unit<q.Pressure>;
/**
 * The derived unit for energy, work, quantity of heat ( <code>J</code> ).
 * One joule is the amount of work done when an applied force of 1 newton moves
 * through a distance of 1 metre in the direction of the force.
 * It is named after the English physicist James Prescott Joule (1818-1889).
 */
export declare const Joule: Unit.Unit<q.Energy>;
/**
 * The derived unit for power, radiant, flux ( <code>W</code> ).
 * One watt is equal to one joule per second.
 * It is named after the British scientist James Watt (1736-1819).
 */
export declare const Watt: Unit.Unit<q.Power>;
/**
 * The derived unit for electric charge, quantity of electricity ( <code>C</code> ).
 * One Coulomb is equal to the quantity of charge transferred in one second by a steady current of one ampere.
 * It is named after the French physicist Charles Augustin de Coulomb (1736-1806).
 */
export declare const Coulomb: Unit.Unit<q.ElectricCharge>;
/**
 * The derived unit for electric potential difference, electromotive force ( <code>V</code> ).
 * One Volt is equal to the difference of electric potential between two points on a conducting
 * wire carrying a export constant current of one ampere when the power dissipated between the points is one watt.
 * It is named after the Italian physicist Count Alessandro Volta (1745-1827).
 */
export declare const Volt: Unit.Unit<q.ElectricPotential>;
/**
 * The derived unit for capacitance ( <code>F</code> ).
 * One Farad is equal to the capacitance of a capacitor having an equal and opposite charge of 1 coulomb on
 * each plate and a potential difference of 1 volt between the plates.
 * It is named after the British physicist and chemist Michael Faraday (1791-1867).
 */
export declare const Farad: Unit.Unit<q.ElectricCapacitance>;
/**
 * The derived unit for electric resistance ( <code>Ω</code> or <code>Ohm</code> ).
 * One Ohm is equal to the resistance of a conductor in which a current of one ampere is produced
 * by a potential of one volt across its terminals.
 * It is named after the German physicist Georg Simon Ohm (1789-1854).
 */
export declare const Ohm: Unit.Unit<q.ElectricResistance>;
/**
 * The derived unit for electric conductance ( <code>S</code> ).
 * One Siemens is equal to one ampere per volt.
 * It is named after the German engineer Ernst Werner von Siemens (1816-1892).
 */
export declare const Siemens: Unit.Unit<q.ElectricConductance>;
/**
 * The derived unit for magnetic flux ( <code>Wb</code> ).
 * One Weber is equal to the magnetic flux that in linking a circuit of one turn produces in it an
 * electromotive force of one volt as it is uniformly reduced to zero within one second.
 * It is named after the German physicist Wilhelm Eduard Weber (1804-1891).
 */
export declare const Weber: Unit.Unit<q.MagneticFlux>;
/**
 * The derived unit for magnetic flux density ( <code>T</code> ).
 * One Tesla is equal equal to one weber per square meter.
 * It is named after the Serbian-born American electrical engineer and physicist Nikola Tesla (1856-1943).
 */
export declare const Tesla: Unit.Unit<q.MagneticFluxDensity>;
/**
 * The derived unit for inductance ( <code>H</code> ).
 * One Henry is equal to the inductance for which an induced electromotive force of one volt is produced
 * when the current is varied at the rate of one ampere per second.
 * It is named after the American physicist Joseph Henry (1791-1878).
 */
export declare const Henry: Unit.Unit<q.ElectricInductance>;
/**
 * The derived unit for Celsius temperature ( <code>℃</code> ).
 * This is a unit of temperature such as the freezing point of water (at one atmosphere of pressure)
 * is 0 ℃, while the boiling point is 100 ℃.
 */
export declare const Celsius: Unit.Unit<q.Temperature>;
/**
 * The derived unit for luminous flux ( <code>lm</code> ).
 * One Lumen is equal to the amount of light given out through a solid angle by a source of one
 * candela intensity radiating equally in all directions.
 */
export declare const Lumen: Unit.Unit<q.LuminousFlux>;
/**
 * The derived unit for illuminance ( <code>lx</code> ).
 * One Lux is equal to one lumen per square meter.
 */
export declare const Lux: Unit.Unit<q.Illuminance>;
/**
 * The derived unit for activity of a radionuclide ( <code>Bq</code> ).
 * One becquerel is the radiation caused by one disintegration per second.
 * It is named after the French physicist, Antoine-Henri Becquerel (1852-1908).
 */
export declare const Becquerel: Unit.Unit<q.RadioactiveActivity>;
/**
 * The derived unit for absorbed dose, specific energy (imparted), kerma ( <code>Gy</code> ).
 * One gray is equal to the dose of one joule of energy absorbed per one kilogram of matter.
 * It is named after the British physician L. H. Gray (1905-1965).
 */
export declare const Gray: Unit.Unit<q.RadiationDoseAbsorbed>;
/**
 * The derived unit for dose equivalent ( <code>Sv</code> ).
 * One Sievert is equal is equal to the actual dose, in grays, multiplied by a "quality factor" which is
 * larger for more dangerous forms of radiation.
 * It is named after the Swedish physicist Rolf Sievert (1898-1966).
 */
export declare const Sievert: Unit.Unit<q.RadiationDoseEffective>;
/**
 * The derived unit for catalytic activity ( <code>kat</code> ).
 */
export declare const Katal: Unit.Unit<q.CatalyticActivity>;
export declare const HumidityFactor: Unit.Unit<q.RelativeHumidity>;
/** Factor of humidity, eg., 0.01 means 1% */
export declare const PercentHumidity: Unit.Unit<q.RelativeHumidity>;
/** Percent of humidity, eg., 10.0 means 10% */
export declare const CelsiusWet: Unit.Unit<q.WetTemperature>;
export declare const FahrenheitWet: Unit.Unit<q.WetTemperature>;
export declare const KelvinWet: Unit.Unit<q.WetTemperature>;
export declare const CelsiusDewPoint: Unit.Unit<q.DewPointTemperature>;
export declare const FahrenheitDewPoint: Unit.Unit<q.DewPointTemperature>;
export declare const KelvinDewPoint: Unit.Unit<q.DewPointTemperature>;
export declare const PoundLb: Unit.Unit<q.Mass>;
export declare const Grain: Unit.Unit<q.Mass>;
export declare const Slug: Unit.Unit<q.Mass>;
export declare const Tonne: Unit.Unit<q.Mass>;
export declare const MilliGram: Unit.Unit<q.Mass>;
export declare const OnePerKilogram: Unit.Unit<q.DimensionlessPerMass>;
export declare const OnePerPoundLb: Unit.Unit<q.DimensionlessPerMass>;
export declare const Foot: Unit.Unit<q.Length>;
export declare const Yard: Unit.Unit<q.Length>;
export declare const Inch: Unit.Unit<q.Length>;
export declare const Mile: Unit.Unit<q.Length>;
export declare const Decimeter: Unit.Unit<q.Length>;
export declare const Rankine: Unit.Unit<q.Temperature>;
export declare const Fahrenheit: Unit.Unit<q.Temperature>;
export declare const DeltaCelsius: Unit.Unit<q.DeltaTemperature>;
export declare const DeltaFahrenheit: Unit.Unit<q.DeltaTemperature>;
export declare const Minute: Unit.Unit<q.Duration>;
export declare const Hour: Unit.Unit<q.Duration>;
export declare const Day: Unit.Unit<q.Duration>;
export declare const Week: Unit.Unit<q.Duration>;
export declare const Year: Unit.Unit<q.Duration>;
export declare const RevolutionsPerMinute: Unit.Unit<q.Frequency>;
export declare const RevolutionsPerHour: Unit.Unit<q.Frequency>;
export declare const SquareInch: Unit.Unit<q.Area>;
export declare const SquareFeet: Unit.Unit<q.Area>;
export declare const SquareMillimeter: Unit.Unit<q.Area>;
export declare const SquareCentimeter: Unit.Unit<q.Area>;
export declare const SquareDecimeter: Unit.Unit<q.Area>;
export declare const Degrees: Unit.Unit<q.Angle>;
export declare const CubicCentiMeter: Unit.Unit<q.Volume>;
export declare const CubicFeet: Unit.Unit<q.Volume>;
export declare const HundredCubicFeet: Unit.Unit<q.Volume>;
export declare const Liter: Unit.Unit<q.Volume>;
export declare const MilliLiter: Unit.Unit<q.Volume>;
export declare const Gallon: Unit.Unit<q.Volume>;
export declare const FeetPerSecond: Unit.Unit<q.Velocity>;
export declare const FeetPerMinute: Unit.Unit<q.Velocity>;
export declare const MilesPerHour: Unit.Unit<q.Velocity>;
export declare const KilometerPerHour: Unit.Unit<q.Velocity>;
export declare const MeterPerHour: Unit.Unit<q.Velocity>;
export declare const KilogramPerCubicMeter: Unit.Unit<q.Density>;
export declare const GramPerCubicCentiMeter: Unit.Unit<q.Density>;
export declare const SlugPerCubicFeet: Unit.Unit<q.Density>;
export declare const PoundForce: Unit.Unit<q.Force>;
export declare const KiloPascal: Unit.Unit<q.Pressure>;
export declare const HectoPascal: Unit.Unit<q.Pressure>;
export declare const NewtonPerSquareMeter: Unit.Unit<q.Pressure>;
export declare const PoundForcePerSquareInch: Unit.Unit<q.Pressure>;
export declare const InchOfMercury: Unit.Unit<q.Pressure>;
export declare const InchOfWaterColumn: Unit.Unit<q.Pressure>;
export declare const FeetOfWaterColumn: Unit.Unit<q.Pressure>;
export declare const Bar: Unit.Unit<q.Pressure>;
export declare const MilliBar: Unit.Unit<q.Pressure>;
export declare const KiloWatt: Unit.Unit<q.Power>;
export declare const MegaWatt: Unit.Unit<q.Power>;
export declare const GigaWatt: Unit.Unit<q.Power>;
export declare const BtuPerHour: Unit.Unit<q.Power>;
export declare const TonCooling: Unit.Unit<q.Power>;
export declare const KiloBtuPerHour: Unit.Unit<q.Power>;
export declare const HorsePower: Unit.Unit<q.Power>;
export declare const VoltAmpere: Unit.Unit<q.Power>;
export declare const NewtonMeter: Unit.Unit<q.Energy>;
export declare const Kilojoule: Unit.Unit<q.Energy>;
export declare const KiloWattHour: Unit.Unit<q.Energy>;
export declare const MegaWattHour: Unit.Unit<q.Energy>;
export declare const GigaWattHour: Unit.Unit<q.Energy>;
export declare const WattHour: Unit.Unit<q.Energy>;
export declare const WattSecond: Unit.Unit<q.Energy>;
export declare const Btu: Unit.Unit<q.Energy>;
export declare const OnePerKiloWattHour: Unit.Unit<q.DimensionlessPerEnergy>;
export declare const OnePerBtu: Unit.Unit<q.DimensionlessPerEnergy>;
export declare const OnePerKilojoule: Unit.Unit<q.DimensionlessPerEnergy>;
export declare const OnePerJoule: Unit.Unit<q.DimensionlessPerEnergy>;
export declare const KilogramPerKiloWattHour: Unit.Unit<q.Emission>;
export declare const GramPerKiloWattHour: Unit.Unit<q.Emission>;
export declare const KilogramPerSecond: Unit.Unit<q.MassFlow>;
export declare const GramPerSecond: Unit.Unit<q.MassFlow>;
export declare const KilogramPerHour: Unit.Unit<q.MassFlow>;
export declare const SlugPerSecond: Unit.Unit<q.MassFlow>;
export declare const SlugPerHour: Unit.Unit<q.MassFlow>;
export declare const PoundLbPerHour: Unit.Unit<q.MassFlow>;
export declare const StandardCubicMeterPerHour: Unit.Unit<q.MassFlow>;
export declare const StandardCubicFeetPerMinute: Unit.Unit<q.MassFlow>;
export declare const CubicMeterPerSecond: Unit.Unit<q.VolumeFlow>;
export declare const CubicMeterPerHour: Unit.Unit<q.VolumeFlow>;
export declare const CubicFeetPerMinute: Unit.Unit<q.VolumeFlow>;
export declare const CubicFeetPerHour: Unit.Unit<q.VolumeFlow>;
export declare const HundredCubicFeetPerHour: Unit.Unit<q.VolumeFlow>;
export declare const LiterPerSecond: Unit.Unit<q.VolumeFlow>;
export declare const LiterPerMinute: Unit.Unit<q.VolumeFlow>;
export declare const LiterPerHour: Unit.Unit<q.VolumeFlow>;
export declare const GallonsPerMinute: Unit.Unit<q.VolumeFlow>;
export declare const GallonsPerHour: Unit.Unit<q.VolumeFlow>;
export declare const CubicMeterPerSecondPerSquareMeter: Unit.Unit<q.VolumeFlowPerArea>;
export declare const CubicFeetPerMinutePerSquareFeet: Unit.Unit<q.VolumeFlowPerArea>;
export declare const LiterPerSecondPerSquareMeter: Unit.Unit<q.VolumeFlowPerArea>;
export declare const OnePerLiter: Unit.Unit<q.DimensionlessPerVolume>;
export declare const OnePerCubicMeter: Unit.Unit<q.DimensionlessPerVolume>;
export declare const OnePerGallon: Unit.Unit<q.DimensionlessPerVolume>;
export declare const OnePerHundredCubicFeet: Unit.Unit<q.DimensionlessPerVolume>;
export declare const OnePerHour: Unit.Unit<q.DimensionlessPerDuration>;
export declare const OnePerSecond: Unit.Unit<q.DimensionlessPerDuration>;
export declare const LiterPerKiloWattHour: Unit.Unit<q.WaterUseEfficiency>;
export declare const KilogramPerSquareMeterSecond: Unit.Unit<q.MassFlowPerArea>;
export declare const KilogramPerKilogram: Unit.Unit<q.HumidityRatio>;
export declare const GramPerKilogram: Unit.Unit<q.HumidityRatio>;
export declare const PoundLbPerPoundLb: Unit.Unit<q.HumidityRatio>;
export declare const GrainPerPoundLb: Unit.Unit<q.HumidityRatio>;
export declare const KilojoulePerKilogram: Unit.Unit<q.SpecificEnthalpy>;
export declare const KiloWattHourPerKilogram: Unit.Unit<q.SpecificEnthalpy>;
export declare const BtuPerPoundLb: Unit.Unit<q.SpecificEnthalpy>;
export declare const KiloWattHourPerCubicMeter: Unit.Unit<q.HeatingValue>;
export declare const KilojoulePerKilogramKelvin: Unit.Unit<q.SpecificHeatCapacity>;
export declare const KilojoulePerKilogramCelsius: Unit.Unit<q.SpecificHeatCapacity>;
export declare const KilowattPerCelsius: Unit.Unit<q.HeatCapacityRate>;
export declare const KilowattPerKelvin: Unit.Unit<q.HeatCapacityRate>;
export declare const KilogramSquareMeter: Unit.Unit<q.MomentOfInertia>;
export declare const WattPerSquareMeter: Unit.Unit<q.Intensity>;
export declare const KiloWattPerCubicMeterPerSecond: Unit.Unit<q.SpecificFanPower>;
export declare const WattPerCubicMeterPerSecond: Unit.Unit<q.SpecificFanPower>;
export declare const Decibel: Unit.Unit<q.SoundPressureLevel>;
export declare const DecibelLw: Unit.Unit<q.SoundPowerLevel>;
export declare const MilliGramCalciumPerLiter: Unit.Unit<q.WaterHardness>;
export declare const FrenchDegree: Unit.Unit<q.WaterHardness>;
export declare const MilliVolt: Unit.Unit<q.ElectricPotential>;
export declare const KiloVolt: Unit.Unit<q.ElectricPotential>;
export declare const Integer: Unit.Unit<q.Discrete>;
export declare const Text: Unit.Unit<q.Text>;
export declare const MilliGramHydrogenCarbonatePerLiter: Unit.Unit<q.Alkalinity>;
export declare const PascalSecond: Unit.Unit<q.Viscosity>;
export declare const GallonsPerMinutePerTonCooling: Unit.Unit<q.VolumeFlowPerPower>;
export declare const LiterPerSecondPerKiloWatt: Unit.Unit<q.VolumeFlowPerPower>;
export declare function isUnit(unit: string): boolean;
export declare function getUnitFromString(unitString: string, onError?: (unitString: string) => Unit.Unit<any>): Unit.Unit<any>;
export declare function getStringFromUnit(unit: Unit.Unit<any>): string;
export declare function getQuantityTypeFromString(quantityString: string, onError?: (quantityString: string) => q.Quantity): q.Quantity;
export declare function getStringFromQuantityType(quantity: Quantity): string;
export declare function getUnitsForQuantity(quantityType: q.Quantity): Array<Unit.Unit<any>>;
export declare function getAllUnits(): Array<Unit.Unit<any>>;
export declare function getAllQuantities(): Array<Quantity>;
