export interface Rect {
  x: number,
  y: number,
  width: number,
  height: number,
}

export function create(x: number, y: number, width: number, height: number): Rect {
  return {
    x: x,
    y: y,
    width: width,
    height: height
  };
}