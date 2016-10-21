import {RenderedImage} from "../../model/rendered_image";
import {AbstractImageRoot} from "../../model/abstract_image_root";
import {ExportImage} from "../../functions";
import {AbstractComponent} from "../../model/abstract_component";
import {BitmapImageComponent} from "../../model/bitmap_image_component";
import {VectorImageComponent} from "../../model/vector_image_component";
import {LineComponent} from "../../model/line_component";
import {TextComponent} from "../../model/text_component";
import {AbstractFontWeight} from "../../model/abstract_font_weight";
import {colorToRgb, getTextAnchor, getBaselineAdjustment} from "../svgHelpers";
import {EllipseComponent} from "../../model/ellipse_component";
import {PolygonComponent} from "../../model/polygon_component";
import {RectangleComponent} from "../../model/rectangle_component";

export const svgExportImage:ExportImage =
    (root:AbstractImageRoot, scale:number = 1.0):RenderedImage => {

        return new RenderedImage("svg", createSVG(root));
    };

function createSVG(root:AbstractImageRoot) {
    const style = createElement("style", null, ["* { vector-effect: non-scaling-stroke;}"]);

    let svgElements = [style];

    const imageElements = root.components.map((c:AbstractComponent) => abstractComponentToSVG(c));
    svgElements = svgElements.concat(imageElements);

    return createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 400 300"
    }, svgElements);
}

function abstractComponentToSVG(component:AbstractComponent) {

    if (component instanceof AbstractImageRoot) {
        return "";
    }

    if (component instanceof BitmapImageComponent) {
        return "";
    }

    if (component instanceof VectorImageComponent) {
        throw "TODO!";
    }

    if (component instanceof LineComponent) {
        let c:LineComponent = component;
        return createElement("line", {
            "x1": c.start.x.toString(),
            "y1": c.start.y.toString(),
            "x2": c.end.x.toString(),
            "y2": c.end.y.toString(),
            "stroke": colorToRgb(c.strokeColor),
            "strokeWidth": c.strokeThickness.toString()
        }, null);

    }

    if (component instanceof TextComponent) {
        let c:TextComponent = component;

        let shadowStyle = {
            textAnchor: getTextAnchor(c.horizontalGrowthDirection),
            fontSize: c.fontSize.toString() + "px",
            fontWeight: c.fontWeight == AbstractFontWeight.Bold ? "bold" : "normal",
            fontFamily: c.fontFamily,
            stroke: colorToRgb(c.strokeColor),
            strokeWidth: c.strokeThickness.toString() + "px"
        };

        let style = {
            textAnchor: getTextAnchor(c.horizontalGrowthDirection),
            fontSize: c.fontSize.toString() + "px",
            fontWeight: c.fontWeight == AbstractFontWeight.Bold ? "bold" : "normal",
            fontFamily: c.fontFamily,
            fill: colorToRgb(c.textColor),
        };

        let dy = getBaselineAdjustment(c.verticalGrowthDirection);

        let transform = "rotate(" + c.clockwiseRotationDegrees.toString() + " " + c.position.x.toString() + "," + c.position.y.toString() + ")";

        let lines:Array<string> = c.text != null ? c.text.split('\n') : [];

        let tSpans = lines.map((t) => createElement("tspan", {
            x: c.position.x.toString(),
            y: c.position.y.toString(),
            dy: (dy + lines.indexOf(t)).toString() + "em"
        }, [t]));

        let cs = [];

        if (c.strokeThickness > 0 && c.strokeColor != null) {
            cs.push(createElement("text", {
                "x": c.position.x.toString(),
                "y": c.position.y.toString(),
                "dy": dy.toString() + "em",
                "style": objectToAttributeValue(shadowStyle),
                "transform": transform
            }, tSpans));
        }

        cs.push(createElement("text", {
            "x": c.position.x.toString(),
            "y": c.position.y.toString(),
            "dy": dy.toString() + "em", "style": objectToAttributeValue(style),
            "transform": transform
        }, tSpans));

        return flattenElements(cs);
    }

    if (component instanceof EllipseComponent) {
        let c:EllipseComponent = component;
        let rx = c.size.width * 0.5;
        let ry = c.size.width * 0.5;
        let cx = c.topLeft.x + rx;
        let cy = c.topLeft.y + ry;
        return createElement("ellipse", {
            cx: cx.toString(),
            cy: cy.toString(),
            rx: rx.toString(),
            ry: ry.toString(),
            stroke: colorToRgb(c.strokeColor),
            strokeWidth: c.strokeThickness.toString(),
            fill: colorToRgb(c.fillColor)
        }, null);
    }


    if (component instanceof PolygonComponent) {
        let c:PolygonComponent = component;
        let points = c.points.map((p) => p.x.toString() + "," + p.y.toString()).join(' ');
        return createElement("polygon", {
            points: points,
            stroke: colorToRgb(c.strokeColor),
            strokeWidth: c.strokeThickness.toString(),
            fill: colorToRgb(c.fillColor)
        }, null);
    }

    if (component instanceof RectangleComponent) {
        let c:RectangleComponent = component;
        return createElement("rect", {
            x: c.topLeft.x.toString(),
            y: c.topLeft.y.toString(),
            width: c.size.width.toString(),
            height: c.size.height.toString(),
            stroke: colorToRgb(c.strokeColor),
            strokeWidth: c.strokeThickness.toString(),
            fill: colorToRgb(c.fillColor)
        }, null);
    }

    return "";
}

function createElement(elementName:string, attributes:Object, innerElements:string[]) {
    const formattedName = convertUpperToHyphenLower(elementName);
    const hasInnerElements = innerElements && innerElements.length > 0;
    let element = `<${formattedName}`;

    if (attributes && Object.keys(attributes).length > 0) {
        element = Object.keys(attributes).reduce((previousValue:string, currentValue:string) => {

            if (attributes[currentValue]) {
                return previousValue + ` ${convertUpperToHyphenLower(currentValue)}="${attributes[currentValue]}"`;
            }
            else {
                return previousValue;
            }
        }, element);
    }

    element += ">";

    if (hasInnerElements)
        element = innerElements.reduce((previousValue:string, currentValue:string) => {
            if (!currentValue || currentValue.length < 1) {
                return previousValue;
            } else {
                return previousValue + `\n${currentValue}`;

            }
        }, element);

    if (hasInnerElements) {
        element += "\n";
    }

    element += `</${formattedName}>`;

    return element;
}

function objectToAttributeValue(attributes:Object) {
    if (attributes && Object.keys(attributes).length > 0) {
        return Object.keys(attributes).reduce((previousValue:string, currentValue:string) => {

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

function convertUpperToHyphenLower(elementName:string) {

    function upperToHyphenLower(match) {
        return '-' + match.toLowerCase();
    }

    return elementName !== "viewBox" ? elementName.replace(/[A-Z]/g, upperToHyphenLower) : elementName;
}

function flattenElements(elements:string[]) {
    return elements.reduce((previousValue:string, currentValue:string) => {
        return previousValue += `\n${currentValue}`;
    }, "");
}