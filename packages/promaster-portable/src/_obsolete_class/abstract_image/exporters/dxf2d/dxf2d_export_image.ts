import {AbstractSize,
	AbstractComponent,
	AbstractImageRoot,
	BitmapImageComponent,
	TextComponent,
	LineComponent,
	GrowthDirection,
	EllipseComponent,
	PolygonComponent,
	RectangleComponent,
	VectorImageComponent,
	RenderedImage
} from "../../index";
import {ExportImage} from "../../functions";

export const dxf2dExportImage : ExportImage =
	(root:AbstractImageRoot, scale:number = 1.0):RenderedImage => {

	let builder:string = "";
	let height:number = root.size.height;
	let layer:number = 0;

	builder += "999\nELIGO DXF GENERATOR\n";
	builder += "0\nSECTION\n2\nHEADER\n";
	builder += "9\n\$ACADVER\n1\nAC1009\n9\n\$INSBASE\n10\n0.0\n20\n0.0\n30\n0.0\n";
	builder += "9\n\$EXTMIN\n10\n0.0\n20\n0.0\n";
	builder += "9\n\$EXTMAX\n";
	builder += "10\n" + root.size.width.toString() + "\n";
	builder += "20\n" + root.size.height.toString() + "\n";
	builder += "0\nENDSEC\n";
	builder += "0\nSECTION\n2\nENTITIES\n";

	for (let component of root.components)
		_visit(component, builder, layer, height);

	builder += "0\nENDSEC\n0\nEOF";

	return new RenderedImage("DXF", builder);
};

function _visit(c_in:any, builder:string, layer:number, height:number):void {

	if (c_in instanceof AbstractImageRoot) {
		let c:AbstractImageRoot = c_in;
		for (let component of c.components)
			_visit(component, builder, layer, height);
	}

	if (c_in instanceof BitmapImageComponent) {
		//let c:BitmapImageComponent = c_in;
		//let importer = imageImporterFactory(c.format);
		//if (importer == null)
		//	return;
		//let subImage = importer(c.data);
		//_visit(subImage, builder, layer, height);
		// Cannot include bitmaps in dxf output?
		return;
	}

	if (c_in instanceof VectorImageComponent) {
		throw "TODO!";
	}

	if (c_in instanceof LineComponent) {
		let c:LineComponent = c_in;
		builder += "0\nLINE\n";
		builder += "8\nLines\n";
		builder += "10\n" + c.start.x.toString() + "\n";
		builder += "20\n" + _invert(c.start.y, height).toString() + "\n";
		builder += "30\n0.0\n";
		builder += "11\n" + c.end.x.toString() + "\n";
		builder += "21\n" + _invert(c.end.y, height).toString() + "\n";
		builder += "31\n0.0\n";
	}

	if (c_in instanceof TextComponent) {
		let c:TextComponent = c_in;
		let horizontalAlignment:number;
		if (c.horizontalGrowthDirection == GrowthDirection.Left)
			horizontalAlignment = 2;
		else if (c.horizontalGrowthDirection == GrowthDirection.Uniform)
			horizontalAlignment = 1;
		else
			horizontalAlignment = 0;

		let verticalAlignment:number;
		if (c.verticalGrowthDirection == GrowthDirection.Up)
			verticalAlignment = 0;
		else if (c.verticalGrowthDirection == GrowthDirection.Uniform)
			verticalAlignment = 2;
		else
			verticalAlignment = 3;

		let fontSize = c.fontSize - 2;

		builder += "0\nTEXT\n";
		builder += "8\nText\n";
		builder += "10\n" + c.position.x.toString() + "\n";
		builder += "20\n" + _invert(c.position.y, height).toString() + "\n";
		builder += "30\n0.0\n";
		builder += "11\n" + c.position.x.toString() + "\n";
		builder += "21\n" + _invert(c.position.y, height).toString() + "\n";
		builder += "31\n0.0\n";
		builder += "40\n" + fontSize.toString() + "\n";
		builder += "1\n" + c.text + "\n";
		builder += "72\n" + horizontalAlignment.toString() + "\n";
		builder += "73\n" + verticalAlignment.toString() + "\n";
	}

	if (c_in instanceof EllipseComponent) {
		let c:EllipseComponent = c_in;
		layer++;

		builder += "0\nPOLYLINE\n";
		builder += "8\n" + layer.toString() + "\n";
		builder += "66\n" + "1" + "\n";

		let r1 = c.size.width / 2.0;
		let r2 = c.size.height / 2.0;
		const numPoints:number = 32;

//      for (let t in Enumerable.Range(0, numPoints).Select(i => 2.0 * PI * i / numPoints))

		let mylist:Array<number> = [];
		for (let i:number = 0; i <= numPoints; i++) {
			mylist.push(2 * Math.PI * i / numPoints);
		}

		for (let t of mylist) {
			let x = c.topLeft.x + r1 + r1 * Math.cos(t);
			let y = c.topLeft.y + r2 + r2 * Math.sin(t);
			builder += "0\nVERTEX\n";
			builder += "8\n" + layer.toString() + "\n";
			builder += "10\n" + x.toString() + "\n";
			builder += "20\n" + _invert(y, height).toString() + "\n";
			builder += "30\n0.0\n";
		}
		builder += "0\nSEQEND\n";
		builder += "8\n" + layer.toString() + "\n";
	}


	if (c_in instanceof PolygonComponent) {
		let c:PolygonComponent = c_in;

		builder += "0\nPOLYLINE\n";
		builder += "8\n" + layer.toString() + "\n";
		builder += "66\n" + "1" + "\n";
//      for (let point in c.points.concat(c.points.take(1)))
//      for (let point of concat([c.points, c.points.take(1)])) {
		for (let point of c.points.concat(c.points[0])) {
			builder += "0\nVERTEX\n";
			builder += "8\n" + layer.toString() + "\n";
			builder += "10\n" + point.x.toString() + "\n";
			builder += "20\n" + _invert(point.y, height).toString() + "\n";
			builder += "30\n0.0\n";
		}
		builder += "0\nSEQEND\n";
		builder += "8\n" + layer.toString() + "\n";
	}

	if (c_in instanceof RectangleComponent) {
		let c:RectangleComponent = c_in;

		builder += "0\nPOLYLINE\n";
		builder += "8\n" + layer.toString() + "\n";
		builder += "66\n" + "1" + "\n";
		let corners = c.corners();
//      for (let point in c.Corners().Concat(c.Corners().Take(1))) {
//      for (let point of concat([corners, corners.take(1)])) {
		for (let point of corners.concat(corners[0])) {
			builder += "0\nVERTEX\n";
			builder += "8\n" + layer.toString() + "\n";
			builder += "10\n" + point.x.toString() + "\n";
			builder += "20\n" + _invert(point.y, height).toString() + "\n";
			builder += "30\n0.0\n";
		}
		builder += "0\nSEQEND\n";
		builder += "8\n" + layer.toString() + "\n";
	}

}

function _invert(d:number, height:number):number {
	return height - d;
}


//}
