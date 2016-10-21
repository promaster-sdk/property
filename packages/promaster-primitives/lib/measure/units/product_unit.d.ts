import { Quantity } from "../quantity";
import * as UnitConverter from "../unit_converters/unit_converter";
import * as Unit from "../unit";
import { Element } from "./element";
export interface ProductUnit<T extends Quantity> {
    readonly type: "product";
}
export declare function create<T extends Quantity>(quantity: T, elements: Array<Element>): Unit.Unit<T>;
export declare function fromElements<T extends Quantity>(quantity: T, elements: Array<Element>): Unit.Unit<T>;
export declare function fromProduct<T extends Quantity>(quantity: T, leftElems: Array<Element>, rightElems: Array<Element>): Unit.Unit<T>;
export declare function Product<T extends Quantity>(quantity: T, left: Unit.Unit<any>, right: Unit.Unit<any>): Unit.Unit<T>;
export declare function Quotient<T extends Quantity>(quantity: T, left: Unit.Unit<any>, right: Unit.Unit<any>): Unit.Unit<T>;
export declare function getStandardUnit<T extends Quantity>(quantity: T, unit: Unit.Unit<T>): Unit.Unit<any>;
export declare function toStandardUnit<T extends Quantity>(unit: Unit.Unit<T>): UnitConverter.UnitConverter;
export declare function buildDerivedName<T extends Quantity>(unit: Unit.Unit<T>): string;
export declare function buildNameFromElements(elements: Array<Element>): string;
export declare function getElements<T extends Quantity>(unit: Unit.Unit<T>): Array<Element>;
