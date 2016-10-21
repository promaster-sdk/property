export class Vector2 {
	private _x:number;
	private _y:number;

	constructor(x:number, y:number) {
		this._x = x;
		this._y = y;
	}

	get x():number {
		return this._x;
	}

	get y():number {
		return this._y;
	}

	toString = ():string => "(" + this.x + ", " + this.y + ")";
}

export abstract class RegCurve {
	private _minX:number;
	private _maxX:number;

	constructor(minX:number, maxX:number) {
		this._minX = minX;
		this._maxX = maxX;
	}

	get minX():number {
		return this._minX;
	}

	get maxX():number {
		return this._maxX;
	}

	abstract calcX(y:number):number;

	abstract calcY(x:number):number;
}

// y = a*x+b
export class LinearCurve extends RegCurve {
	a:number;
	b:number;

	constructor(a:number, b:number, minX:number, maxX:number) {
		super(minX, maxX);
		this.a = a;
		this.b = b;
	}

	static fromPoints(points:Array<Vector2>):LinearCurve {
		if (points.length == 0)
			return new LinearCurve(0.0, 0.0, 0.0, 0.0);
		if (points.length == 1)
			return new LinearCurve(points[0].y, 0.0, 0.0, 0.0);
		let minX = points.map((p) => p.x).reduce((prev, curr) => Math.min(prev, curr));
		let maxX = points.map((p) => p.x).reduce((prev, curr) => Math.max(prev, curr));

		let n = points.length;
		let sumXY = _sum(points.map((p) => p.x * p.y));
		let sumXX = _sum(points.map((p) => p.x * p.x));
		let sumX = _sum(points.map((p) => p.x));
		let sumY = _sum(points.map((p) => p.y));

		let a = (n * sumXY - sumX * sumY) / (n * sumXX - Math.pow(sumX, 2));
		let b = (sumY - a * sumX) / n;

		return new LinearCurve(a, b, minX, maxX);
	}

	calcX(y:number):number {
		return (y - this.b) / this.a;
	}

	calcY(x:number):number {
		return this.a * x + this.b;
	}
}

// y = (x/a)^2
export class PolynomialCurve extends RegCurve {
	a:number;

	constructor(a:number, minX:number, maxX:number) {
		super(minX, maxX);
		this.a = a;
	}

	static fromPoint(x:number, y:number):PolynomialCurve {
		let a = x / Math.sqrt(y);
		return new PolynomialCurve(a, 0.0, 0.0);
	}

	static fromPoints(points:Array<Vector2>):PolynomialCurve {
		let a = _sum(points.map((p) => p.x / Math.sqrt(p.y))) / points.length;
		return new PolynomialCurve(a, 0.0, 0.0);
	}

	calcX(y:number):number {
		return Math.sqrt(y) * this.a;
	}

	calcY(x:number):number {
		return Math.pow(x / this.a, 2);
	}
}

// y = a*x^b
export class PowerCurve extends RegCurve {
	a:number;
	b:number;

	constructor(a:number, b:number, minX:number, maxX:number) {
		super(minX, maxX);
		this.a = a;
		this.b = b;
	}

	static fromPoints(points:Array<Vector2>):PowerCurve {
		let m = _sum(points.map((p) => Math.pow(p.y, 2)));
		let avgX = _sum(points.map((p) => Math.pow(p.y, 2) * Math.log(p.x))) / m;
		let t = _sum(points.map((p) => Math.pow(p.y, 2) * Math.pow(Math.log(p.x) - avgX, 2)));
		let b = _sum(points.map((p) => Math.pow(p.y, 2) * Math.log(p.y) * (Math.log(p.x) - avgX))) / t;
		let a = Math.exp((_sum(points.map((p) => Math.pow(p.y, 2) * Math.log(p.y))) / m) - b * avgX);
		return new PowerCurve(a, b, 0.0, 0.0);
	}

	calcX(y:number):number {
		return Math.pow(y / this.a, 1 / this.b);
	}

	calcY(x:number):number {
		return this.a * Math.pow(x, this.b);
	}
}

//// y = a+bx+cx^2
//class SecondOrderPolynomialCurve extends RegCurve {
//  final double a;
//  final double b;
//  SecondOrderPolynomialCurve(this.a, this.b, this.c, double minX, double maxX) : super(minX, maxX);
//
//  static SecondOrderPolynomialCurve fromPoints(List<Vector2> points) {
//    let x0 = points.length;
//    let x1 = _sum(points.map((p) => p.x));
//    let x2 = _sum(points.map((p) => pow(p.x, 2)));
//    let x3 = _sum(points.map((p) => pow(p.x, 3)));
//    let x4 = _sum(points.map((p) => pow(p.x, 4)));
//
//    let y = _sum(points.map((p) => p.y));
//    let xy = _sum(points.map((p) => p.x * p.y));
//    let x2y = _sum(points.map((p) => pow(p.x, 2) * p.y));
//
//    let a11 = x0;
//    let a12 = x1;
//    let a13 = x2;
//    let a21 = x1;
//    let a22 = x2;
//    let a23 = x3;
//    let a31 = x2;
//    let a32 = x3;
//    let a33 = x4;
//
//    let det = a11*a22*a33 + a21*a32*a13 + a31*a12*a23 - a11*a32*a23 - a31*a22*a13 - a21*a12*a33;
//    if (det == 0)
//      return null;
//
//    return new SecondOrderPolynomialCurve(a, b, c, 0.0, 0.0);
//  }
//
//  double calcY(double x) => a + b * x + c * pow(x, 2);
//}

// y = a*10^(bx)
export class ExponentialCurve extends RegCurve {
	a:number;
	b:number;

	constructor(a:number, b:number, minX:number, maxX:number) {
		super(minX, maxX);
		this.a = a;
		this.b = b;
	}

	calcX(y:number):number {
		return _log10(y / this.a) / this.b;
	}

	calcY(x:number):number {
		return this.a * Math.pow(10, this.b * x);
	}
}

// y = a*log(x)+b
export class LogCurve extends RegCurve {
	a:number;
	b:number;

	constructor(a:number, b:number, minX:number, maxX:number) {
		super(minX, maxX);
		this.a = a;
		this.b = b;
	}

	static fromPoints(points:Array<Vector2>):LogCurve {
		let minX = points.map((p) => p.x).reduce((prev, curr) => Math.min(prev, curr));
		let maxX = points.map((p) => p.x).reduce((prev, curr) => Math.max(prev, curr));
		let aList:Array<number> = [];
		for (var i = 0; i < points.length - 1; i++)
			aList.push((points[i + 1].y - points[i].y) /
				(_log10(points[i + 1].x) - _log10(points[i].x)));
		let aAverage = _sum(aList) / aList.length;

		let bList:Array<number> = [];
		for (var i = 0; i < points.length; i++)
			bList.push(points[i].y - (aAverage * _log10(points[i].x)));
		let bAverage = _sum(bList) / bList.length;

		return new LogCurve(aAverage, bAverage, minX, maxX);
	}

	calcX(y:number):number {
		return Math.pow(10, (y - this.b) / this.a);
	}

	calcY(x:number):number {
		return this.a * _log10(x) + this.b;
	}
}

const _log10 = (x:number):number => Math.log(x) / Math.LN10;
const _sum = (iterable:Array<number>):number => iterable.reduce((a, b) => a + b, 0.0);
