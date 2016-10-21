"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector2D = (function () {
    function Vector2D(x, y) {
        this._x = x;
        this._y = y;
    }
    Object.defineProperty(Vector2D.prototype, "x", {
        get: function () {
            return this._x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2D.prototype, "y", {
        get: function () {
            return this._y;
        },
        enumerable: true,
        configurable: true
    });
    return Vector2D;
}());
exports.Vector2D = Vector2D;
(function (LabelPosition) {
    LabelPosition[LabelPosition["Start"] = 0] = "Start";
    LabelPosition[LabelPosition["End"] = 1] = "End";
})(exports.LabelPosition || (exports.LabelPosition = {}));
var LabelPosition = exports.LabelPosition;
var ChartCurve = (function () {
    function ChartCurve(color, label, labelPosition, thickness, points) {
        this._color = color;
        this._label = label;
        this._labelPosition = labelPosition;
        this._thickness = thickness;
        this._points = points;
    }
    Object.defineProperty(ChartCurve.prototype, "color", {
        get: function () {
            return this._color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartCurve.prototype, "label", {
        get: function () {
            return this._label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartCurve.prototype, "labelPosition", {
        get: function () {
            return this._labelPosition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartCurve.prototype, "thickness", {
        get: function () {
            return this._thickness;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartCurve.prototype, "points", {
        get: function () {
            return this._points;
        },
        enumerable: true,
        configurable: true
    });
    return ChartCurve;
}());
exports.ChartCurve = ChartCurve;
var ChartPoint = (function () {
    function ChartPoint(color, label, point) {
        this._color = color;
        this._label = label;
        this._point = point;
    }
    Object.defineProperty(ChartPoint.prototype, "color", {
        get: function () {
            return this._color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartPoint.prototype, "label", {
        get: function () {
            return this._label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartPoint.prototype, "point", {
        get: function () {
            return this._point;
        },
        enumerable: true,
        configurable: true
    });
    return ChartPoint;
}());
exports.ChartPoint = ChartPoint;
var ChartArea = (function () {
    function ChartArea(color, label, min, max) {
        this._color = color;
        this._label = label;
        this._min = min;
        this._max = max;
    }
    Object.defineProperty(ChartArea.prototype, "color", {
        get: function () {
            return this._color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartArea.prototype, "label", {
        get: function () {
            return this._label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartArea.prototype, "min", {
        get: function () {
            return this._min;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartArea.prototype, "max", {
        get: function () {
            return this._max;
        },
        enumerable: true,
        configurable: true
    });
    return ChartArea;
}());
exports.ChartArea = ChartArea;
var IAxis = (function () {
    function IAxis(name, minVal, maxVal, lines, labels) {
        this._name = name;
        this._minVal = minVal;
        this._maxVal = maxVal;
        this._lines = lines;
        this._labels = labels;
    }
    Object.defineProperty(IAxis.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IAxis.prototype, "minVal", {
        get: function () {
            return this._minVal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IAxis.prototype, "maxVal", {
        get: function () {
            return this._maxVal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IAxis.prototype, "lines", {
        get: function () {
            return this._lines;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IAxis.prototype, "labels", {
        get: function () {
            return this._labels;
        },
        enumerable: true,
        configurable: true
    });
    return IAxis;
}());
exports.IAxis = IAxis;
var LinearAxis = (function (_super) {
    __extends(LinearAxis, _super);
    function LinearAxis(name, minVal, maxVal, lines, labels) {
        _super.call(this, name, minVal, maxVal, lines, labels);
    }
    LinearAxis.prototype.axisValueToPixelValue = function (pixelLength, axisValue) {
        var x = pixelLength * ((axisValue - this.minVal) / (this.maxVal - this.minVal));
        return x;
    };
    return LinearAxis;
}(IAxis));
exports.LinearAxis = LinearAxis;
var LogAxis = (function (_super) {
    __extends(LogAxis, _super);
    function LogAxis(name, minVal, maxVal, lines, labels) {
        _super.call(this, name, minVal, maxVal, lines, labels);
        if (minVal <= 0)
            throw new Error("Min value for logarithmic axis cannot be <= 0");
        if (maxVal <= 0)
            throw new Error("Max value for logarithmic axis cannot be <= 0");
    }
    LogAxis.prototype.axisValueToPixelValue = function (pixelLength, value) {
        if (value > 0) {
            var pixelValue = pixelLength * (LogAxis._log10(value) - LogAxis._log10(this.minVal))
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
    };
    LogAxis._log10 = function (x) {
        return Math.log(x) / Math.LN10;
    };
    return LogAxis;
}(IAxis));
exports.LogAxis = LogAxis;
//# sourceMappingURL=types.js.map