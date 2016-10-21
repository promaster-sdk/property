export class AbstractSize {

	private _width:number;
	private _height:number;

	constructor(width, height) {
		this._width = width;
		this._height = height;
	}

	get width():number {
		return this._width;
	}

	get height():number {
		return this._height;
	}

}

