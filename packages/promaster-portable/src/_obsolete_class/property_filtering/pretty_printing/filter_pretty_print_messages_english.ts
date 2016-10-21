import {
	ComparisonOperationType,
	EqualsOperationType,
	PropertyValue
} from "promaster-primitives/lib/classes";
import {FilterPrettyPrintMessages} from "./filter_pretty_print_messages";

export class FilterPrettyPrintMessagesEnglish implements FilterPrettyPrintMessages {

	comparisionOperationMessage(op:ComparisonOperationType, left:string, right:string):string {
		return `${left} ${FilterPrettyPrintMessagesEnglish._comparisonOperationTypeToString(op)} ${right}`;
	}

	equalsOperationMessage(op:EqualsOperationType, left:string, right:string):string {
		return `${left} ${FilterPrettyPrintMessagesEnglish._equalsOperationTypeToString(op)} ${right}`;
	}

	rangeMessage(min:string, max:string):string {
		return `between ${min} and ${max}`;
	}

	andMessage():string {
		return "and";
	}

	orMessage():string {
		return "or";
	}

	propertyNameMessage(propertyName:string):string {
		return propertyName;
	}

	propertyValueItemMessage(propertyName:string, pv:PropertyValue):string {
		return `${propertyName}_${pv}`;
	}

	nullMessage():string {
		return "null";
	}

	static _comparisonOperationTypeToString(type:ComparisonOperationType):string {
		switch (type) {
			case ComparisonOperationType.LessOrEqual:
				return "must be less than or equal to";
			case ComparisonOperationType.GreaterOrEqual:
				return "must be greater than or equal to";
			case ComparisonOperationType.Less:
				return "must be less than";
			case ComparisonOperationType.Greater:
				return "must be greater than";
			default:
				throw "Unknown ComparisonOperationType ";
		}
	}

	static _equalsOperationTypeToString(type:EqualsOperationType):string {
		switch (type) {
			case EqualsOperationType.Equals:
				return "must be";
			case EqualsOperationType.NotEquals:
				return "must not be";
			default:
				throw "Unknown EqualsOperationType ";
		}
	}

}

