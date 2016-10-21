import { AbstractSize } from './abstract_size';
import { AbstractComponent } from './abstract_component';
import { AbstractColor } from './abstract_color';
import { AbstractPoint } from "./abstract_point";
export declare class AbstractImageRoot extends AbstractComponent {
    private _topLeft;
    private _size;
    private _backgroundColor;
    private _components;
    static fromSingleImage(format: string, data: Uint8Array, width: number, height: number): AbstractImageRoot;
    constructor(topLeft: any, size: any, backgroundColor: any, components: any);
    readonly topLeft: AbstractPoint;
    readonly size: AbstractSize;
    readonly backgroundColor: AbstractColor;
    readonly components: Array<AbstractComponent>;
}
