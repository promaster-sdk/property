import {AbstractColor} from "../abstract_image";

export class Vector2D {
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
}

export enum LabelPosition {
  Start,
  End
}

export class ChartCurve {
  private _color:AbstractColor ;
  private _label:string ;
  private _labelPosition:LabelPosition ;
  private _thickness:number;
  private _points:Array<Vector2D> ;

	constructor(color:AbstractColor, label:string, labelPosition:LabelPosition, thickness:number, points:Array<Vector2D>) {
		this._color = color;
		this._label = label;
		this._labelPosition = labelPosition;
		this._thickness = thickness;
		this._points = points;
	}

	get color():AbstractColor{
		return this._color;
	}

	get label():string {
		return this._label;
	}

	get labelPosition():LabelPosition {
		return this._labelPosition;
	}

	get thickness():number {
		return this._thickness;
	}

	get points():Array<Vector2D> {
		return this._points;
	}
}

export class ChartPoint {
  private _color:AbstractColor ;
  private _label:string ;
  private _point:Vector2D ;

	constructor(color:AbstractColor, label:string, point:Vector2D) {
		this._color = color;
		this._label = label;
		this._point = point;
	}

	get color():AbstractColor{
		return this._color;
	}

	get label():string {
		return this._label;
	}

	get point():Vector2D {
		return this._point;
	}
}

export class ChartArea {
  private _color:AbstractColor ;
  private _label:string ;
  private _min:Vector2D ;
  private _max:Vector2D ;

	constructor(color:AbstractColor, label:string, min:Vector2D, max:Vector2D) {
		this._color = color;
		this._label = label;
		this._min = min;
		this._max = max;
	}

	get color():AbstractColor{
		return this._color;
	}

	get label():string {
		return this._label;
	}

	get min():Vector2D {
		return this._min;
	}

	get max():Vector2D {
		return this._max;
	}
}

export abstract class IAxis {

	private _name: string;
	private _minVal: number;
	private _maxVal: number;
	private _lines: Array<number>;
	private _labels: Array<number>;


	constructor(name: string, minVal: number, maxVal: number, lines: Array<number>, labels: Array<number>) {
		this._name = name;
		this._minVal = minVal;
		this._maxVal = maxVal;
		this._lines = lines;
		this._labels = labels;
	}

	get name():string {
		return this._name;
	}

	get minVal():number {
		return this._minVal;
	}

	get maxVal():number {
		return this._maxVal;
	}

	get lines(): Array<number> {
		return this._lines;
	}

	get labels(): Array<number> {
		return this._labels;
	}

	abstract axisValueToPixelValue(pixelLength:number, axisValue:number) : number;
}

export class LinearAxis extends IAxis {

  constructor (name:string , minVal:number, maxVal:number, lines: Array<number>, labels: Array<number>)  {
		super(name, minVal, maxVal, lines, labels)
	}

  axisValueToPixelValue(pixelLength:number, axisValue:number):number {
    let x = pixelLength * ((axisValue - this.minVal) / (this.maxVal - this.minVal));
    return x;
  }
}

export class LogAxis extends IAxis {

	constructor(name:string , minVal:number, maxVal:number, lines: Array<number>, labels: Array<number>)  {
		super(name, minVal, maxVal, lines, labels);
    if (minVal <= 0)
      throw new Error("Min value for logarithmic axis cannot be <= 0");
    if (maxVal <= 0)
      throw new Error("Max value for logarithmic axis cannot be <= 0");
  }

   axisValueToPixelValue(pixelLength:number, value:number):number {
    if (value > 0) {
      let pixelValue = pixelLength * (LogAxis._log10(value) - LogAxis._log10(this.minVal))
				/ (LogAxis._log10(this.maxVal) - LogAxis._log10(this.minVal));
      return pixelValue;
    }
    else if (value < 0) {
      return 0.0;
    }
    else {
      /*==0*/
      return 0.0;
    }
  }

  static _log10(x:number) :number {
    return Math.log(x) / Math.LN10;
  }

}
