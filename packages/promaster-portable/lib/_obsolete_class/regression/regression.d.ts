export declare class Vector2 {
    private _x;
    private _y;
    constructor(x: number, y: number);
    readonly x: number;
    readonly y: number;
    toString: () => string;
}
export declare abstract class RegCurve {
    private _minX;
    private _maxX;
    constructor(minX: number, maxX: number);
    readonly minX: number;
    readonly maxX: number;
    abstract calcX(y: number): number;
    abstract calcY(x: number): number;
}
export declare class LinearCurve extends RegCurve {
    a: number;
    b: number;
    constructor(a: number, b: number, minX: number, maxX: number);
    static fromPoints(points: Array<Vector2>): LinearCurve;
    calcX(y: number): number;
    calcY(x: number): number;
}
export declare class PolynomialCurve extends RegCurve {
    a: number;
    constructor(a: number, minX: number, maxX: number);
    static fromPoint(x: number, y: number): PolynomialCurve;
    static fromPoints(points: Array<Vector2>): PolynomialCurve;
    calcX(y: number): number;
    calcY(x: number): number;
}
export declare class PowerCurve extends RegCurve {
    a: number;
    b: number;
    constructor(a: number, b: number, minX: number, maxX: number);
    static fromPoints(points: Array<Vector2>): PowerCurve;
    calcX(y: number): number;
    calcY(x: number): number;
}
export declare class ExponentialCurve extends RegCurve {
    a: number;
    b: number;
    constructor(a: number, b: number, minX: number, maxX: number);
    calcX(y: number): number;
    calcY(x: number): number;
}
export declare class LogCurve extends RegCurve {
    a: number;
    b: number;
    constructor(a: number, b: number, minX: number, maxX: number);
    static fromPoints(points: Array<Vector2>): LogCurve;
    calcX(y: number): number;
    calcY(x: number): number;
}
