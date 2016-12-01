export interface StyleKey {
  name: string,
  type: string,
}

export function createStyleKey(type: string, name: string): StyleKey {
  return {
    type,
    name,
  };
}
