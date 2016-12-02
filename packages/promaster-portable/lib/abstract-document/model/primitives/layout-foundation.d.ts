export interface LayoutFoundation<T> {
    bottom: T;
    left: T;
    right: T;
    top: T;
}
export declare function createLayoutFoundation<T>(top: T, bottom: T, left: T, right: T): LayoutFoundation<T>;
