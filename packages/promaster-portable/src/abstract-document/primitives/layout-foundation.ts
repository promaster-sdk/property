export interface LayoutFoundation<T> {
  bottom: T,
  left: T,
  right: T,
  top: T,
}

export interface LayoutFoundationProps<T> {
  bottom: T,
  left: T,
  right: T,
  top: T,
}

export function create<T>({top, bottom, left, right}: LayoutFoundationProps<T>): LayoutFoundation<T> {
  return {
    top,
    bottom,
    left,
    right,
  }
}
