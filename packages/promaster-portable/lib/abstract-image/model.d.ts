import * as Point from "./point";
import * as Color from "./color";
export declare type Component = BitmapImage | Ellipse | Line | Polygon | Rectangle | Text | VectorImage;
export interface BitmapImage {
    readonly type: "bitmapimage";
    readonly topLeft: Point.Point;
    readonly format: string;
    readonly data: Uint8Array;
}
export declare function createBitmapImage(topLeft: Point.Point, format: string, data: Uint8Array): BitmapImage;
export interface Ellipse {
    readonly type: "ellipse";
    readonly topLeft: Point.Point;
    readonly bottomRight: Point.Point;
    readonly strokeColor: Color.Color;
    readonly strokeThickness: number;
    readonly fillColor: Color.Color;
}
export declare function createEllipse(topLeft: Point.Point, bottomRight: Point.Point, strokeColor: Color.Color, strokeThickness: number, fillColor: Color.Color): Ellipse;
export interface Line {
    readonly type: "line";
    readonly start: Point.Point;
    readonly end: Point.Point;
    readonly strokeColor: Color.Color;
    readonly strokeThickness: number;
}
export declare function createLine(start: Point.Point, end: Point.Point, strokeColor: Color.Color, strokeThickness: number): Line;
export interface Polygon {
    readonly type: "polygon";
    readonly points: Array<Point.Point>;
    readonly strokeColor: Color.Color;
    readonly strokeThickness: number;
    readonly fillColor: Color.Color;
}
export declare function createPolygon(points: Array<Point.Point>, strokeColor: Color.Color, strokeThickness: number, fillColor: Color.Color): Polygon;
export interface Rectangle {
    readonly type: "rectangle";
    readonly topLeft: Point.Point;
    readonly bottomRight: Point.Point;
    readonly strokeColor: Color.Color;
    readonly strokeThickness: number;
    readonly fillColor: Color.Color;
}
export declare function createRectangle(topLeft: Point.Point, bottomRight: Point.Point, strokeColor: Color.Color, strokeThickness: number, fillColor: Color.Color): Rectangle;
export declare function corners(rectangle: Rectangle): Array<Point.Point>;
export declare type AbstractFontWeight = "normal" | "bold";
export declare type TextAlignment = "left" | "center" | "right";
export declare type GrowthDirection = "up" | "down" | "uniform" | "left" | "right";
export interface Text {
    readonly type: "text";
    readonly position: Point.Point;
    readonly text: string;
    readonly fontFamily: string;
    readonly fontSize: number;
    readonly textColor: Color.Color;
    readonly fontWeight: AbstractFontWeight;
    readonly clockwiseRotationDegrees: number;
    readonly textAlignment: TextAlignment;
    readonly horizontalGrowthDirection: GrowthDirection;
    readonly verticalGrowthDirection: GrowthDirection;
    readonly strokeThickness: number;
    readonly strokeColor: Color.Color;
}
export declare function createText(position: Point.Point, text: string, fontFamily: string, fontSize: number, textColor: Color.Color, fontWeight: AbstractFontWeight, clockwiseRotationDegrees: number, textAlignment: TextAlignment, horizontalGrowthDirection: GrowthDirection, verticalGrowthDirection: GrowthDirection, strokeThickness: number, strokeColor: Color.Color): Text;
export interface VectorImage {
    readonly type: "vectorimage";
    readonly topLeft: Point.Point;
    readonly image: Component;
}
export declare function createVectorImage(topLeft: Point.Point, image: Component): VectorImage;
