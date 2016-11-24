import {ShowdownExtension} from "showdown";

export function myext(): ShowdownExtension[] {
  const superscript = {
    type: 'superscript',
    regex: /olle/g,
    replace: 'hejhej'
  };
  const subscript = {
    type: 'subscript',
    regex: /kalle/g,
    replace: 'hello'
  };
  return [superscript, subscript];
}
