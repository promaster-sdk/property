import {AbstractImage} from "../../../abstract-image/abstract-image";

export type Guid = string;

export interface ImageResource {
  abstractImage: any,
  id: Guid,
  renderScale: number,
}

export function createImageResource(id: Guid, abstractImage: AbstractImage, renderScale: number): ImageResource {
  return {
    id,
    abstractImage,
    renderScale,
  };
}
