export declare enum ExprTypeEnum {
    Unknown = 0,
    Bool = 1,
    Amount = 2,
    Property = 3,
    Text = 4,
    Range = 5,
}
export declare class ExprType {
    private _exprTypeEnum;
    private _propertyName;
    constructor(exprTypeEnum?: ExprTypeEnum, propertyName?: string);
    readonly exprTypeEnum: ExprTypeEnum;
    readonly propertyName: string;
}
