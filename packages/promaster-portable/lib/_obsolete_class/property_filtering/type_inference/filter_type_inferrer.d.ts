import { PropertyFilter, Expr } from "promaster-primitives/lib/classes";
import { ExprType } from "./expr_type";
export declare function inferTypeMap(filter: PropertyFilter): Map<Expr, ExprType>;
