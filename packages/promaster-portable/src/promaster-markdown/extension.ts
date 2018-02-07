import { ShowdownExtension } from "showdown";

export function supsub(): ShowdownExtension[] {
  const superscript = {
    type: "lang",
    regex: /\^([^\r]*)\^/g,
    replace: "<sup>$1</sup>"
  };
  const subscript = {
    type: "lang",
    regex: /~T([^\r]*)~T/g,
    replace: "<sub>$1</sub>"
  };
  return [superscript, subscript];
}
