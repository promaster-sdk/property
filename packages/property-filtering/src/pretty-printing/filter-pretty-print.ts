import { PropertyFilter } from "@promaster/property";

// The pretty printers can be partially applied to implement this function
export type FilterPrettyPrint = (f: PropertyFilter.PropertyFilter) => string;
