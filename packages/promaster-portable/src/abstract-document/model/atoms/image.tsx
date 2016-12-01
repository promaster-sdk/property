import {ImageResource} from "../primitives/image-resource";

export interface Image {
  type: "Image",
  height: number,
  imageResource: ImageResource,
  width: number,
}

export function createImage(imageResource: ImageResource, width: number, height: number): Image {
  if (imageResource == null)
    throw new Error("imageResource");
  if (isNaN(width))
    throw new Error("width");
  if (isNaN(height))
    throw new Error("height");
  return {
    type: "Image",
    imageResource,
    width,
    height,
  };
}
