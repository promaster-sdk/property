import { AbstractComponent } from './abstract_component';
import { AbstractSize } from './abstract_size';
import { AbstractColor } from './abstract_color';
import { AbstractPoint } from './abstract_point';
export declare class RectangleComponent extends AbstractComponent {
    private _topLeft;
    private _size;
    private _strokeColor;
    private _strokeThickness;
    private _fillColor;
    constructor(topLeft: any, size: any, strokeColor: any, strokeThickness: any, fillColor: any);
    readonly topLeft: AbstractPoint;
    readonly size: AbstractSize;
    readonly strokeColor: AbstractColor;
    readonly strokeThickness: number;
    readonly fillColor: AbstractColor;
    corners(): Array<AbstractPoint>;
}
