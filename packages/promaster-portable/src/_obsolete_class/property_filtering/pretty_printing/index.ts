import {PropertyFilter} from "promaster-primitives/lib/classes";
import {FilterPrettyPrintMessagesEnglish} from "./filter_pretty_print_messages_english";

export type FilterPrettyPrint = (f:PropertyFilter) => string;

export {FilterPrettyPrintMessages} from './filter_pretty_print_messages';
export {FilterPrettyPrintMessagesEnglish} from './filter_pretty_print_messages_english';

// These functions can be partially applied to create a function of type FilterPrettyPrint
export {filterPrettyPrintIndented} from "./filter_pretty_print_indented";
export {filterPrettyPrintSimple} from "./filter_pretty_print_simple";

