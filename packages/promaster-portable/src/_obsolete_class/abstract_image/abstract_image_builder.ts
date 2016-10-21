import {
	AbstractImageRoot,
	AbstractPoint,
	AbstractComponent,
	TextComponent,
	AbstractFontWeight,
	AbstractColors,
	AbstractColor,
	TextAlignment,
	GrowthDirection,
	BitmapImageComponent,
	LineComponent,
	AbstractSize,
	EllipseComponent,
	RectangleComponent,
	PolygonComponent,
	VectorImageComponent
} from './model/index';
import {MeasureImage} from './functions';

export class AbstractImageBuilder {

  _components:Array<AbstractComponent> = [];
  width:number;
  height:number;
  backgroundColor:AbstractColor;

  static create():AbstractImageBuilder {
    return new AbstractImageBuilder(0.0, 0.0, AbstractColors.Transparent);
  }

  static createFromWidthHeight(width:number, height:number):AbstractImageBuilder {
    return new AbstractImageBuilder(width, height, AbstractColors.Transparent);
  }

  constructor(width:number, height:number, backgroundColor:AbstractColor) {
    this.width = width;
    this.height = height;
    this.backgroundColor = backgroundColor;
  }

  addText(x:number, y:number, text:string, fontFamily:string, fontSize:number, textColor:AbstractColor,
          fontWeight:AbstractFontWeight,
          clockwiseRotationDegrees:number = 0.0, textAlignment:TextAlignment = TextAlignment.Left,
          horizontalGrowthDirection:GrowthDirection = GrowthDirection.Right,
          verticalGrowthDirection:GrowthDirection = GrowthDirection.Down, strokeThickness:number = 0.0, strokeColor:AbstractColor = AbstractColors.Black):void {
    this._components.push(new TextComponent(new AbstractPoint(x, y), text, fontFamily, fontSize, textColor,
      fontWeight, clockwiseRotationDegrees, textAlignment, horizontalGrowthDirection,
      verticalGrowthDirection, strokeThickness, strokeColor));
  }

  addBitmapImage(format:string, data:Uint8Array):void {
    this._components.push(new BitmapImageComponent(new AbstractPoint(0.0, 0.0), format, data));
  }

	addVectorImage(rootComponent:AbstractComponent):void {
		this._components.push(new VectorImageComponent(new AbstractPoint(0.0, 0.0), rootComponent));
	}

	addImageXY(x:number, y:number, format:string, data:Uint8Array):void {
    this._components.push(new BitmapImageComponent(new AbstractPoint(x, y), format, data));
  }

  addLine(x:number, y:number, x2:number, y2:number, strokeColor:AbstractColor, strokeThickness:number):void {
    this._components.push(new LineComponent(new AbstractPoint(x, y), new AbstractPoint(x2, y2), strokeColor, strokeThickness));
  }

  addEllipse(x:number, y:number, width:number, height:number, strokeColor:AbstractColor, strokeThickness:number, fillColor:AbstractColor):void {
    this._components.push(new EllipseComponent(new AbstractPoint(x, y), new AbstractSize(width, height), strokeColor, strokeThickness, fillColor));
  }

  addRectangle(x:number, y:number, width:number, height:number, strokeColor:AbstractColor, strokeThickness:number, fillColor:AbstractColor):void {
    this._components.push(new RectangleComponent(new AbstractPoint(x, y), new AbstractSize(width, height), strokeColor, strokeThickness, fillColor));
  }

  addPolygon(points:Array<AbstractPoint>, strokeColor:AbstractColor, strokeThickness:number, fillColor:AbstractColor):void {
    this._components.push(new PolygonComponent(points, strokeColor, strokeThickness, fillColor));
  }

  addPolyLine(points:Array<AbstractPoint>, strokeColor:AbstractColor, strokeThickness:number):void {
    if (points.length == 0)
      return;
    var previous = points[0];
    for (let p of points) {
      this._components.push(new LineComponent(previous, p, strokeColor, strokeThickness));
      previous = p;
    }
  }

  addAbstractImage(x:number, y:number, image:AbstractImageRoot):void {
    this._components.push(new AbstractImageRoot(new AbstractPoint(x, y), image.size, image.backgroundColor, image.components));
  }

  build():AbstractImageRoot {
    var immutableClone = this._components.slice();
    return new AbstractImageRoot(new AbstractPoint(0.0, 0.0), new AbstractSize(this.width, this.height), this.backgroundColor, immutableClone);
  }

  setSizeToFitContent(measure:MeasureImage):void {
    let maxWidth:number = 0.0;
    let maxHeight:number = 0.0;
    for (let component of this._components) {
      var size = measure(component);
      if (size.width > maxWidth)
        maxWidth = size.width;
      if (size.height > maxHeight)
        maxHeight = size.height;
    }
    this.width = maxWidth;
    this.height = maxHeight;
  }
}
