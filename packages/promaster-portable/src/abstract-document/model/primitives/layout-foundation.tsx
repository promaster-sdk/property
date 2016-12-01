export interface LayoutFoundation<T> {
  bottom: T,
  left: T,
  right: T,
  top: T,
}

export function createLayoutFoundation<T>(top: T, bottom: T, left: T, right: T): LayoutFoundation<T> {
  return {
    top,
    bottom,
    left,
    right,
  }
}
