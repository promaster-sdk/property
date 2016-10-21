import { Expr, ComparisonOperationType, EqualsOperationType } from "promaster-primitives/lib/classes";
export declare class FilterPrinter {
    print(expr: Expr): string;
    _print(expr: Expr, s: string): void;
    static _comparisonOperationTypeToString(type: ComparisonOperationType): string;
    static _equalsOperationTypeToString(type: EqualsOperationType): string;
}
