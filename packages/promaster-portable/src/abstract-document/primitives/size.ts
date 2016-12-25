
export interface Size {
  height: number,
  width: number,
}

export function create(width: number, height: number): Size {
  return {
    width,
    height,
  };
}
