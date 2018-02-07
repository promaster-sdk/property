import { Converter, extension } from "showdown";
import { supsub } from "./extension";

export function makeHtml(text: string): string {
  extension("subsup", supsub);
  const converter = new Converter({ extensions: ["subsup"] });
  return converter.makeHtml(text);
}
