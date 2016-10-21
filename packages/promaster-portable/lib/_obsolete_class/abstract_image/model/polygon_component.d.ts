import { AbstractComponent } from './abstract_component';
import { AbstractColor } from './abstract_color';
import { AbstractPoint } from './abstract_point';
export declare class PolygonComponent extends AbstractComponent {
    private _points;
    private _strokeColor;
    private _strokeThickness;
    private _fillColor;
    constructor(points: any, strokeColor: any, strokeThickness: any, fillColor: any);
    readonly points: Array<AbstractPoint>;
    readonly strokeColor: AbstractColor;
    readonly strokeThickness: number;
    readonly fillColor: AbstractColor;
}
