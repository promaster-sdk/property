import * as React from "react";
import { AbstractImage, AbstractImageExporters } from "../../src/index";

export function AbstractImageExampleDxf() {
  const components = [
    AbstractImage.createLine(AbstractImage.createPoint(25, 25), AbstractImage.createPoint(80, 60), AbstractImage.green, 2),
    AbstractImage.createRectangle(AbstractImage.createPoint(10, 50), AbstractImage.createPoint(40, 80), AbstractImage.blue, 2, AbstractImage.red),
  ];
  const image = AbstractImage.createAbstractImage(AbstractImage.createPoint(0, 0), AbstractImage.createSize(400, 400), AbstractImage.white, components);
  const dxf = AbstractImageExporters.dxf2dExportImage(image);

  // Create a new blob from the data.
  const blob = new Blob([dxf], { type: 'text/plain', endings: 'native' });
  // Create a data:url which points to that data.
  const url = URL.createObjectURL(blob);

  return (
    <div>
      <h1>DXF</h1>
      <a href={url} download={'abstract_image_demo1.dxf'}>Download DXF</a>
      <pre>{dxf}</pre>
    </div>);
}