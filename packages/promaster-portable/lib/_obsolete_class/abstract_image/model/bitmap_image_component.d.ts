import { AbstractComponent } from './abstract_component';
import { AbstractPoint } from './abstract_point';
export declare class BitmapImageComponent extends AbstractComponent {
    private _topLeft;
    private _format;
    private _data;
    constructor(topLeft: any, format: any, data: any);
    readonly topLeft: AbstractPoint;
    readonly format: string;
    readonly data: Uint8Array;
}
