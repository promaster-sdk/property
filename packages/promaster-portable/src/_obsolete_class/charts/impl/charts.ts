import {
	AbstractImageBuilder,
	AbstractColors,
	AbstractFontWeight,
	GrowthDirection,
	TextAlignment,
	AbstractColor} from "../../abstract_image";
import {ChartGenerator} from "../functions";
import {IAxis, ChartCurve, ChartPoint, ChartArea, LabelPosition} from "../types";

export const generateChart:ChartGenerator = (width:number, height:number, marginX:number, marginY:number,
																			xAxis:IAxis, yAxis:IAxis, curves:Array<ChartCurve>, dutyPoints:Array<ChartPoint>,
																			areas:Array<ChartArea>) => {

	let builder = AbstractImageBuilder.create();
	builder.backgroundColor = AbstractColors.White;
	builder.width = width;
	builder.height = height;

	let xMin = marginX;
	let xMax = width - marginX;
	let yMin = marginY;
	let yMax = height - marginY;

	_generateAreaFills(builder, xMin, xMax, yMin, yMax, xAxis, yAxis, areas);
	_generateChartAxes(builder, xMin, xMax, yMin, yMax);
	_generateChartLabels(builder, xMin, xMax, yMin, yMax, xAxis.name, yAxis.name);
	_generateXAxisSteppingLines(builder, xMin, xMax, yMin, yMax, xAxis);
	_generateYAxisSteppingLines(builder, xMin, xMax, yMin, yMax, yAxis);
	_generateCurves(builder, xMin, xMax, yMin, yMax, xAxis, yAxis, curves);
	_generateAreaTexts(builder, xMin, xMax, yMin, yMax, xAxis, yAxis, areas);

	_generateDutyPoints(builder, xMin, xMax, yMin, yMax, xAxis, yAxis, dutyPoints);

	return builder.build();
};

function _generateDutyPoints(builder:AbstractImageBuilder, xMin:number, xMax:number, yMin:number, yMax:number,
														 xAxis:IAxis, yAxis:IAxis, dutyPoints:Array<ChartPoint>):void {
	let xPixels = xMax - xMin;
	let yPixels = yMax - yMin;
	for (let dutyPoint of dutyPoints) {
		let x = xMin + xAxis.axisValueToPixelValue(xPixels, dutyPoint.point.x);
		let y = yMax - yAxis.axisValueToPixelValue(yPixels, dutyPoint.point.y);
		builder.addEllipse(x - 3.0, y - 3.0, 6.0, 6.0, AbstractColors.Black, 1.0, dutyPoint.color);
		if (dutyPoint.label != null)
			builder.addText(x + 3.0, y + 3.0, dutyPoint.label, "Arial", 12, AbstractColors.Black, AbstractFontWeight.Normal, 0.0, TextAlignment.Right, GrowthDirection.Right, GrowthDirection.Down, 3.0, AbstractColors.White);
	}
}

function _generateAreaFills(builder:AbstractImageBuilder, xMin:number, xMax:number, yMin:number, yMax:number,
														xAxis:IAxis, yAxis:IAxis, areas:Array<ChartArea>):void {
	let xPixels = xMax - xMin;
	let yPixels = yMax - yMin;
	for (let area of areas) {
		let areaXMin = xMin + xAxis.axisValueToPixelValue(xPixels, area.min.x);
		let areaYMin = yMax - yAxis.axisValueToPixelValue(yPixels, area.max.y);
		let areaXMax = xMin + xAxis.axisValueToPixelValue(xPixels, area.max.x);
		let areaYMax = yMax - yAxis.axisValueToPixelValue(yPixels, area.min.y);
		builder.addRectangle(areaXMin, areaYMin, areaXMax - areaXMin, areaYMax - areaYMin, area.color, 0.0, area.color);
	}
}

function _generateAreaTexts(builder:AbstractImageBuilder, xMin:number, xMax:number, yMin:number, yMax:number,
														xAxis:IAxis, yAxis:IAxis, areas:Array<ChartArea>):void {
	let xPixels = xMax - xMin;
	let yPixels = yMax - yMin;
	for (let area of areas) {
		let areaXMin = xMin + xAxis.axisValueToPixelValue(xPixels, area.min.x);
		let areaYMin = yMax - yAxis.axisValueToPixelValue(yPixels, area.max.y);
		if (area.label != null)
			builder.addText(areaXMin + 3.0, areaYMin + 3.0, area.label, "Arial", 12, AbstractColors.Black, AbstractFontWeight.Normal, 0.0, TextAlignment.Right, GrowthDirection.Right, GrowthDirection.Down, 3.0, AbstractColors.White);
	}
}

