import { assert } from 'chai';
import {PowerCurve} from "../../../src/class/regression/regression";
import {Vector2} from "../../../src/class/regression/regression";
import {PolynomialCurve} from "../../../src/class/regression/regression";
import {LinearCurve} from "../../../src/class/regression/regression";


let sampleValues = [
    3.0,
    6.0,
    9.0
];

let testValues = [
    2.0,
    4.0,
    12.0
];

describe('linear', () => {
    let samplePoints = sampleValues.map((x) => new Vector2(x, _linearFunction(x)));
    let testPoints = testValues.map((x) => new Vector2(x, _linearFunction(x)));

    it('no_points', () => {
        let curve = LinearCurve.fromPoints([]);
        assert.equal(curve, null);
    });

    it('one_point', () => {
        let curve = LinearCurve.fromPoints(samplePoints.slice(0,1));
        for (let x of testValues)
            assert.equal(curve.calcY(x), samplePoints[0].y);
    });

    it('many_points', () => {
        let curve = LinearCurve.fromPoints(samplePoints);
        for (let point of testPoints)
            assert.equal(Math.abs(curve.calcY(point.x) - point.y) < 0.1, true);
    });
});

describe('polynomial', () => {
    let samplePoints = sampleValues.map((x) => new Vector2(x, _polynomialFunction(x)));
    let testPoints = testValues.map((x) => new Vector2(x, _polynomialFunction(x)));

    it('no_points', () => {
        let curve = PolynomialCurve.fromPoints([]);
        assert.equal(curve, null);
    });

    it('one_point', () => {
        let curve = PolynomialCurve.fromPoints(samplePoints.slice(0,1));
        for (let point of testPoints)
            assert.equal(Math.abs(curve.calcY(point.x) - point.y) < 0.1, true);
    });

    it('many_points', () => {
        let curve = PolynomialCurve.fromPoints(samplePoints);
        for (let point of testPoints)
            assert.equal(Math.abs(curve.calcY(point.x) - point.y) < 0.1, true);
    });
});

describe('power', () => {
    let samplePoints = sampleValues.map((x) => new Vector2(x, _powerFunction(x)));
    let testPoints = testValues.map((x) => new Vector2(x, _powerFunction(x)));

    it('no_points', () => {
        let curve = PowerCurve.fromPoints([]);
        assert.equal(curve, null);
    });

    it('one_point', () => {
        let curve = PowerCurve.fromPoints(samplePoints.slice(0,1));
        assert.equal(curve, null);
    });

    it('many_points', () => {
        let curve = PowerCurve.fromPoints(samplePoints);
        for (let point of testPoints)
            assert.equal(Math.abs(curve.calcY(point.x) - point.y) < 0.1, true);
    });
});

describe('log', () => {

    let samplePoints = sampleValues.map((x) => new Vector2(x, _logFunction(x)));
    let testPoints = testValues.map((x) => new Vector2(x, _logFunction(x)));

    it('no_points', () => {
        let curve = PowerCurve.fromPoints([]);
        assert.equal(curve, null);
    });

    it('one_point', () => {
        let curve = PowerCurve.fromPoints(samplePoints.slice(0,1));
        assert.equal(curve, null);
    });

    it('many_points', () => {
        let curve = PowerCurve.fromPoints(samplePoints);
        for (let point of testPoints)
            assert.equal(Math.abs(curve.calcY(point.x) - point.y) < 0.1, true);
    });
});


function _linearFunction (x:number):number {
    return 2.5 * x + 4.0;
}

function _polynomialFunction (x:number):number {
    return Math.pow(x / 0.75, 2);
}

function _powerFunction (x:number):number {
    return 2.5 * Math.pow(x, 1.8);
}
function _logFunction (x:number):number {
    return 2.5 * _log10(x) + 4.0;
}

function _log10 (x:number):number {
    return Math.log(x) / Math.LN10;
}
