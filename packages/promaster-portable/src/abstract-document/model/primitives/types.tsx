export type Guid = string;

export interface Color {
}
export interface Colors {
}

export interface ImageResource {
  abstractImage: any;
  id: Guid;
  renderScale: number;
}

export interface LayoutFoundation<T> {
  bottom: T;
  left: T;
  right: T;
  top: T;
}

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface Size {
  height: number;
  width: number;
}
