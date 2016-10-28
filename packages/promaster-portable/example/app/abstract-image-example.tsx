import * as React from "react";
import {AbstractImage, AbstractImageExporters} from "../../src/index";

export function AbstractImageExample() {
  const components = [
    AbstractImage.createLine(AbstractImage.createPoint(25, 25), AbstractImage.createPoint(80, 60), AbstractImage.black, 2),
    AbstractImage.createRectangle(AbstractImage.createPoint(10, 50), AbstractImage.createSize(40, 10), AbstractImage.blue, 2, AbstractImage.red),
  ];
  const image = AbstractImage.createAbstractImage(AbstractImage.createPoint(0, 0), AbstractImage.createSize(400, 400), AbstractImage.white, components);
  const svg = AbstractImageExporters.createSVG(image);
  const base64 = btoa(svg);
  return (
    <div>
      <h1>Svg</h1>
      <pre>{svg}</pre>
      <img width="400" height="400" src={`data:image/svg+xml;base64,${base64}`} />
    </div>);
}