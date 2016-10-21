import * as Unit from './unit';
import * as ProductUnit from './units/product_unit';
import * as q from "./quantity";

export function volumeByDuration(left: Unit.Unit<q.Volume>, right: Unit.Unit<q.Duration>): Unit.Unit<q.VolumeFlow> {
    return ProductUnit.Quotient("VolumeFlow", left, right);
}

export function lengthByDuration(left: Unit.Unit<q.Length>, right: Unit.Unit<q.Duration>): Unit.Unit<q.Velocity> {
    return ProductUnit.Quotient("Velocity", left, right);
}

export function velocityBySecond(left: Unit.Unit<q.Velocity>, right: Unit.Unit<q.Duration>): Unit.Unit<q.Acceleration> {
    return ProductUnit.Quotient("Acceleration", left, right);
}

export function amountOfSubstanceByDuration(left: Unit.Unit<q.AmountOfSubstance>, right: Unit.Unit<q.Duration>): Unit.Unit<q.CatalyticActivity> {
    return ProductUnit.Quotient("CatalyticActivity", left, right);
}

export function massByVolume(left: Unit.Unit<q.Mass>, right: Unit.Unit<q.Volume>): Unit.Unit<q.Density> {
    return ProductUnit.Quotient("Density", left, right);
}

export function electricChargeByElectricPotential(left: Unit.Unit<q.ElectricCharge>, right: Unit.Unit<q.ElectricPotential>): Unit.Unit<q.ElectricCapacitance> {
    return ProductUnit.Quotient("ElectricCapacitance", left, right);
}

export function energyByDuration(left: Unit.Unit<q.Energy>, right: Unit.Unit<q.Duration>): Unit.Unit<q.Power> {
    return ProductUnit.Quotient("Power", left, right);
}

export function powerByElectricalCurrent(left: Unit.Unit<q.Power>, right: Unit.Unit<q.ElectricCurrent>): Unit.Unit<q.ElectricPotential> {
    return ProductUnit.Quotient("ElectricPotential", left, right);
}

export function electricalCurrentByElectricalPotential(left: Unit.Unit<q.ElectricCurrent>, right: Unit.Unit<q.ElectricPotential>): Unit.Unit<q.ElectricConductance> {
    return ProductUnit.Quotient("ElectricConductance", left, right);
}

export function magneticFluxByElectricalCurrent(left: Unit.Unit<q.MagneticFlux>, right: Unit.Unit<q.ElectricCurrent>): Unit.Unit<q.ElectricInductance> {
    return ProductUnit.Quotient("ElectricInductance", left, right);
}

export function electricalPotentialByElectricalCurrent(left: Unit.Unit<q.ElectricPotential>, right: Unit.Unit<q.ElectricCurrent>): Unit.Unit<q.ElectricResistance> {
    return ProductUnit.Quotient("ElectricResistance", left, right);
}

export function dimentionlessByDuration(left: Unit.Unit<q.Dimensionless>, right: Unit.Unit<q.Duration>): Unit.Unit<q.Frequency> {
    return ProductUnit.Quotient("Frequency", left, right);
}

export function luminousFluxByArea(left: Unit.Unit<q.LuminousFlux>, right: Unit.Unit<q.Area>): Unit.Unit<q.Illuminance> {
    return ProductUnit.Quotient("Illuminance", left, right);
}

export function magneticFluxByArea(left: Unit.Unit<q.MagneticFlux>, right: Unit.Unit<q.Area>): Unit.Unit<q.MagneticFluxDensity> {
    return ProductUnit.Quotient("MagneticFluxDensity", left, right);
}

export function massByDuration(left: Unit.Unit<q.Mass>, right: Unit.Unit<q.Duration>): Unit.Unit<q.MassFlow> {
    return ProductUnit.Quotient("MassFlow", left, right);
}

