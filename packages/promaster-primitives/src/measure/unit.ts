import {Quantity, Dimensionless} from "./quantity";
import * as UnitConverter from "./unit_converter";

// This record represents a determinate quantity (as of length, time, heat, or value)
// adopted as a standard of measurement.
//
// It is helpful to think of instances of this record as recording the history by which
// they are created. Thus, for example, the string "g/kg" (which is a dimensionless unit)
// would result from invoking the method toString() on a unit that was created by
// dividing a gram unit by a kilogram unit. Yet, "kg" divided by "kg" returns ONE and
// not "kg/kg" due to automatic unit factorization.
//
// This record supports the multiplication of offsets units. The result is usually a unit
// not convertible to its standard unit. Such units may appear in derivative quantities.
// For example °C/m is an unit of gradient, which is common in atmospheric and oceanographic research.
//
// Units raised at rational powers are also supported. For example the cubic root of liter
// is a unit compatible with meter.
export interface Unit<T extends Quantity> {
  readonly quantity: Quantity,
  // readonly elements: Array<Element>,
  readonly innerUnit: InnerUnit<T>,
}

export type InnerUnit<T extends Quantity> =
  AlternateUnit<T>
    | BaseUnit<T>
    | ProductUnit<T>
    | TransformedUnit<T>;

/// Holds the dimensionless unit ONE
//public static readonly Unit<T> One = new ProductUnit<T>();

// This record represents the building blocks on top of which all others
// units are created.
// This record represents the "standard base units" which includes SI base
// units and possibly others user-defined base units. It does not represent
// the base units of any specific System Of Units (they would have
// be base units accross all possible systems otherwise).
export interface BaseUnit<T extends Quantity> {
  readonly type: "base",
  /// Holds the unique symbol for this base unit.
  readonly symbol: string,
}

// This record represents the units used in expressions to distinguish
// between quantities of a different nature but of the same dimensions.
export interface AlternateUnit<T extends Quantity> {
  readonly type: "alternate",
  readonly symbol: string,
  /// Holds the parent unit (a system unit).
  readonly parent: Unit<any>,
}

/// This record represents the units derived from other units using
/// UnitConverter converters.
///
/// Examples of transformed units:
///       CELSIUS = KELVIN.add(273.15);
///       FOOT = METER.multiply(0.3048);
///       MILLISECOND = MILLI(SECOND);
///
/// Transformed units have no label. But like any other units,
///  they may have labels attached to them:
///       UnitFormat.getStandardInstance().label(FOOT, "ft");
///
///   or aliases:
///       UnitFormat.getStandardInstance().alias(CENTI(METER)), "centimeter");
///       UnitFormat.getStandardInstance().alias(CENTI(METER)), "centimetre");
export interface TransformedUnit<T extends Quantity> {
  readonly type: "transformed",
  /// Holds the parent unit (not a transformed unit).
  readonly parentUnit: Unit<T>,
  /// Holds the converter to the parent unit.
  readonly toParentUnitConverter: UnitConverter.UnitConverter,
}

// This record represents units formed by the product of rational powers of
// existing units.
//
// This record maintains the canonical form of this product (simplest
// form after factorization). For example:
// METER.pow(2).divide(METER) returns METER.
export interface ProductUnit<T extends Quantity> {
  readonly type: "product",
  /// Holds the units composing this product unit.
  readonly elements: Array<Element>,
}

/// Inner product element represents a rational power of a single unit.
export interface Element {
  /// Holds the single unit.
  readonly unit: Unit<any>;
  /// Holds the power exponent.
  readonly pow: number;
}

/// Creates a base unit having the specified symbol.
/// <param name="symbol">the symbol of this base unit.</param>
export function createBase<T extends Quantity>(quantity: T, symbol: string): Unit<T> {
  return create(quantity, {type: "base", symbol} as BaseUnit<T>);
}

/// Creates an alternate unit for the specified unit identified by the
/// specified symbol.
/// <param name="symbol">the symbol for this alternate unit.</param>
/// <param name="parent">parent the system unit from which this alternate unit is derived.</param>
export function createAlternate<T extends Quantity>(symbol: string, parent: Unit<any>): Unit<T> {
  return create(parent.quantity, {type: "alternate", symbol, parent} as AlternateUnit<T>);
}

// Used solely to create ONE instance.
export function createOne(): Unit<Dimensionless> {
  return create("Dimensionless", {type: "product", elements: []} as ProductUnit<Dimensionless>);
}

// Creates a ProductUnit.
export function times<T extends Quantity>(quantity: T, left: Unit<Quantity>, right: Unit<Quantity>): Unit<T> {
  return product(quantity, left, right);
}

// Creates a ProductUnit.
export function divide<T extends Quantity>(quantity: T, left: Unit<Quantity>, right: Unit<Quantity>): Unit<T> {
  return quotient(quantity, left, right);
}

// Simulate operator overload
export function timesNumber<T extends Quantity>(factor: number, unit: Unit<T>): Unit<T> {
  return transform(UnitConverter.factor(factor), unit);
}

// Simulate operator overload
export function divideNumber<T extends Quantity>(factor: number, unit: Unit<T>): Unit<T> {
  return transform(UnitConverter.factor(1.0 / factor), unit);
}

// Simulate operator overload
export function plus<T extends Quantity>(offset: number, unit: Unit<T>): Unit<T> {
  return transform(UnitConverter.offset(offset), unit);
}

// Simulate operator overload
export function minus<T extends Quantity>(offset: number, unit: Unit<T>): Unit<T> {
  return transform(UnitConverter.offset(-offset), unit);
}

