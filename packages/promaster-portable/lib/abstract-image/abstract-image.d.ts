import * as Size from "./size";
import * as Color from "./color";
import * as Model from "./model";
import * as Point from "./point";
export interface AbstractImage {
    readonly topLeft: Point.Point;
    readonly size: Size.Size;
    readonly backgroundColor: Color.Color;
    readonly components: Array<Model.Component>;
}
export declare function createAbstractImage(topLeft: Point.Point, size: Size.Size, backgroundColor: Color.Color, components: Array<Model.Component>): AbstractImage;
