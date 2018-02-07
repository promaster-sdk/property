import * as AbstractImage from "../abstract-image/index";

export function createPNG(image: AbstractImage.AbstractImage): Uint8Array {
  if (image.components.length !== 1) {
    throw new Error("Not supported!");
  }
  const component = image.components[0];
  if (
    component.type === "bitmapimage" &&
    component.format.toLowerCase() === "png"
  ) {
    return component.data;
  }
  throw new Error("Not supported!");
}
