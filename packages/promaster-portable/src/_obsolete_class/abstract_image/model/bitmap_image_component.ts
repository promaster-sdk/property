import { AbstractComponent } from './abstract_component';
import { AbstractPoint } from './abstract_point';

export class BitmapImageComponent extends AbstractComponent {

	private _topLeft:AbstractPoint;
	private _format:string;
	private _data:Uint8Array;

	constructor(topLeft, format, data) {
		super();
		this._topLeft = topLeft;
		this._format = format;
		this._data = data;
	}

	get topLeft():AbstractPoint {
		return this._topLeft;
	}

	get format():string {
		return this._format;
	}

	get data():Uint8Array {
		return this._data;
	}

}

