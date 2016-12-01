// export interface StyleKey {
//   name: string,
//   type: string,
// }

export type StyleKey = string;

export function createStyleKey(type: string, name: string): StyleKey {
  // return {
  //   type,
  //   name,
  // };
  return `${type}_${name}`;
}
