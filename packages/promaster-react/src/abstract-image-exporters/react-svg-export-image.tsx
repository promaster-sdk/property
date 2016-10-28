import * as React from 'react';
import {AbstractImage} from "promaster-portable";

export function createReactSvg(image: AbstractImage.AbstractImage): React.ReactElement<any> {
	return (
	  <svg viewBox={[0, 0, image.size.width, image.size.height].join(' ')}>
      {_flatMap(image.components, (c) => _visit(c))}
    </svg>);
}

function _flatMap(array: Array<any>, lambda: (c: any) => Array<any>): Array<any> {
	return Array.prototype.concat.apply([], array.map(lambda));
}

function _visit(component: AbstractImage.Component): Array<React.ReactElement<any>> {

  switch (component.type) {
    case "bitmapimage":
      return [];
    case "line":
      return [(
        <line x1={component.start.x}
              y1={component.start.y}
              x2={component.end.x}
              y2={component.end.y}
              stroke={colorToRgb(component.strokeColor)}
              strokeWidth={component.strokeThickness} />
      )];
    case "text":
      const shadowStyle = {
        textAnchor: getTextAnchor(component.horizontalGrowthDirection),
        fontSize: component.fontSize.toString() + "px",
        fontWeight: component.fontWeight,
        fontFamily: component.fontFamily,
        stroke: colorToRgb(component.strokeColor),
        strokeWidth: component.strokeThickness
      };
      const style = {
        textAnchor: getTextAnchor(component.horizontalGrowthDirection),
        fontSize: component.fontSize.toString() + "px",
        fontWeight: component.fontWeight,
        fontFamily: component.fontFamily,
        fill: colorToRgb(component.textColor),
      };
      const dy = getBaselineAdjustment(component.verticalGrowthDirection);

      const transform = "rotate(" + component.clockwiseRotationDegrees.toString() + " "
        + component.position.x.toString() + "," + component.position.y.toString() + ")";

      const lines: Array<string> = component.text != null ? component.text.split('\n') : [];
      const tSpans = lines.map((t) =>
        (<tspan x={component.position.x}
               y={component.position.y}
               dy={(dy + lines.indexOf(t)).toString() + "em"}
               transform={transform}>{t}</tspan>));
      let cs: Array<React.ReactElement<any>> = [];
      if (component.strokeThickness > 0 && component.strokeColor) {
        cs.push(<text x={component.position.x} y={component.position.y} dy={dy.toString() + "em"} style={shadowStyle} transform={transform}>{tSpans}</text>);
      }
  		cs.push(<text x={component.position.x}
                    y={component.position.y}
                    dy={dy.toString() + "em"}
                    style={style}
                    transform={transform}>{tSpans}</text>);
      return cs;
    case "ellipse":
      const rx = component.size.width * 0.5;
      const ry = component.size.width * 0.5;
      const cx = component.topLeft.x + rx;
      const cy = component.topLeft.y + ry;
      return [<ellipse cx={cx} cy={cy} rx={rx} ry={ry}
                       stroke={colorToRgb(component.strokeColor)}
                       strokeWidth={component.strokeThickness}
                       fill={colorToRgb(component.fillColor)} />];
    case "polygon":
      let points = component.points.map((p) => p.x.toString() + "," + p.y.toString()).join(' ');
      return [<polygon points={points} stroke={colorToRgb(component.strokeColor)}
                       strokeWidth={component.strokeThickness} fill={colorToRgb(component.fillColor)} />];
    case "rectangle":
      return [<rect x={component.topLeft.x}
                    y={component.topLeft.y}
                    width={component.size.width}
                    height={component.size.height}
                    stroke={colorToRgb(component.strokeColor)}
                    strokeWidth={component.strokeThickness}
                    fill={colorToRgb(component.fillColor)} />];
    default:
      return [];
  }
}

function getBaselineAdjustment(d: AbstractImage.GrowthDirection): number {
  if (d === "up")
    return 0.0;
  if (d === "uniform")
    return 0.5;
  if (d === "down")
    return 1.0;
  throw "Unknown text alignment " + d;
}

function getTextAnchor(d: AbstractImage.GrowthDirection): string {
  if (d === "left")
    return "end";
  if (d === "uniform")
    return "middle";
  if (d === "right")
    return "start";
  throw "Unknown text alignment " + d;
}

function colorToRgb(color: AbstractImage.Color): string {
  return "rgb(" + color.r.toString() + "," + color.g.toString() + "," + color.b.toString() + ")";
}
