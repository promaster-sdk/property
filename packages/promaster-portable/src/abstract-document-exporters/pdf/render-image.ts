import * as AbstractImage from "../../abstract-image/index";
import * as AD from "../../abstract-document";
import * as base64 from "base64-js";

export function renderImage(pdf: any, finalRect: AD.Rect.Rect, image: AD.Image.Image) {
  const aImage = image.imageResource.abstractImage;
  const position = AD.Point.create(finalRect.x, finalRect.y);
  const scaleX = finalRect.width / image.width;
  const scaleY = finalRect.height / image.height;
  pdf.scale(scaleX, scaleY).translate(position.x, position.y).save();
  aImage.components.forEach((c) => abstractComponentToPdf(pdf, c));
  pdf.restore();
}

function abstractComponentToPdf(pdf: any, component: AbstractImage.Component) {
  switch (component.type) {
    case "bitmapimage":
      if (component.format.toLowerCase() === "png") {
        const width = component.bottomRight.x - component.topLeft.x;
        const height = component.bottomRight.y - component.topLeft.y;
        const data = "data:image/png;base64," + base64.fromByteArray(component.data);
        pdf.image(data, component.topLeft.x, component.topLeft.y, {fit: [width, height]});
      }
      break;
    case "vectorimage":
      break;
    case "line":
      pdf
        .lineWidth(component.strokeThickness)
        .strokeColor(colorToRgb(component.strokeColor))
        .moveTo(component.start.x, component.start.y)
        .lineTo(component.end.x, component.end.y)
        .stroke();
      break;
    case "text":
      pdf
        .font(/*textProperties.fontFamily || */"Helvetica", /*textProperties.fontFamily || */"Helvetica", component.fontSize)
        .fillColor(colorToRgb(component.strokeColor))
        .text(component.text, component.position.x, component.position.y);
      break;
    case "ellipse":
      const width = component.bottomRight.x - component.topLeft.x;
      const height = component.bottomRight.y - component.topLeft.y;
      const centerX = component.topLeft.x + width * 0.5;
      const centerY = component.topLeft.y + height * 0.5;
      pdf
        .lineWidth(component.strokeThickness)
        .ellipse(centerX, centerY, width * 0.5, height * 0.5)
        .fillAndStroke(colorToRgb(component.fillColor), colorToRgb(component.strokeColor));
      break;
    case "polygon":
      pdf
        .lineWidth(component.strokeThickness)
        .polygon(component.points.map((p) => [p.x, p.y]))
        .fillAndStroke(colorToRgb(component.fillColor), colorToRgb(component.strokeColor));
      break;
    case "rectangle":
      const rWidth = component.bottomRight.x - component.topLeft.x;
      const rHeight = component.bottomRight.y - component.topLeft.y;
      pdf
        .lineWidth(component.strokeThickness)
        .rect(component.topLeft.x, component.topLeft.y, rWidth, rHeight)
        .fillAndStroke(colorToRgb(component.fillColor), colorToRgb(component.strokeColor));
      break;
    default:
      break;
  }
}

function colorToRgb(color: AbstractImage.Color): Array<number> {
  return [color.r, color.g, color.b];
}