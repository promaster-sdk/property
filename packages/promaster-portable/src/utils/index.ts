export function exhaustiveCheck(x: never): never {
  throw new Error(`ERROR! The value ${x} should be of type never.`);
}
