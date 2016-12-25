import {AbstractImage} from "../../abstract-image/abstract-image";

export type Guid = string;

export interface ImageResource {
  id: Guid;
  abstractImage: AbstractImage;
  renderScale: number;
}

export interface ImageResourceProps {
  id: Guid;
  abstractImage: AbstractImage;
  renderScale?: number;
}

export function create({id, abstractImage, renderScale = 1.0}: ImageResourceProps): ImageResource {
  return {
    id,
    abstractImage,
    renderScale,
  };
}
