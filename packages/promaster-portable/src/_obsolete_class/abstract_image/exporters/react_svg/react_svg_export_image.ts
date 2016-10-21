import {DOM} from 'react';
import * as Uuid from 'node-uuid';
import {
	AbstractImageRoot,
	BitmapImageComponent,
	LineComponent,
	TextComponent,
	EllipseComponent,
	PolygonComponent,
	RectangleComponent,
	AbstractComponent,
	AbstractSize,
	AbstractFontWeight,
	AbstractColor,
	GrowthDirection,
	RenderedImage,
	VectorImageComponent
} from "../../model/index";
import {ExportImage} from "../../functions";
import {getTextAnchor, colorToRgb, getBaselineAdjustment} from "../svgHelpers";

export const reactSvgExportImage:ExportImage =
	(root:AbstractImageRoot, scale:number = 1.0):RenderedImage => {

		let svg = render_react(root);
		return new RenderedImage("react_svg", svg);
	};

function render_react(image:AbstractImageRoot):any {
	return DOM.svg(
		{
			"key": Uuid.v1().toString(),
			"viewBox": [
				0,
				0,
				image.size.width,
				image.size.height
			].join(' ')
		},
		// Keeps the lines from scaling.
		DOM.style({}, `
			* {
				vector-effect: non-scaling-stroke;
			}
		`),
		_flatMap(image.components, (c) => _visit(c))
	);
}

function _flatMap(array, lambda) {
	return Array.prototype.concat.apply([], array.map(lambda));
}

function _visit(c_in:any):Array<any> {

	if (c_in instanceof AbstractImageRoot) {
		return [];
	}

	if (c_in instanceof BitmapImageComponent) {
		return [];
	}

	if (c_in instanceof VectorImageComponent) {
		throw "TODO!";
	}

	if (c_in instanceof LineComponent) {
		let c:LineComponent = c_in;
		return [DOM.line(<any>{
			"x1": c.start.x.toString(),
			"y1": c.start.y.toString(),
			"x2": c.end.x.toString(),
			"y2": c.end.y.toString(),
			"stroke": colorToRgb(c.strokeColor),
			"strokeWidth": c.strokeThickness.toString()
		})];

	}

	if (c_in instanceof TextComponent) {
		let c:TextComponent = c_in;

		let shadowStyle = {
			textAnchor: getTextAnchor(c.horizontalGrowthDirection),
			fontSize: c.fontSize.toString() + "px",
			fontWeight: c.fontWeight == AbstractFontWeight.Bold ? "bold" : "normal",
			fontFamily: c.fontFamily,
			stroke: colorToRgb(c.strokeColor),
			strokeWidth: c.strokeThickness.toString() + "px"
		};
		let style: any = {
			textAnchor: getTextAnchor(c.horizontalGrowthDirection),
			fontSize: c.fontSize.toString() + "px",
			fontWeight: c.fontWeight == AbstractFontWeight.Bold ? "bold" : "normal",
			fontFamily: c.fontFamily,
			fill: colorToRgb(c.textColor),
		};
		let dy = getBaselineAdjustment(c.verticalGrowthDirection);

		let transform = "rotate(" + c.clockwiseRotationDegrees.toString() + " " + c.position.x.toString() + "," + c.position.y.toString() + ")";

		let lines:Array<string> = c.text != null ? c.text.split('\n') : [];
		let tSpans = lines.map((t) => DOM.tspan({
			x: c.position.x.toString(),
			y: c.position.y.toString(),
			dy: (dy + lines.indexOf(t)).toString() + "em",
			transform: transform
		}, t));
		let cs = [];
		if (c.strokeThickness > 0 && c.strokeColor != null)
			cs.push(DOM.text(<any>{
				"x": c.position.x.toString(),
				"y": c.position.y.toString(),
				"dy": dy.toString() + "em",
				"style": shadowStyle,
				"transform": transform
			}, tSpans));
		cs.push(DOM.text({
			"x": c.position.x.toString(),
			"y": c.position.y.toString(),
			"dy": dy.toString() + "em",
			"style": style,
			"transform": transform
		}, tSpans));
		return cs;
	}

	if (c_in instanceof EllipseComponent) {
		let c:EllipseComponent = c_in;
		let rx = c.size.width * 0.5;
		let ry = c.size.width * 0.5;
		let cx = c.topLeft.x + rx;
		let cy = c.topLeft.y + ry;
		//return [DOM.ellipse({
		//  cx: cx.toString(),
		//  cy: cy.toString(),
		//  rx: rx.toString(),
		//  ry: ry.toString(),
		//  style: style
		//})];
		return [DOM.ellipse({
			cx: cx.toString(),
			cy: cy.toString(),
			rx: rx.toString(),
			ry: ry.toString(),
			stroke: colorToRgb(c.strokeColor),
			strokeWidth: c.strokeThickness.toString(),
			fill: colorToRgb(c.fillColor)
		})];
	}

	if (c_in instanceof PolygonComponent) {
		let c:PolygonComponent = c_in;
		let points = c.points.map((p) => p.x.toString() + "," + p.y.toString()).join(' ');
		//return [DOM.polygon({points: points, style: style})];
		return [DOM.polygon({
			points: points,
			stroke: colorToRgb(c.strokeColor),
			strokeWidth: c.strokeThickness.toString(),
			fill: colorToRgb(c.fillColor)
		})];
	}

	if (c_in instanceof RectangleComponent) {
		let c:RectangleComponent = c_in;
		//return [DOM.rect({
		//  x: c.topLeft.x.toString(),
		//  y: c.topLeft.y.toString(),
		//  width: c.size.width.toString(),
		//  height: c.size.height.toString(),
		//  style: style
		//})];
		return [DOM.rect({
			x: c.topLeft.x.toString(),
			y: c.topLeft.y.toString(),
			width: c.size.width.toString(),
			height: c.size.height.toString(),
			stroke: colorToRgb(c.strokeColor),
			strokeWidth: c.strokeThickness.toString(),
			fill: colorToRgb(c.fillColor)
		})];
	}

	return [];
}

