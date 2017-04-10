import * as AbstractImage from "../abstract-image/index";

export function createSVG(image: AbstractImage.AbstractImage): string {
  const style = createElement("style", {}, ["* { vector-effect: non-scaling-stroke;}"]);

  let svgElements = [style];

  const imageElements = image.components.map((c: AbstractImage.Component) => abstractComponentToSVG(c));
  svgElements = svgElements.concat(imageElements);

  return createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
  }, svgElements);
}

function abstractComponentToSVG(component: AbstractImage.Component): string {

  switch (component.type) {
    case "group":
      return createElement("g", {
        "name": component.name,
      }, component.children.map((c) => abstractComponentToSVG(c)));
    case "bitmapimage":
      return "";
    case "vectorimage":
      return "";
    case "line":
      return createElement("line", {
        "x1": component.start.x.toString(),
        "y1": component.start.y.toString(),
        "x2": component.end.x.toString(),
        "y2": component.end.y.toString(),
        "stroke": colorToRgb(component.strokeColor),
        "strokeWidth": component.strokeThickness.toString()
      }, []);
    case "polyline":
      return createElement("polyline", {
        "fill": "none",
        "points": component.points.map((p) => p.x.toString() + "," + p.y.toString()).join(' '),
        "stroke": colorToRgb(component.strokeColor),
        "strokeWidth": component.strokeThickness.toString()
      }, []);
    case "text":
      if (!component.text) {
        return "";
      }
      const shadowStyle = {
        textAnchor: getTextAnchor(component.horizontalGrowthDirection),
        fontSize: component.fontSize.toString() + "px",
        fontWeight: component.fontWeight,
        fontFamily: component.fontFamily,
        stroke: colorToRgb(component.strokeColor),
        strokeWidth: component.strokeThickness.toString() + "px"
      };

      const style = {
        textAnchor: getTextAnchor(component.horizontalGrowthDirection),
        fontSize: component.fontSize.toString() + "px",
        fontWeight: component.fontWeight,
        fontFamily: component.fontFamily,
        fill: colorToRgb(component.textColor),
      };

      const dy = getBaselineAdjustment(component.verticalGrowthDirection);

      const transform = "rotate(" + component.clockwiseRotationDegrees.toString() + " " +
        component.position.x.toString() + "," + component.position.y.toString() + ")";

      const lines: Array<string> = component.text != null ? component.text.split('\n') : [];

      const tSpans = lines.map((t) => createElement("tspan", {
        dy: (dy + lines.indexOf(t)).toString() + "em"
      }, [t]));

      const cs: Array<string> = [];

      if (component.strokeThickness > 0 && component.strokeColor != null) {
        cs.push(
          createElement(
            "text",
            {
              "x": component.position.x.toString(),
              "y": component.position.y.toString(),
              "dy": dy.toString() + "em",
              "style": objectToAttributeValue(shadowStyle),
              "transform": transform
            },
            tSpans
          )
        );
      } else {
        cs.push(
          createElement(
            "text",
            {
              "x": component.position.x.toString(),
              "y": component.position.y.toString(),
              "dy": dy.toString() + "em",
              "style": objectToAttributeValue(style),
              "transform": transform
            },
            tSpans
          )
        );
      }
      return flattenElements(cs);
    case "ellipse":
      const rx = Math.abs(component.bottomRight.x - component.topLeft.x) * 0.5;
      const ry = Math.abs(component.bottomRight.y - component.topLeft.y) * 0.5;
      const cx = (component.bottomRight.x + component.topLeft.x) * 0.5;
      const cy = (component.bottomRight.y + component.topLeft.y) * 0.5;
      return createElement("ellipse", {
        cx: cx.toString(),
        cy: cy.toString(),
        rx: rx.toString(),
        ry: ry.toString(),
        stroke: colorToRgb(component.strokeColor),
        strokeWidth: component.strokeThickness.toString(),
        fill: colorToRgb(component.fillColor)
      }, []);
    case "polygon":
      return createElement("polygon", {
        points: component.points.map((p) => p.x.toString() + "," + p.y.toString()).join(' '),
        stroke: colorToRgb(component.strokeColor),
        strokeWidth: component.strokeThickness.toString(),
        fill: colorToRgb(component.fillColor)
      }, []);
    case "rectangle":
      return createElement("rect", {
        x: component.topLeft.x.toString(),
        y: component.topLeft.y.toString(),
        width: Math.abs(component.bottomRight.x - component.topLeft.x).toString(),
        height: Math.abs(component.bottomRight.y - component.topLeft.y).toString(),
        stroke: colorToRgb(component.strokeColor),
        strokeWidth: component.strokeThickness.toString(),
        fill: colorToRgb(component.fillColor)
      }, []);
    default:
      return "";
  }
}

interface Attributes {
  readonly [key: string]: string;
}

function createElement(elementName: string, attributes: Attributes, innerElements: string[]): string {
  const formattedName = convertUpperToHyphenLower(elementName);
  let element = `<${formattedName}`;

  if (Object.keys(attributes).length > 0) {
    element = Object.keys(attributes).reduce((previousValue: string, currentValue: string) => {
      if (attributes[currentValue]) {
        return previousValue + ` ${convertUpperToHyphenLower(currentValue)}="${attributes[currentValue]}"`;
      }
      else {
        return previousValue;
      }
    }, element);
  }

  element += ">";

  if (innerElements.length > 0) {
    element = innerElements.reduce((previousValue: string, currentValue: string) => {
      if (!currentValue || currentValue.length < 1) {
        return previousValue;
      }
      else {
        return previousValue + `\n${currentValue}`;
      }
    }, element);

    element += "\n";
  }

  element += `</${formattedName}>`;

  return element;
}

function objectToAttributeValue(attributes: Attributes): string {
  if (attributes && Object.keys(attributes).length > 0) {
    return Object.keys(attributes).reduce((previousValue: string, currentValue: string) => {

      if (attributes[currentValue]) {
        return previousValue + `${convertUpperToHyphenLower(currentValue)}:${attributes[currentValue]};`;
      }
      else {
        return previousValue;
      }
    }, "");
  }

  return "";
}

function convertUpperToHyphenLower(elementName: string): string {

  function upperToHyphenLower(match: string) {
    return '-' + match.toLowerCase();
  }

  return elementName !== "viewBox" ? elementName.replace(/[A-Z]/g, upperToHyphenLower) : elementName;
}

function flattenElements(elements: string[]): string {
  return elements.reduce((previousValue: string, currentValue: string) => {
    return previousValue + `\n${currentValue}`;
  }, "");
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
  return `rgba(${color.r.toString()}, ${color.g.toString()}, ${color.b.toString()}, ${color.a.toString()})`;
}