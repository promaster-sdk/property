"use strict";
var index_1 = require("../../index");
exports.dxf2dExportImage = function (root, scale) {
    if (scale === void 0) { scale = 1.0; }
    var builder = "";
    var height = root.size.height;
    var layer = 0;
    builder += "999\nELIGO DXF GENERATOR\n";
    builder += "0\nSECTION\n2\nHEADER\n";
    builder += "9\n\$ACADVER\n1\nAC1009\n9\n\$INSBASE\n10\n0.0\n20\n0.0\n30\n0.0\n";
    builder += "9\n\$EXTMIN\n10\n0.0\n20\n0.0\n";
    builder += "9\n\$EXTMAX\n";
    builder += "10\n" + root.size.width.toString() + "\n";
    builder += "20\n" + root.size.height.toString() + "\n";
    builder += "0\nENDSEC\n";
    builder += "0\nSECTION\n2\nENTITIES\n";
    for (var _i = 0, _a = root.components; _i < _a.length; _i++) {
        var component = _a[_i];
        _visit(component, builder, layer, height);
    }
    builder += "0\nENDSEC\n0\nEOF";
    return new index_1.RenderedImage("DXF", builder);
};
function _visit(c_in, builder, layer, height) {
    if (c_in instanceof index_1.AbstractImageRoot) {
        var c = c_in;
        for (var _i = 0, _a = c.components; _i < _a.length; _i++) {
            var component = _a[_i];
            _visit(component, builder, layer, height);
        }
    }
    if (c_in instanceof index_1.BitmapImageComponent) {
        //let c:BitmapImageComponent = c_in;
        //let importer = imageImporterFactory(c.format);
        //if (importer == null)
        //	return;
        //let subImage = importer(c.data);
        //_visit(subImage, builder, layer, height);
        // Cannot include bitmaps in dxf output?
        return;
    }
    if (c_in instanceof index_1.VectorImageComponent) {
        throw "TODO!";
    }
    if (c_in instanceof index_1.LineComponent) {
        var c = c_in;
        builder += "0\nLINE\n";
        builder += "8\nLines\n";
        builder += "10\n" + c.start.x.toString() + "\n";
        builder += "20\n" + _invert(c.start.y, height).toString() + "\n";
        builder += "30\n0.0\n";
        builder += "11\n" + c.end.x.toString() + "\n";
        builder += "21\n" + _invert(c.end.y, height).toString() + "\n";
        builder += "31\n0.0\n";
    }
    if (c_in instanceof index_1.TextComponent) {
        var c = c_in;
        var horizontalAlignment = void 0;
        if (c.horizontalGrowthDirection == index_1.GrowthDirection.Left)
            horizontalAlignment = 2;
        else if (c.horizontalGrowthDirection == index_1.GrowthDirection.Uniform)
            horizontalAlignment = 1;
        else
            horizontalAlignment = 0;
        var verticalAlignment = void 0;
        if (c.verticalGrowthDirection == index_1.GrowthDirection.Up)
            verticalAlignment = 0;
        else if (c.verticalGrowthDirection == index_1.GrowthDirection.Uniform)
            verticalAlignment = 2;
        else
            verticalAlignment = 3;
        var fontSize = c.fontSize - 2;
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
    if (c_in instanceof index_1.EllipseComponent) {
        var c = c_in;
        layer++;
        builder += "0\nPOLYLINE\n";
        builder += "8\n" + layer.toString() + "\n";
        builder += "66\n" + "1" + "\n";
        var r1 = c.size.width / 2.0;
        var r2 = c.size.height / 2.0;
        var numPoints = 32;
        //      for (let t in Enumerable.Range(0, numPoints).Select(i => 2.0 * PI * i / numPoints))
        var mylist = [];
        for (var i = 0; i <= numPoints; i++) {
            mylist.push(2 * Math.PI * i / numPoints);
        }
        for (var _b = 0, mylist_1 = mylist; _b < mylist_1.length; _b++) {
            var t = mylist_1[_b];
            var x = c.topLeft.x + r1 + r1 * Math.cos(t);
            var y = c.topLeft.y + r2 + r2 * Math.sin(t);
            builder += "0\nVERTEX\n";
            builder += "8\n" + layer.toString() + "\n";
            builder += "10\n" + x.toString() + "\n";
            builder += "20\n" + _invert(y, height).toString() + "\n";
            builder += "30\n0.0\n";
        }
        builder += "0\nSEQEND\n";
        builder += "8\n" + layer.toString() + "\n";
    }
    if (c_in instanceof index_1.PolygonComponent) {
        var c = c_in;
        builder += "0\nPOLYLINE\n";
        builder += "8\n" + layer.toString() + "\n";
        builder += "66\n" + "1" + "\n";
        //      for (let point in c.points.concat(c.points.take(1)))
        //      for (let point of concat([c.points, c.points.take(1)])) {
        for (var _c = 0, _d = c.points.concat(c.points[0]); _c < _d.length; _c++) {
            var point = _d[_c];
            builder += "0\nVERTEX\n";
            builder += "8\n" + layer.toString() + "\n";
            builder += "10\n" + point.x.toString() + "\n";
            builder += "20\n" + _invert(point.y, height).toString() + "\n";
            builder += "30\n0.0\n";
        }
        builder += "0\nSEQEND\n";
        builder += "8\n" + layer.toString() + "\n";
    }
    if (c_in instanceof index_1.RectangleComponent) {
        var c = c_in;
        builder += "0\nPOLYLINE\n";
        builder += "8\n" + layer.toString() + "\n";
        builder += "66\n" + "1" + "\n";
        var corners = c.corners();
        //      for (let point in c.Corners().Concat(c.Corners().Take(1))) {
        //      for (let point of concat([corners, corners.take(1)])) {
        for (var _e = 0, _f = corners.concat(corners[0]); _e < _f.length; _e++) {
            var point = _f[_e];
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
function _invert(d, height) {
    return height - d;
}
//}
//# sourceMappingURL=dxf2d_export_image.js.map