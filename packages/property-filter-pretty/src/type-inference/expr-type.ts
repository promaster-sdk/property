/* eslint-disable functional/no-this-expression */
export enum ExprTypeEnum {
  Unknown,
  Bool,
  Amount,
  Property,
  Text,
  Range,
}

// eslint-disable-next-line functional/no-class
export class ExprType {
  private readonly _exprTypeEnum: ExprTypeEnum;
  private readonly _propertyName: string | undefined;

  constructor(exprTypeEnum: ExprTypeEnum = ExprTypeEnum.Unknown, propertyName: string | undefined = undefined) {
    this._exprTypeEnum = exprTypeEnum;
    this._propertyName = propertyName;
  }

  get exprTypeEnum(): ExprTypeEnum {
    return this._exprTypeEnum;
  }

  get propertyName(): string | undefined {
    return this._propertyName;
  }
}
