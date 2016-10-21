"use strict";
var abstract_image_1 = require("../../abstract_image");
var types_1 = require("../types");
exports.generateChart = function (width, height, marginX, marginY, xAxis, yAxis, curves, dutyPoints, areas) {
    var builder = abstract_image_1.AbstractImageBuilder.create();
    builder.backgroundColor = abstract_image_1.AbstractColors.White;
    builder.width = width;
    builder.height = height;
    var xMin = marginX;
    var xMax = width - marginX;
    var yMin = marginY;
    var yMax = height - marginY;
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
function _generateDutyPoints(builder, xMin, xMax, yMin, yMax, xAxis, yAxis, dutyPoints) {
    var xPixels = xMax - xMin;
    var yPixels = yMax - yMin;
    for (var _i = 0, dutyPoints_1 = dutyPoints; _i < dutyPoints_1.length; _i++) {
        var dutyPoint = dutyPoints_1[_i];
        var x = xMin + xAxis.axisValueToPixelValue(xPixels, dutyPoint.point.x);
        var y = yMax - yAxis.axisValueToPixelValue(yPixels, dutyPoint.point.y);
        builder.addEllipse(x - 3.0, y - 3.0, 6.0, 6.0, abstract_image_1.AbstractColors.Black, 1.0, dutyPoint.color);
        if (dutyPoint.label != null)
            builder.addText(x + 3.0, y + 3.0, dutyPoint.label, "Arial", 12, abstract_image_1.AbstractColors.Black, abstract_image_1.AbstractFontWeight.Normal, 0.0, abstract_image_1.TextAlignment.Right, abstract_image_1.GrowthDirection.Right, abstract_image_1.GrowthDirection.Down, 3.0, abstract_image_1.AbstractColors.White);
    }
}
function _generateAreaFills(builder, xMin, xMax, yMin, yMax, xAxis, yAxis, areas) {
    var xPixels = xMax - xMin;
    var yPixels = yMax - yMin;
    for (var _i = 0, areas_1 = areas; _i < areas_1.length; _i++) {
        var area = areas_1[_i];
        var areaXMin = xMin + xAxis.axisValueToPixelValue(xPixels, area.min.x);
        var areaYMin = yMax - yAxis.axisValueToPixelValue(yPixels, area.max.y);
        var areaXMax = xMin + xAxis.axisValueToPixelValue(xPixels, area.max.x);
        var areaYMax = yMax - yAxis.axisValueToPixelValue(yPixels, area.min.y);
        builder.addRectangle(areaXMin, areaYMin, areaXMax - areaXMin, areaYMax - areaYMin, area.color, 0.0, area.color);
    }
}
function _generateAreaTexts(builder, xMin, xMax, yMin, yMax, xAxis, yAxis, areas) {
    var xPixels = xMax - xMin;
    var yPixels = yMax - yMin;
    for (var _i = 0, areas_2 = areas; _i < areas_2.length; _i++) {
        var area = areas_2[_i];
        var areaXMin = xMin + xAxis.axisValueToPixelValue(xPixels, area.min.x);
        var areaYMin = yMax - yAxis.axisValueToPixelValue(yPixels, area.max.y);
        if (area.label != null)
            builder.addText(areaXMin + 3.0, areaYMin + 3.0, area.label, "Arial", 12, abstract_image_1.AbstractColors.Black, abstract_image_1.AbstractFontWeight.Normal, 0.0, abstract_image_1.TextAlignment.Right, abstract_image_1.GrowthDirection.Right, abstract_image_1.GrowthDirection.Down, 3.0, abstract_image_1.AbstractColors.White);
    }
}
function _generateCurves(builder, xMin, xMax, yMin, yMax, xAxis, yAxis, curves) {
    var xPixels = xMax - xMin;
    var yPixels = yMax - yMin;
    for (var _i = 0, curves_1 = curves; _i < curves_1.length; _i++) {
        var curve = curves_1[_i];
        var points = curve.points;
        for (var i = 0; i < points.length - 1; ++i) {
            var p1 = points[i];
            var p2 = points[i + 1];
            var x = xMin + xAxis.axisValueToPixelValue(xPixels, p1.x);
            var y = yMax - yAxis.axisValueToPixelValue(yPixels, p1.y);
            var x2 = xMin + xAxis.axisValueToPixelValue(xPixels, p2.x);
            var y2 = yMax - yAxis.axisValueToPixelValue(yPixels, p2.y);
            builder.addLine(x, y, x2, y2, curve.color, curve.thickness);
        }
        if (curve.label != null && points.length != 0) {
            var position = curve.labelPosition == types_1.LabelPosition.Start ? points[0] : points[points.length - 1];
            var x = xMin + xAxis.axisValueToPixelValue(xPixels, position.x) + 3.0;
            var y = yMax - yAxis.axisValueToPixelValue(yPixels, position.y) - 3.0;
            builder.addText(x, y, curve.label, "Arial", 12, abstract_image_1.AbstractColors.Black, abstract_image_1.AbstractFontWeight.Normal, 0.0, abstract_image_1.TextAlignment.Left, abstract_image_1.GrowthDirection.Right, abstract_image_1.GrowthDirection.Up, 3.0, abstract_image_1.AbstractColors.White);
        }
    }
}
// Generates a bounding box
function _generateChartAxes(builder, xMin, xMax, yMin, yMax) {
    var boundsColor = abstract_image_1.AbstractColors.Black;
    builder.addLine(xMin, yMin, xMax, yMin, boundsColor, 2.0);
    builder.addLine(xMin, yMax, xMax, yMax, boundsColor, 2.0);
    builder.addLine(xMin, yMin, xMin, yMax, boundsColor, 2.0);
    builder.addLine(xMax, yMin, xMax, yMax, boundsColor, 2.0);
}
function _generateChartLabels(builder, xMin, xMax, yMin, yMax, xLabel, yLabel) {
    // X-axis
    var x1 = (xMin + xMax) * 0.5;
    var y1 = yMax + yMin;
    builder.addText(x1, y1, xLabel, "Arial", 12, abstract_image_1.AbstractColors.Black, abstract_image_1.AbstractFontWeight.Normal, 0.0, abstract_image_1.TextAlignment.Center, abstract_image_1.GrowthDirection.Uniform, abstract_image_1.GrowthDirection.Up);
    // Y-axis
    var x2 = 0.0;
    var y2 = (yMin + yMax) * 0.5;
    builder.addText(x2, y2, yLabel, "Arial", 12, abstract_image_1.AbstractColors.Black, abstract_image_1.AbstractFontWeight.Normal, -90.0, abstract_image_1.TextAlignment.Center, abstract_image_1.GrowthDirection.Uniform, abstract_image_1.GrowthDirection.Down);
}
function _generateXAxisSteppingLines(builder, xMin, xMax, yMin, yMax, xAxis) {
    var lineValues = xAxis.lines;
    var labelValues = xAxis.labels;
    var xPixels = xMax - xMin;
    for (var _i = 0, lineValues_1 = lineValues; _i < lineValues_1.length; _i++) {
        var scaleLineValue = lineValues_1[_i];
        if (scaleLineValue >= xAxis.minVal && scaleLineValue <= xAxis.maxVal) {
            // Adds vertical line in the diagram
            var x = xMin + xAxis.axisValueToPixelValue(xPixels, scaleLineValue);
            builder.addLine(x, yMin, x, yMax, abstract_image_1.AbstractColors.Gray, 1.0);
            if (labelValues.indexOf(scaleLineValue) != -1) {
                // Adds label under the line
                builder.addText(x, yMax + 3, scaleLineValue.toString(), "Arial", 12, abstract_image_1.AbstractColors.Black, abstract_image_1.AbstractFontWeight.Normal, 0.0, abstract_image_1.TextAlignment.Center, abstract_image_1.GrowthDirection.Uniform, abstract_image_1.GrowthDirection.Down);
            }
        }
    }
}
function _generateYAxisSteppingLines(builder, xMin, xMax, yMin, yMax, yAxis) {
    var lineValues = yAxis.lines;
    var labelValues = yAxis.labels;
    var yPixels = yMax - yMin;
    for (var _i = 0, lineValues_2 = lineValues; _i < lineValues_2.length; _i++) {
        var scaleLineValue = lineValues_2[_i];
        if (scaleLineValue >= yAxis.minVal && scaleLineValue <= yAxis.maxVal) {
            // Adds vertical line in the diagram
            var y = yMax - yAxis.axisValueToPixelValue(yPixels, scaleLineValue);
            builder.addLine(xMin, y, xMax, y, abstract_image_1.AbstractColors.Gray, 1.0);
            if (labelValues.indexOf(scaleLineValue) != -1) {
                // Adds label under the line
                builder.addText(xMin - 3, y, scaleLineValue.toString(), "Arial", 12, abstract_image_1.AbstractColors.Black, abstract_image_1.AbstractFontWeight.Normal, 0.0, abstract_image_1.TextAlignment.Center, abstract_image_1.GrowthDirection.Left, abstract_image_1.GrowthDirection.Uniform);
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
//# sourceMappingURL=charts.js.map