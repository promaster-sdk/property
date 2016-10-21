import { Unit } from "../unit";
export interface Element {
    readonly unit: Unit<any>;
    readonly pow: number;
}
export declare function create(unit: Unit<any>, pow: number): Element;
export declare function toString(element: Element): string;
