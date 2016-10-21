import {Amount} from "../../../src/class/measure/amount";
import {Unit} from "../../../src/class/measure/unit/unit";
import {IQuantity} from "../../../src/class/measure/quantity/IQuantity";

export class AmountBuilder<T extends IQuantity> {

   _value:number = 20.0;
   _unit:Unit<T>;

   WithValue( value:number) :AmountBuilder<T>{
    this._value = value;
    return this;
  }

   WithUnit( unit:Unit<T>):AmountBuilder<T> {
     this._unit = unit;
    return this;
  }

  Build() :Amount<T> {
    return Amount.create<T>(this._value, this._unit);
  }

}

