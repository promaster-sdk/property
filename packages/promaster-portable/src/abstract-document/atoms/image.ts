import {ImageResource} from "../primitives/image-resource";

export interface Image {
  type: "Image",
  imageResource: ImageResource,
  width: number,
  height: number,
}

export interface ImageProps {
  imageResource: ImageResource,
  width: number,
  height: number,
}

export function create({imageResource, width, height}:ImageProps): Image {
  if (!imageResource)
    throw new Error("imageResource was not specified");
  if (isNaN(width))
    throw new Error("width was not specified");
  if (isNaN(height))
    throw new Error("height was not specified");
  return {
    type: "Image",
    imageResource,
    width,
    height,
  };
}
