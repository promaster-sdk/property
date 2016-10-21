import { AbstractComponent } from './abstract_component';
import { AbstractColor } from './abstract_color';
import { AbstractPoint } from './abstract_point';

export class LineComponent extends AbstractComponent {
	private _start:AbstractPoint;
	private _end:AbstractPoint;
	private _strokeColor:AbstractColor;
	private _strokeThickness:number;

	constructor(start, end, strokeColor, strokeThickness) {
		super();
		this._start = start;
		this._end = end;
		this._strokeColor = strokeColor;
		this._strokeThickness = strokeThickness;
	}

	get start():AbstractPoint {
		return this._start;
	}

	get end():AbstractPoint {
		return this._end;
	}

	get strokeColor():AbstractColor {
		return this._strokeColor;
	}

	get strokeThickness():number {
		return this._strokeThickness;
	}

}
