import {Converter, extension} from "showdown";
import {myext} from "./extension";

export function makeHtml(text: string) {
  const converter = new Converter();
  extension('myext', myext);
  return converter.makeHtml(text);
}
