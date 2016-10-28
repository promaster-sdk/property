import * as React from "react";
import {AbstractImage} from "promaster-portable";
import {AbstractImageExporters} from "promaster-react";

export function ReactSvgExportExample1() {
  const components = [
    AbstractImage.createLine(AbstractImage.createPoint(25, 25), AbstractImage.createPoint(80, 60), AbstractImage.black, 2),
    AbstractImage.createRectangle(AbstractImage.createPoint(10, 50), AbstractImage.createSize(40, 10), AbstractImage.blue, 2, AbstractImage.red),
  ];
  const image = AbstractImage.createAbstractImage(AbstractImage.createPoint(0, 0), AbstractImage.createSize(400, 400), AbstractImage.white, components);
  const svg = AbstractImageExporters.createReactSvg(image);
  return (
    <div>
      <h1>React Svg</h1>
      <pre>{svg}</pre>

    </div>);
}