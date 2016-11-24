import {Converter} from "showdown";

export function makeHtml(text: string) {
  const converter = new Converter();
  return converter.makeHtml(text);
}
