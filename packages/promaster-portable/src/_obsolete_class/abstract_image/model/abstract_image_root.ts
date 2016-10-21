import { AbstractSize } from  './abstract_size';
import { AbstractComponent} from  './abstract_component';
import { AbstractColor, AbstractColors } from  './abstract_color';
import { BitmapImageComponent } from  './bitmap_image_component';
import {AbstractPoint} from "./abstract_point";

export class AbstractImageRoot extends AbstractComponent {

	private _topLeft:AbstractPoint;
	private _size:AbstractSize;
	private _backgroundColor:AbstractColor;
	private _components:Array<AbstractComponent>;

	// Factory method
	static  fromSingleImage(format:string, data:Uint8Array, width:number, height:number):AbstractImageRoot {
		let root = new AbstractImageRoot(new AbstractPoint(0.0, 0.0), new AbstractSize(width, height), AbstractColors.Transparent,
			[new BitmapImageComponent(new AbstractPoint(0.0, 0.0), format, data)]);
		return root;
	}

	constructor(topLeft, size, backgroundColor, components) {
		super();
		this._topLeft = topLeft;
		this._size = size;
		this._backgroundColor = backgroundColor;
		this._components = components;
	}

	get topLeft():AbstractPoint {
		return this._topLeft;
	}

	get size():AbstractSize {
		return this._size;
	}

	get backgroundColor():AbstractColor {
		return this._backgroundColor;
	}

	get components():Array<AbstractComponent> {
		return this._components;
	}

}

