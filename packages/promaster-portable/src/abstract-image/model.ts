import * as Point from "./point";
import * as Color from "./color";

export type Component =
  | BitmapImage
  | Ellipse
  | Line
  | PolyLine
  | Polygon
  | Rectangle
  | Text
  | VectorImage
  | Group;

export interface Group {
  readonly type: "group";
  readonly name: string;
  readonly children: Array<Component>;
}

export function createGroup(name: string, children: Array<Component>): Group {
  return {
    type: "group",
    name: name,
    children: children
  };
}

export interface BitmapImage {
  readonly type: "bitmapimage";
  readonly topLeft: Point.Point;
  readonly bottomRight: Point.Point;
  readonly format: string;
  readonly data: Uint8Array;
}

export function createBitmapImage(
  topLeft: Point.Point,
  bottomRight: Point.Point,
  format: string,
  data: Uint8Array
): BitmapImage {
  return {
    type: "bitmapimage",
    topLeft: topLeft,
    bottomRight: bottomRight,
    format: format,
    data: data
  };
}

export interface Ellipse {
  readonly type: "ellipse";
  readonly topLeft: Point.Point;
  readonly bottomRight: Point.Point;
  readonly strokeColor: Color.Color;
  readonly strokeThickness: number;
  readonly fillColor: Color.Color;
}

export function createEllipse(
  topLeft: Point.Point,
  bottomRight: Point.Point,
  strokeColor: Color.Color,
  strokeThickness: number,
  fillColor: Color.Color
): Ellipse {
  return {
    type: "ellipse",
    topLeft: topLeft,
    bottomRight: bottomRight,
    strokeColor: strokeColor,
    strokeThickness: strokeThickness,
    fillColor: fillColor
  };
}

export interface Line {
  readonly type: "line";
  readonly start: Point.Point;
  readonly end: Point.Point;
  readonly strokeColor: Color.Color;
  readonly strokeThickness: number;
}

export function createLine(
  start: Point.Point,
  end: Point.Point,
  strokeColor: Color.Color,
  strokeThickness: number
): Line {
  return {
    type: "line",
    start: start,
    end: end,
    strokeColor: strokeColor,
    strokeThickness: strokeThickness
  };
}

export interface PolyLine {
  readonly type: "polyline";
  readonly points: Array<Point.Point>;
  readonly strokeColor: Color.Color;
  readonly strokeThickness: number;
}

export function createPolyLine(
  points: Array<Point.Point>,
  strokeColor: Color.Color,
  strokeThickness: number
): PolyLine {
  return {
    type: "polyline",
    points: points,
    strokeColor: strokeColor,
    strokeThickness: strokeThickness
  };
}

export interface Polygon {
  readonly type: "polygon";
  readonly points: Array<Point.Point>;
  readonly strokeColor: Color.Color;
  readonly strokeThickness: number;
  readonly fillColor: Color.Color;
}

export function createPolygon(
  points: Array<Point.Point>,
  strokeColor: Color.Color,
  strokeThickness: number,
  fillColor: Color.Color
): Polygon {
  return {
    type: "polygon",
    points: points,
    strokeColor: strokeColor,
    strokeThickness: strokeThickness,
    fillColor: fillColor
  };
}

export interface Rectangle {
  readonly type: "rectangle";
  readonly topLeft: Point.Point;
  readonly bottomRight: Point.Point;
  readonly strokeColor: Color.Color;
  readonly strokeThickness: number;
  readonly fillColor: Color.Color;
}

export function createRectangle(
  topLeft: Point.Point,
  bottomRight: Point.Point,
  strokeColor: Color.Color,
  strokeThickness: number,
  fillColor: Color.Color
): Rectangle {
  return {
    type: "rectangle",
    topLeft: topLeft,
    bottomRight: bottomRight,
    strokeColor: strokeColor,
    strokeThickness: strokeThickness,
    fillColor: fillColor
  };
}

export function corners(rectangle: Rectangle): Array<Point.Point> {
  return [
    rectangle.topLeft,
    Point.createPoint(rectangle.bottomRight.x, rectangle.topLeft.y),
    rectangle.bottomRight,
    Point.createPoint(rectangle.topLeft.x, rectangle.bottomRight.y)
  ];
}

export type AbstractFontWeight = "normal" | "bold";

export type TextAlignment = "left" | "center" | "right";

export type GrowthDirection = "up" | "down" | "uniform" | "left" | "right";

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

export function createText(
  position: Point.Point,
  text: string,
  fontFamily: string,
  fontSize: number,
  textColor: Color.Color,
  fontWeight: AbstractFontWeight,
  clockwiseRotationDegrees: number,
  textAlignment: TextAlignment,
  horizontalGrowthDirection: GrowthDirection,
  verticalGrowthDirection: GrowthDirection,
  strokeThickness: number,
  strokeColor: Color.Color
): Text {
  return {
    type: "text",
    position: position,
    text: text,
    fontFamily: fontFamily,
    fontSize: fontSize,
    textColor: textColor,
    fontWeight: fontWeight,
    clockwiseRotationDegrees: clockwiseRotationDegrees,
    textAlignment: textAlignment,
    horizontalGrowthDirection: horizontalGrowthDirection,
    verticalGrowthDirection: verticalGrowthDirection,
    strokeThickness: strokeThickness,
    strokeColor: strokeColor
  };
}

export interface VectorImage {
  readonly type: "vectorimage";
  readonly topLeft: Point.Point;
  readonly image: Component;
}

export function createVectorImage(
  topLeft: Point.Point,
  image: Component
): VectorImage {
  return {
    type: "vectorimage",
    topLeft: topLeft,
    image: image
  };
}
