export interface Font {
  normal: string,
  bold: string,
  italic: string,
  boldItalic: string,
}

export interface FontProps {
  normal: string,
  bold: string,
  italic: string,
  boldItalic: string,
}

export function create({normal, bold, italic, boldItalic}: FontProps): Font {
  return {
    normal,
    bold,
    italic,
    boldItalic
  };
}
