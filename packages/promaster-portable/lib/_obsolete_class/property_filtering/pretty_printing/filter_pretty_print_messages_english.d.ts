import { ComparisonOperationType, EqualsOperationType, PropertyValue } from "promaster-primitives/lib/classes";
import { FilterPrettyPrintMessages } from "./filter_pretty_print_messages";
export declare class FilterPrettyPrintMessagesEnglish implements FilterPrettyPrintMessages {
    comparisionOperationMessage(op: ComparisonOperationType, left: string, right: string): string;
    equalsOperationMessage(op: EqualsOperationType, left: string, right: string): string;
    rangeMessage(min: string, max: string): string;
    andMessage(): string;
    orMessage(): string;
    propertyNameMessage(propertyName: string): string;
    propertyValueItemMessage(propertyName: string, pv: PropertyValue): string;
    nullMessage(): string;
    static _comparisonOperationTypeToString(type: ComparisonOperationType): string;
    static _equalsOperationTypeToString(type: EqualsOperationType): string;
}
