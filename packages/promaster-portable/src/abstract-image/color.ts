export interface Color {
  readonly a: number,
  readonly r: number,
  readonly g: number,
  readonly b: number,
}

export function fromArgb(a: number, r: number, g: number, b: number): Color {
  return {a: a, r: r, g: g, b: b};
}

export function toString6Hex(color: Color): string {
  return ("00"+color.r.toString(16)).substr(-2) + ("00"+color.g.toString(16)).substr(-2) + ("00"+color.b.toString(16)).substr(-2);
}

export function fromString(s: string): Color | undefined {
  if (s === null || s === undefined || s.length !== 9 || s[0] !== "#") {
    return undefined;
  }

  const a: number = parseInt(s.substring(1, 1 + 2), 16);
  const r: number = parseInt(s.substring(3, 3 + 2), 16);
  const g: number = parseInt(s.substring(5, 5 + 2), 16);
  const b: number = parseInt(s.substring(7, 7 + 2), 16);

  if (isNaN(a) || isNaN(r) || isNaN(g) || isNaN(b)) {
    return undefined;
  }

  return fromArgb(a, r, g, b);
}

export const black: Color = fromArgb(0xFF, 0, 0, 0);
export const blue: Color = fromArgb(0xFF, 0x00, 0x00, 0xFF);
export const brown: Color = fromArgb(0xFF, 0xA5, 0x2A, 0x2A);
export const cyan: Color = fromArgb(0xFF, 0x00, 0xFF, 0xFF);
export const darkGray: Color = fromArgb(0xFF, 0xA9, 0xA9, 0xA9);
export const gray: Color = fromArgb(0xFF, 0x80, 0x80, 0x80);
export const green: Color = fromArgb(0xFF, 0x00, 0x80, 0x00);
export const lightGray: Color = fromArgb(0xFF, 0xD3, 0xD3, 0xD3);
export const magenta: Color = fromArgb(0xFF, 0xFF, 0x00, 0xFF);
export const orange: Color = fromArgb(0xFF, 0xFF, 0xA5, 0x00);
export const purple: Color = fromArgb(0xFF, 0x80, 0x00, 0x80);
export const red: Color = fromArgb(0xFF, 0xFF, 0x00, 0x00);
export const transparent: Color = fromArgb(0x00, 0xFF, 0xFF, 0xFF);
export const white: Color = fromArgb(0xFF, 0xFF, 0xFF, 0xFF);
export const yellow: Color = fromArgb(0xFF, 0xFF, 0xFF, 0x00);
export const lightBlue: Color = fromArgb(0xFF, 0xAD, 0xD8, 0xE6);
