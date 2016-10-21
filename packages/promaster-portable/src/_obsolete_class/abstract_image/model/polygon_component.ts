import { AbstractComponent } from './abstract_component';
import { AbstractColor } from './abstract_color';
import { AbstractPoint } from './abstract_point';

export class PolygonComponent extends AbstractComponent {

	private _points:Array<AbstractPoint>;
	private _strokeColor:AbstractColor;
	private _strokeThickness:number;
	private _fillColor:AbstractColor;

	constructor(points, strokeColor, strokeThickness, fillColor) {
		super();
		this._points = points;
		this._strokeColor = strokeColor;
		this._strokeThickness = strokeThickness;
		this._fillColor = fillColor;
	}

	get points():Array<AbstractPoint> {
		return this._points;
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

