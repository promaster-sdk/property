import { AbstractSize } from './abstract_size';
import { AbstractColor } from './abstract_color';
import { AbstractComponent } from './abstract_component';
import { AbstractPoint } from './abstract_point';

export class EllipseComponent extends AbstractComponent {

	private _topLeft:AbstractPoint;
	private _size:AbstractSize;
	private _strokeColor:AbstractColor;
	private _strokeThickness:number;
	private _fillColor:AbstractColor;

	constructor(topLeft, size, strokeColor, strokeThickness, fillColor) {
		super();
		this._topLeft = topLeft;
		this._size = size;
		this._strokeColor = strokeColor;
		this._strokeThickness = strokeThickness;
		this._fillColor = fillColor;
	}

	get topLeft():AbstractPoint {
		return this._topLeft;
	}

	get size():AbstractSize {
		return this._size;
	}

	get strokeColor():AbstractColor {
		return this._strokeColor;
	}

	get strokeThickness():number {
		return this._strokeThickness;
	}

	get fillColor():AbstractColor {
		return this._fillColor;
	}

}
