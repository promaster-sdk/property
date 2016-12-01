import { ImageResource } from "../primitives/image-resource";
export interface Image {
    type: "Image";
    height: number;
    imageResource: ImageResource;
    width: number;
}
