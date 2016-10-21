import { AbstractComponent } from './abstract_component';
import { AbstractPoint } from './abstract_point';
export declare class VectorImageComponent extends AbstractComponent {
    private _topLeft;
    private _rootComponent;
    constructor(topLeft: any, rootComponent: any);
    readonly topLeft: AbstractPoint;
    readonly rootComponent: AbstractComponent;
}
