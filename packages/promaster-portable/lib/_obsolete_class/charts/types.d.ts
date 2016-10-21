import { AbstractColor } from "../abstract_image";
export declare class Vector2D {
    private _x;
    private _y;
    constructor(x: number, y: number);
    readonly x: number;
    readonly y: number;
}
export declare enum LabelPosition {
    Start = 0,
    End = 1,
}
export declare class ChartCurve {
    private _color;
    private _label;
    private _labelPosition;
    private _thickness;
    private _points;
    constructor(color: AbstractColor, label: string, labelPosition: LabelPosition, thickness: number, points: Array<Vector2D>);
    readonly color: AbstractColor;
    readonly label: string;
    readonly labelPosition: LabelPosition;
    readonly thickness: number;
    readonly points: Array<Vector2D>;
}
export declare class ChartPoint {
    private _color;
    private _label;
    private _point;
    constructor(color: AbstractColor, label: string, point: Vector2D);
    readonly color: AbstractColor;
    readonly label: string;
    readonly point: Vector2D;
}
export declare class ChartArea {
    private _color;
    private _label;
    private _min;
    private _max;
    constructor(color: AbstractColor, label: string, min: Vector2D, max: Vector2D);
    readonly color: AbstractColor;
    readonly label: string;
    readonly min: Vector2D;
    readonly max: Vector2D;
}
export declare abstract class IAxis {
    private _name;
    private _minVal;
    private _maxVal;
    private _lines;
    private _labels;
    constructor(name: string, minVal: number, maxVal: number, lines: Array<number>, labels: Array<number>);
    readonly name: string;
    readonly minVal: number;
    readonly maxVal: number;
    readonly lines: Array<number>;
    readonly labels: Array<number>;
    abstract axisValueToPixelValue(pixelLength: number, axisValue: number): number;
}
export declare class LinearAxis extends IAxis {
    constructor(name: string, minVal: number, maxVal: number, lines: Array<number>, labels: Array<number>);
    axisValueToPixelValue(pixelLength: number, axisValue: number): number;
}
export declare class LogAxis extends IAxis {
    constructor(name: string, minVal: number, maxVal: number, lines: Array<number>, labels: Array<number>);
    axisValueToPixelValue(pixelLength: number, value: number): number;
    static _log10(x: number): number;
}
