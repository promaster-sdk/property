import { AbstractColor } from "../model/abstract_color";
import { GrowthDirection } from "../model/growth_direction";
export declare function getBaselineAdjustment(d: GrowthDirection): number;
export declare function getTextAnchor(d: GrowthDirection): string;
export declare const colorToRgb: (color: AbstractColor) => string;
