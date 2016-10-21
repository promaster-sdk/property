"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector2 = (function () {
    function Vector2(x, y) {
        var _this = this;
        this.toString = function () { return "(" + _this.x + ", " + _this.y + ")"; };
        this._x = x;
        this._y = y;
    }
    Object.defineProperty(Vector2.prototype, "x", {
        get: function () {
            return this._x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "y", {
        get: function () {
            return this._y;
        },
        enumerable: true,
        configurable: true
    });
    return Vector2;
}());
exports.Vector2 = Vector2;
var RegCurve = (function () {
    function RegCurve(minX, maxX) {
        this._minX = minX;
        this._maxX = maxX;
    }
    Object.defineProperty(RegCurve.prototype, "minX", {
        get: function () {
            return this._minX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegCurve.prototype, "maxX", {
        get: function () {
            return this._maxX;
        },
        enumerable: true,
        configurable: true
    });
    return RegCurve;
}());
exports.RegCurve = RegCurve;
// y = a*x+b
var LinearCurve = (function (_super) {
    __extends(LinearCurve, _super);
    function LinearCurve(a, b, minX, maxX) {
        _super.call(this, minX, maxX);
        this.a = a;
        this.b = b;
    }
    LinearCurve.fromPoints = function (points) {
        if (points.length == 0)
            return new LinearCurve(0.0, 0.0, 0.0, 0.0);
        if (points.length == 1)
            return new LinearCurve(points[0].y, 0.0, 0.0, 0.0);
        var minX = points.map(function (p) { return p.x; }).reduce(function (prev, curr) { return Math.min(prev, curr); });
        var maxX = points.map(function (p) { return p.x; }).reduce(function (prev, curr) { return Math.max(prev, curr); });
        var n = points.length;
        var sumXY = _sum(points.map(function (p) { return p.x * p.y; }));
        var sumXX = _sum(points.map(function (p) { return p.x * p.x; }));
        var sumX = _sum(points.map(function (p) { return p.x; }));
        var sumY = _sum(points.map(function (p) { return p.y; }));
        var a = (n * sumXY - sumX * sumY) / (n * sumXX - Math.pow(sumX, 2));
        var b = (sumY - a * sumX) / n;
        return new LinearCurve(a, b, minX, maxX);
    };
    LinearCurve.prototype.calcX = function (y) {
        return (y - this.b) / this.a;
    };
    LinearCurve.prototype.calcY = function (x) {
        return this.a * x + this.b;
    };
    return LinearCurve;
}(RegCurve));
exports.LinearCurve = LinearCurve;
// y = (x/a)^2
var PolynomialCurve = (function (_super) {
    __extends(PolynomialCurve, _super);
    function PolynomialCurve(a, minX, maxX) {
        _super.call(this, minX, maxX);
        this.a = a;
    }
    PolynomialCurve.fromPoint = function (x, y) {
        var a = x / Math.sqrt(y);
        return new PolynomialCurve(a, 0.0, 0.0);
    };
    PolynomialCurve.fromPoints = function (points) {
        var a = _sum(points.map(function (p) { return p.x / Math.sqrt(p.y); })) / points.length;
        return new PolynomialCurve(a, 0.0, 0.0);
    };
    PolynomialCurve.prototype.calcX = function (y) {
        return Math.sqrt(y) * this.a;
    };
    PolynomialCurve.prototype.calcY = function (x) {
        return Math.pow(x / this.a, 2);
    };
    return PolynomialCurve;
}(RegCurve));
exports.PolynomialCurve = PolynomialCurve;
// y = a*x^b
var PowerCurve = (function (_super) {
    __extends(PowerCurve, _super);
    function PowerCurve(a, b, minX, maxX) {
        _super.call(this, minX, maxX);
        this.a = a;
        this.b = b;
    }
    PowerCurve.fromPoints = function (points) {
        var m = _sum(points.map(function (p) { return Math.pow(p.y, 2); }));
        var avgX = _sum(points.map(function (p) { return Math.pow(p.y, 2) * Math.log(p.x); })) / m;
        var t = _sum(points.map(function (p) { return Math.pow(p.y, 2) * Math.pow(Math.log(p.x) - avgX, 2); }));
        var b = _sum(points.map(function (p) { return Math.pow(p.y, 2) * Math.log(p.y) * (Math.log(p.x) - avgX); })) / t;
        var a = Math.exp((_sum(points.map(function (p) { return Math.pow(p.y, 2) * Math.log(p.y); })) / m) - b * avgX);
        return new PowerCurve(a, b, 0.0, 0.0);
    };
    PowerCurve.prototype.calcX = function (y) {
        return Math.pow(y / this.a, 1 / this.b);
    };
    PowerCurve.prototype.calcY = function (x) {
        return this.a * Math.pow(x, this.b);
    };
    return PowerCurve;
}(RegCurve));
exports.PowerCurve = PowerCurve;
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
var ExponentialCurve = (function (_super) {
    __extends(ExponentialCurve, _super);
    function ExponentialCurve(a, b, minX, maxX) {
        _super.call(this, minX, maxX);
        this.a = a;
        this.b = b;
    }
    ExponentialCurve.prototype.calcX = function (y) {
        return _log10(y / this.a) / this.b;
    };
    ExponentialCurve.prototype.calcY = function (x) {
        return this.a * Math.pow(10, this.b * x);
    };
    return ExponentialCurve;
}(RegCurve));
exports.ExponentialCurve = ExponentialCurve;
// y = a*log(x)+b
var LogCurve = (function (_super) {
    __extends(LogCurve, _super);
    function LogCurve(a, b, minX, maxX) {
        _super.call(this, minX, maxX);
        this.a = a;
        this.b = b;
    }
    LogCurve.fromPoints = function (points) {
        var minX = points.map(function (p) { return p.x; }).reduce(function (prev, curr) { return Math.min(prev, curr); });
        var maxX = points.map(function (p) { return p.x; }).reduce(function (prev, curr) { return Math.max(prev, curr); });
        var aList = [];
        for (var i = 0; i < points.length - 1; i++)
            aList.push((points[i + 1].y - points[i].y) /
                (_log10(points[i + 1].x) - _log10(points[i].x)));
        var aAverage = _sum(aList) / aList.length;
        var bList = [];
        for (var i = 0; i < points.length; i++)
            bList.push(points[i].y - (aAverage * _log10(points[i].x)));
        var bAverage = _sum(bList) / bList.length;
        return new LogCurve(aAverage, bAverage, minX, maxX);
    };
    LogCurve.prototype.calcX = function (y) {
        return Math.pow(10, (y - this.b) / this.a);
    };
    LogCurve.prototype.calcY = function (x) {
        return this.a * _log10(x) + this.b;
    };
    return LogCurve;
}(RegCurve));
exports.LogCurve = LogCurve;
var _log10 = function (x) { return Math.log(x) / Math.LN10; };
var _sum = function (iterable) { return iterable.reduce(function (a, b) { return a + b; }, 0.0); };
//# sourceMappingURL=regression.js.map