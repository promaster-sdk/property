import { AbstractImageRoot, AbstractPoint, AbstractComponent, AbstractFontWeight, AbstractColor, TextAlignment, GrowthDirection } from './model/index';
import { MeasureImage } from './functions';
export declare class AbstractImageBuilder {
    _components: Array<AbstractComponent>;
    width: number;
    height: number;
    backgroundColor: AbstractColor;
    static create(): AbstractImageBuilder;
    static createFromWidthHeight(width: number, height: number): AbstractImageBuilder;
    constructor(width: number, height: number, backgroundColor: AbstractColor);
    addText(x: number, y: number, text: string, fontFamily: string, fontSize: number, textColor: AbstractColor, fontWeight: AbstractFontWeight, clockwiseRotationDegrees?: number, textAlignment?: TextAlignment, horizontalGrowthDirection?: GrowthDirection, verticalGrowthDirection?: GrowthDirection, strokeThickness?: number, strokeColor?: AbstractColor): void;
    addBitmapImage(format: string, data: Uint8Array): void;
    addVectorImage(rootComponent: AbstractComponent): void;
    addImageXY(x: number, y: number, format: string, data: Uint8Array): void;
    addLine(x: number, y: number, x2: number, y2: number, strokeColor: AbstractColor, strokeThickness: number): void;
    addEllipse(x: number, y: number, width: number, height: number, strokeColor: AbstractColor, strokeThickness: number, fillColor: AbstractColor): void;
    addRectangle(x: number, y: number, width: number, height: number, strokeColor: AbstractColor, strokeThickness: number, fillColor: AbstractColor): void;
    addPolygon(points: Array<AbstractPoint>, strokeColor: AbstractColor, strokeThickness: number, fillColor: AbstractColor): void;
    addPolyLine(points: Array<AbstractPoint>, strokeColor: AbstractColor, strokeThickness: number): void;
    addAbstractImage(x: number, y: number, image: AbstractImageRoot): void;
    build(): AbstractImageRoot;
    setSizeToFitContent(measure: MeasureImage): void;
}
