import {IAtom} from "./atom";
import {ImageResource} from "../primitives/image-resource";

export interface Image extends IAtom {
  height: number;
  imageResource: ImageResource;
  width: number;
}