/// Returns a converter of numeric values from this unit to another unit.
/// <param name="that">the unit to which to convert the numeric values.</param>
/// <returns>the converter from this unit to <code>that</code> unit.</returns>
export function getConverterTo<T extends Quantity>(that: Unit<any>, unit: Unit<T>): UnitConverter.UnitConverter {
  if (unit == that) {
    return UnitConverter.Identity;
  }
  return UnitConverter.concatenate(toStandardUnit(unit), UnitConverter.inverse(toStandardUnit(that)));
}


// Returns the converter from this unit to its system unit.
function toStandardUnit<T extends Quantity>(unit: Unit<T>): UnitConverter.UnitConverter {
  switch (unit.innerUnit.type) {
    case "alternate":
      return toStandardUnit(unit.innerUnit.parent);
    case "base":
      return UnitConverter.Identity;
    case "product":
      return productUnitToStandardUnit(unit);
    case "transformed":
      return UnitConverter.concatenate(unit.innerUnit.toParentUnitConverter, toStandardUnit(unit.innerUnit.parentUnit));
  }
  throw new Error(`Unknown innerUnit ${JSON.stringify(unit)}`);
}

/// Returns the unit derived from this unit using the specified converter.
/// The converter does not need to be linear.
/// <param name="operation">the converter from the transformed unit to this unit.</param>
/// <returns>the unit after the specified transformation.</returns>
function transform<T extends Quantity>(operation: UnitConverter.UnitConverter, unit: Unit<T>): Unit<T> {
  if (operation === UnitConverter.Identity) {
    return unit;
  }
  return createTransformed(unit, operation);
}

/// Creates a transformed unit from the specified parent unit.
/// <param name="parentUnit">the untransformed unit from which this unit is derived.</param>
/// <param name="toParentUnitConverter">the converter to the parent units.</param>
function createTransformed<T extends Quantity>(parentUnit: Unit<T>, toParentUnitConverter): Unit<T> {
  return create(parentUnit.quantity, {type: "transformed", parentUnit, toParentUnitConverter} as TransformedUnit<T>);
}

function create<T extends Quantity>(quantity: T, innerUnit: InnerUnit<T>): Unit<T> {
  return {quantity, innerUnit}
}

/// Creates the unit defined from the product of the specifed elements.
/// <param name="leftElems">left multiplicand elements</param>
/// <param name="rightElems">right multiplicand elements.</param>
function fromProduct<T extends Quantity>(quantity: T, leftElems: Array<Element>, rightElems: Array<Element>): Unit<T> {
  // If we have several elements of the same unit then we can merge them by summing their power
  let allElements: Array<Element> = [];
  allElements.push(...leftElems);
  allElements.push(...rightElems);
  let resultElements: Array<Element> = [];

  let unitGroups: Map<Unit<any>, Array<Element>> = new Map<Unit<any>, Array<Element>>();
  allElements.forEach((v: Element) => {
    const group = unitGroups.get(v.unit);
    if (group === undefined)
      unitGroups.set(v.unit, [v]);
    else
      group.push(v);
  });

  unitGroups.forEach((unitGroup: Array<Element>, unit: Unit<any>)=> {

    let sumpow: number = unitGroup.reduce((prev: number, element: Element) => prev + element.pow, 0);
    if (sumpow != 0) {
      resultElements.push(createElement(unit, sumpow));
    }

  });

  return createProductUnit(quantity, resultElements);
}

function createElement(unit: Unit<any>, pow: number): Element {
  return {unit, pow};
}

/// <summary>
/// Returns the product of the specified units.
/// </summary>
/// <param name="left">the left unit operand.</param>
/// <param name="right">the right unit operand.</param>
/// <returns>left * right</returns>
function product<T extends Quantity>(quantity: T, left: Unit<Quantity>, right: Unit<Quantity>): Unit<T> {
  const leftelements = getElements(left);
  const rightelements = getElements(right);
  return fromProduct<T>(quantity, leftelements, rightelements);
}

/// Returns the quotient of the specified units.
/// <param name="left">the dividend unit operand.</param>
/// <param name="right">right the divisor unit operand.</param>
/// <returns>dividend / divisor</returns>
function quotient<T extends Quantity>(quantity: T, left: Unit<Quantity>, right: Unit<Quantity>): Unit<T> {

  const leftelements = getElements(left);
  let invertedRightelements: Array<Element> = [];
  for (let element of getElements(right)) {
    invertedRightelements.push(createElement(element.unit, -element.pow));
  }
  return fromProduct<T>(quantity, leftelements, invertedRightelements);

}

function getElements(unit: Unit<any>) {
  if (unit.innerUnit.type === "product") {
    return unit.innerUnit.elements;
  }
  return [];
}

function productUnitToStandardUnit<T extends Quantity>(unit: Unit<T>): UnitConverter.UnitConverter {
  let converter = UnitConverter.Identity;
  for (let element of getElements(unit)) {
    let conv = toStandardUnit(element.unit);
    let pow = element.pow;
    if (pow < 0) {
      pow = -pow;
      conv = UnitConverter.inverse(conv);
    }
    for (let i = 1; i <= pow; i++) {
      converter = UnitConverter.concatenate(conv, converter);
    }
  }
  return converter;
}

/// Product unit constructor.
/// <param name="elements">the product elements.</param>
function createProductUnit<T extends Quantity>(quantity: T, elements: Array<Element>): Unit<T> {
  return create(quantity, {type: "product", elements} as ProductUnit<T>);
}