export class AbstractPoint {

	private _x:number;
	private _y:number;

	constructor(x:number, y:number) {
		this._x = x;
		this._y = y;
	}

	//bool operator ==(other) => other is AbstractPoint && other.y == y && other.x == x;
	//
	//int get hashCode => hash2(x, y);

	get x():number {
		return this._x;
	}

	get y():number {
		return this._y;
	}

}

