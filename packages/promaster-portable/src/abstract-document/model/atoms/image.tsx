import {IAtom} from "./atom";
import {ImageResource} from "../primitives/types";

export interface Image extends IAtom {
  height: number;
  imageResource: ImageResource;
  width: number;
}
