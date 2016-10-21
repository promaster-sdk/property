import { AbstractComponent } from './abstract_component';
import { AbstractColor } from './abstract_color';
import { AbstractPoint } from './abstract_point';
export declare class LineComponent extends AbstractComponent {
    private _start;
    private _end;
    private _strokeColor;
    private _strokeThickness;
    constructor(start: any, end: any, strokeColor: any, strokeThickness: any);
    readonly start: AbstractPoint;
    readonly end: AbstractPoint;
    readonly strokeColor: AbstractColor;
    readonly strokeThickness: number;
}
