export type ZipList<T> = {
  readonly head: ReadonlyArray<T>;
  readonly current: T;
  readonly tail: ReadonlyArray<T>;
};

export function toArray<T>(z: ZipList<T>): ReadonlyArray<T> {
  return [...z.head, z.current, ...z.tail];
}

export function fromArray<T>(arr: ReadonlyArray<T>, current: T, compare: (a: T, b: T) => boolean): ZipList<T> {
  if (arr.length < 0) {
    return {
      head: [],
      current: current,
      tail: [],
    };
  }

  const currentInArray = arr.find((f) => compare(f, current));
  if (!currentInArray) {
    return {
      head: arr,
      current: current,
      tail: [],
    };
  }

  const idx = arr.indexOf(currentInArray);

  return {
    head: arr.slice(0, idx),
    current: currentInArray,
    tail: arr.length < idx + 1 ? [] : arr.slice(idx + 1),
  };
}

export function map<T, U>(orig: ZipList<T>, mapper: (a: T) => U): ZipList<U> {
  return {
    head: orig.head.map(mapper),
    current: mapper(orig.current),
    tail: orig.tail.map(mapper),
  };
}
