import { TableAlignment } from "../model/enums/table-alignment";
import { TableProperties } from "../model/properties/table-properties";
export declare class TablePropertiesBuilder {
    alignment: TableAlignment | undefined;
    build(): TableProperties;
}
