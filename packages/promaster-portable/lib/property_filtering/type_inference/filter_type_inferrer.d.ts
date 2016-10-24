import { PropertyFilterAst as Ast, PropertyFilter } from "promaster-sdk/promaster-primitives";
import { ExprType } from "./expr_type";
export declare function inferTypeMap(filter: PropertyFilter.PropertyFilter): Map<Ast.Expr, ExprType>;
