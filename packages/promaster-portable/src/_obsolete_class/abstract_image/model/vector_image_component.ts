import { AbstractComponent } from './abstract_component';
import { AbstractPoint } from './abstract_point';

export class VectorImageComponent extends AbstractComponent {

	private _topLeft:AbstractPoint;
	private _rootComponent:AbstractComponent;

	constructor(topLeft, rootComponent) {
		super();
		this._topLeft = topLeft;
		this._rootComponent = rootComponent;
	}

	get topLeft():AbstractPoint {
		return this._topLeft;
	}

	get rootComponent():AbstractComponent {
		return this._rootComponent;
	}

}

