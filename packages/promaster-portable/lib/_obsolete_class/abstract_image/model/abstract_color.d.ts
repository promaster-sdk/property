export declare class AbstractColor {
    a: number;
    r: number;
    g: number;
    b: number;
    static fromArgb(a: number, r: number, g: number, b: number): AbstractColor;
    static fromString(s: string): AbstractColor;
    constructor(a: number, r: number, g: number, b: number);
}
export declare abstract class AbstractColors {
    static Black: AbstractColor;
    static Blue: AbstractColor;
    static Brown: AbstractColor;
    static Cyan: AbstractColor;
    static DarkGray: AbstractColor;
    static Gray: AbstractColor;
    static Green: AbstractColor;
    static LightGray: AbstractColor;
    static Magenta: AbstractColor;
    static Orange: AbstractColor;
    static Purple: AbstractColor;
    static Red: AbstractColor;
    static Transparent: AbstractColor;
    static White: AbstractColor;
    static Yellow: AbstractColor;
    static LightBlue: AbstractColor;
}
