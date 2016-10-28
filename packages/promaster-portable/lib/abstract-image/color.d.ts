export interface Color {
    readonly a: number;
    readonly r: number;
    readonly g: number;
    readonly b: number;
}
export declare function fromArgb(a: number, r: number, g: number, b: number): Color;
export declare function fromString(s: string): Color | undefined;
export declare const black: Color;
export declare const blue: Color;
export declare const brown: Color;
export declare const cyan: Color;
export declare const darkGray: Color;
export declare const gray: Color;
export declare const green: Color;
export declare const lightGray: Color;
export declare const magenta: Color;
export declare const orange: Color;
export declare const purple: Color;
export declare const red: Color;
export declare const transparent: Color;
export declare const white: Color;
export declare const yellow: Color;
export declare const lightBlue: Color;
