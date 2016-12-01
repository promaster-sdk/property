
export interface IBuilder<T> {
  add(child: T): void ,
  // addRange(children: Array<T>): void ;
}
