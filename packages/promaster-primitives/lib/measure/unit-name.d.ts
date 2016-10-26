import { Quantity } from "./quantity";
import * as Unit from "./unit";
export declare function registerLabel<T extends Quantity>(label: string, unit: Unit.Unit<T>): void;
export declare function getName<T extends Quantity>(unit: Unit.Unit<T>): string;
