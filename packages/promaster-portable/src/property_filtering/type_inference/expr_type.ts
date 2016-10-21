export enum ExprTypeEnum
{
  Unknown,
  Bool,
  Amount,
  Property,
  Text,
  Range
}


export class ExprType {

  private _exprTypeEnum:ExprTypeEnum;
  private _propertyName:string;

  constructor(exprTypeEnum:ExprTypeEnum = ExprTypeEnum.Unknown, propertyName:string = null) {
    this._exprTypeEnum = exprTypeEnum;
    this._propertyName = propertyName;
  }

  get exprTypeEnum():ExprTypeEnum {
    return this._exprTypeEnum;
  }

  get propertyName():string {
    return this._propertyName;
  }
}
