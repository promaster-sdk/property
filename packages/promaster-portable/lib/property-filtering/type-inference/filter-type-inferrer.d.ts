import { PropertyFilterAst as Ast, PropertyFilter } from "@promaster/promaster-primitives";
import { ExprType } from "./expr-type";
export declare function inferTypeMap(filter: PropertyFilter.PropertyFilter): Map<Ast.Expr, ExprType>;