export function forceByArea(left: Unit.Unit<q.Force>, right: Unit.Unit<q.Area>): Unit.Unit<q.Pressure> {
    return ProductUnit.Quotient("Pressure", left, right);
}

export function energyByMass(left: Unit.Unit<q.Energy>, right: Unit.Unit<q.Mass>): Unit.Unit<q.SpecificEnthalpy> {
    return ProductUnit.Quotient("SpecificEnthalpy", left, right);
}

export function powerByVolumeFlow(left: Unit.Unit<q.Power>, right: Unit.Unit<q.VolumeFlow>): Unit.Unit<q.SpecificFanPower> {
    return ProductUnit.Quotient("SpecificFanPower", left, right);
}

export function powerByTemperature(left: Unit.Unit<q.Power>, right: Unit.Unit<q.Temperature>): Unit.Unit<q.HeatCapacityRate> {
    return ProductUnit.Quotient("HeatCapacityRate", left, right);
}

export function massByMass(left: Unit.Unit<q.Mass>, right: Unit.Unit<q.Mass>): Unit.Unit<q.HumidityRatio> {
    return ProductUnit.Quotient("HumidityRatio", left, right);
}

export function dimensionlessByVolume(left: Unit.Unit<q.Dimensionless>, right: Unit.Unit<q.Volume>): Unit.Unit<q.DimensionlessPerVolume> {
    return ProductUnit.Quotient("DimensionlessPerVolume", left, right);
}

export function dimensionlessByEnergy(left: Unit.Unit<q.Dimensionless>, right: Unit.Unit<q.Energy>): Unit.Unit<q.DimensionlessPerEnergy> {
    return ProductUnit.Quotient("DimensionlessPerEnergy", left, right);
}

export function dimensionlessByDuration(left: Unit.Unit<q.Dimensionless>, right: Unit.Unit<q.Duration>): Unit.Unit<q.DimensionlessPerDuration> {
    return ProductUnit.Quotient("DimensionlessPerDuration", left, right);
}

export function powerByArea(left: Unit.Unit<q.Power>, right: Unit.Unit<q.Area>): Unit.Unit<q.Intensity> {
    return ProductUnit.Quotient("Intensity", left, right);
}

export function volumeByEnergy(left: Unit.Unit<q.Volume>, right: Unit.Unit<q.Energy>): Unit.Unit<q.WaterUseEfficiency> {
    return ProductUnit.Quotient("WaterUseEfficiency", left, right);
}

export function massByEnergy(left: Unit.Unit<q.Mass>, right: Unit.Unit<q.Energy>): Unit.Unit<q.Emission> {
    return ProductUnit.Quotient("Emission", left, right);
}

export function massFlowByArea(left: Unit.Unit<q.MassFlow>, right: Unit.Unit<q.Area>): Unit.Unit<q.MassFlowPerArea> {
    return ProductUnit.Quotient("MassFlowPerArea", left, right);
}

export function energyByVolume(left: Unit.Unit<q.Energy>, right: Unit.Unit<q.Volume>): Unit.Unit<q.HeatingValue> {
    return ProductUnit.Quotient("HeatingValue", left, right);
}

export function volumeFlowByPower(left: Unit.Unit<q.VolumeFlow>, right: Unit.Unit<q.Power>): Unit.Unit<q.VolumeFlowPerPower> {
    return ProductUnit.Quotient("VolumeFlowPerPower", left, right);
}

export function volumeFlowByArea(left: Unit.Unit<q.VolumeFlow>, right: Unit.Unit<q.Area>): Unit.Unit<q.VolumeFlowPerArea> {
    return ProductUnit.Quotient("VolumeFlowPerArea", left, right);
}

export function dimensionlessByMass(left: Unit.Unit<q.Dimensionless>, right: Unit.Unit<q.Mass>): Unit.Unit<q.DimensionlessPerMass> {
    return ProductUnit.Quotient("DimensionlessPerMass", left, right);
}
