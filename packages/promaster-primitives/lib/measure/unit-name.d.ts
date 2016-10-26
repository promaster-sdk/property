import { Quantity } from "./quantity";
import * as Unit from "./unit";
export declare function withLabel<T extends Quantity>(label: string, unit: Unit.Unit<T>): Unit.Unit<T>;
export declare function getName<T extends Quantity>(unit: Unit.Unit<T>): string;
