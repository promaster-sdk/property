import { AbstractComponent } from './abstract_component';
import { AbstractColor } from './abstract_color';
import { AbstractFontWeight } from './abstract_font_weight';
import { AbstractPoint } from './abstract_point';
import { TextAlignment } from './text_alignment';
import { GrowthDirection } from './growth_direction';

export class TextComponent extends AbstractComponent {

	private _position:AbstractPoint;
	private _text:string;
	private _fontFamily:string;
	private _fontSize:number;
	private _textColor:AbstractColor;
	private _fontWeight:AbstractFontWeight;
	private _clockwiseRotationDegrees:number;
	private _textAlignment:TextAlignment;
	private _horizontalGrowthDirection:GrowthDirection;
	private _verticalGrowthDirection:GrowthDirection;
	private _strokeThickness:number;
	private _strokeColor:AbstractColor;

	constructor(position, text, fontFamily, fontSize, textColor, fontWeight, clockwiseRotationDegrees, textAlignment, horizontalGrowthDirection, verticalGrowthDirection,
							strokeThickness, strokeColor) {
		super();
		this._position = position;
		this._text = text;
		this._fontFamily = fontFamily;
		this._fontSize = fontSize;
		this._textColor = textColor;
		this._fontWeight = fontWeight;
		this._clockwiseRotationDegrees = clockwiseRotationDegrees;
		this._textAlignment = textAlignment;
		this._horizontalGrowthDirection = horizontalGrowthDirection;
		this._verticalGrowthDirection = verticalGrowthDirection;
		this._strokeThickness = strokeThickness;
		this._strokeColor = strokeColor;
	}

	get position():AbstractPoint {
		return this._position;
	}

	get text():string {
		return this._text;
	}

	get fontFamily():string {
		return this._fontFamily;
	}

	get fontSize():number {
		return this._fontSize;
	}

	get textColor():AbstractColor {
		return this._textColor;
	}

	get fontWeight():AbstractFontWeight {
		return this._fontWeight;
	}

	get clockwiseRotationDegrees():number {
		return this._clockwiseRotationDegrees;
	}

	get textAlignment():TextAlignment {
		return this._textAlignment;
	}

	get horizontalGrowthDirection():GrowthDirection {
		return this._horizontalGrowthDirection;
	}

	get verticalGrowthDirection():GrowthDirection {
		return this._verticalGrowthDirection;
	}

	get strokeThickness():number {
		return this._strokeThickness;
	}

	get strokeColor():AbstractColor {
		return this._strokeColor;
	}

}
