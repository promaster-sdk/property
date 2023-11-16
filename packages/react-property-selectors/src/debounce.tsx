// (From underscore.js)
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce(func: Function, wait: number, immediate?: boolean): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let timeout: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: any): void {
    const context = this; //eslint-disable-line
    const args = arguments; //eslint-disable-line
    const later = function (): void {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout!);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}
