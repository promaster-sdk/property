export interface Font {
  normal: FontSource;
  bold: FontSource;
  italic: FontSource;
  boldItalic: FontSource;
}

export type FontSource = string | Uint8Array;

export interface FontProps {
  normal: FontSource;
  bold: FontSource;
  italic: FontSource;
  boldItalic: FontSource;
}

export function create({ normal, bold, italic, boldItalic }: FontProps): Font {
  return {
    normal,
    bold,
    italic,
    boldItalic
  };
}