function _generateCurves(builder:AbstractImageBuilder, xMin:number, xMax:number, yMin:number, yMax:number,
												 xAxis:IAxis, yAxis:IAxis, curves:Array<ChartCurve>) {
	let xPixels = xMax - xMin;
	let yPixels = yMax - yMin;
	for (let curve of curves) {
		let points = curve.points;
		for (let i = 0; i < points.length - 1; ++i) {
			let p1 = points[i];
			let p2 = points[i + 1];
			let x = xMin + xAxis.axisValueToPixelValue(xPixels, p1.x);
			let y = yMax - yAxis.axisValueToPixelValue(yPixels, p1.y);
			let x2 = xMin + xAxis.axisValueToPixelValue(xPixels, p2.x);
			let y2 = yMax - yAxis.axisValueToPixelValue(yPixels, p2.y);
			builder.addLine(x, y, x2, y2, curve.color, curve.thickness);
		}

		if (curve.label != null && points.length != 0) {
			let position = curve.labelPosition == LabelPosition.Start ? points[0] : points[points.length - 1];
			let x = xMin + xAxis.axisValueToPixelValue(xPixels, position.x) + 3.0;
			let y = yMax - yAxis.axisValueToPixelValue(yPixels, position.y) - 3.0;
			builder.addText(x, y, curve.label, "Arial", 12, AbstractColors.Black, AbstractFontWeight.Normal, 0.0, TextAlignment.Left, GrowthDirection.Right, GrowthDirection.Up, 3.0, AbstractColors.White);
		}
	}
}

// Generates a bounding box
function _generateChartAxes(builder:AbstractImageBuilder, xMin:number, xMax:number, yMin:number, yMax:number):void {
	let boundsColor:AbstractColor = AbstractColors.Black;
	builder.addLine(xMin, yMin, xMax, yMin, boundsColor, 2.0);
	builder.addLine(xMin, yMax, xMax, yMax, boundsColor, 2.0);
	builder.addLine(xMin, yMin, xMin, yMax, boundsColor, 2.0);
	builder.addLine(xMax, yMin, xMax, yMax, boundsColor, 2.0);
}

function _generateChartLabels(builder:AbstractImageBuilder, xMin:number, xMax:number, yMin:number, yMax:number,
															xLabel:string, yLabel:string):void {
	// X-axis
	let x1 = (xMin + xMax) * 0.5;
	let y1 = yMax + yMin;
	builder.addText(x1, y1, xLabel, "Arial", 12, AbstractColors.Black, AbstractFontWeight.Normal, 0.0, TextAlignment.Center, GrowthDirection.Uniform, GrowthDirection.Up);

	// Y-axis
	let x2 = 0.0;
	let y2 = (yMin + yMax) * 0.5;
	builder.addText(x2, y2, yLabel, "Arial", 12, AbstractColors.Black, AbstractFontWeight.Normal, -90.0, TextAlignment.Center, GrowthDirection.Uniform, GrowthDirection.Down);
}

function _generateXAxisSteppingLines(builder:AbstractImageBuilder, xMin:number, xMax:number, yMin:number, yMax:number, xAxis:IAxis):void {

	let lineValues = xAxis.lines;
	let labelValues = xAxis.labels;
	let xPixels = xMax - xMin;
	for (let scaleLineValue of lineValues) {
		if (scaleLineValue >= xAxis.minVal && scaleLineValue <= xAxis.maxVal) {
			// Adds vertical line in the diagram
			let x = xMin + xAxis.axisValueToPixelValue(xPixels, scaleLineValue);
			builder.addLine(x, yMin, x, yMax, AbstractColors.Gray, 1.0);

			if (labelValues.indexOf(scaleLineValue) != -1) {
				// Adds label under the line
				builder.addText(x, yMax + 3, scaleLineValue.toString(), "Arial", 12, AbstractColors.Black, AbstractFontWeight.Normal, 0.0, TextAlignment.Center, GrowthDirection.Uniform, GrowthDirection.Down);
			}
		}
	}
}

function _generateYAxisSteppingLines(builder:AbstractImageBuilder, xMin:number, xMax:number, yMin:number, yMax:number, yAxis:IAxis):void {

	let lineValues = yAxis.lines;
	let labelValues = yAxis.labels;
	let yPixels = yMax - yMin;
	for (let scaleLineValue of lineValues) {
		if (scaleLineValue >= yAxis.minVal && scaleLineValue <= yAxis.maxVal) {
			// Adds vertical line in the diagram
			let y = yMax - yAxis.axisValueToPixelValue(yPixels, scaleLineValue);
			builder.addLine(xMin, y, xMax, y, AbstractColors.Gray, 1.0);

			if (labelValues.indexOf(scaleLineValue) != -1) {
				// Adds label under the line
				builder.addText(xMin - 3, y, scaleLineValue.toString(), "Arial", 12, AbstractColors.Black, AbstractFontWeight.Normal, 0.0, TextAlignment.Center, GrowthDirection.Left, GrowthDirection.Uniform);
			}
		}
	}
}

/*function _generateLineValues():Array<number> {
	let values = [];
	for (let p = -2; p < 5; ++p) {
		for (let i = 1; i <= 10; ++i) {
			values.push(i * Math.pow(10.0, p));
		}
	}
	return values;
}

function _generateLabelValues():Array<number> {
	let values = [];
	for (let p = -2; p < 5; ++p) {
		values.push(Math.pow(10.0, p));
	}
	return values;
}*/
