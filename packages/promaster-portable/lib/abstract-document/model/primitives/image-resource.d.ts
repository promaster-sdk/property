import { AbstractImage } from "../../../abstract-image/abstract-image";
export declare type Guid = string;
export interface ImageResource {
    abstractImage: any;
    id: Guid;
    renderScale: number;
}
export declare function createImageResource(id: Guid, abstractImage: AbstractImage, renderScale: number): ImageResource;
