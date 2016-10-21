import {AbstractColor} from "../model/abstract_color";
import {GrowthDirection} from "../model/growth_direction";

export function getBaselineAdjustment(d:GrowthDirection):number {
    if (d == GrowthDirection.Up)
        return 0.0;
    if (d == GrowthDirection.Uniform)
        return 0.5;
    if (d == GrowthDirection.Down)
        return 1.0;
    throw "Unknown text alignment " + d;
}

export function getTextAnchor(d:GrowthDirection):string {
    if (d == GrowthDirection.Left)
        return "end";
    if (d == GrowthDirection.Uniform)
        return "middle";
    if (d == GrowthDirection.Right)
        return "start";
    throw "Unknown text alignment " + d;
}

export const colorToRgb = (color:AbstractColor):string => color == null ? null : "rgb(" + color.r.toString() + "," + color.g.toString() + "," + color.b.toString() + ")";