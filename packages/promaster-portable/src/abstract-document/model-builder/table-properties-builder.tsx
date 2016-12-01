import {TableAlignment} from "../model/enums/table-alignment";
import {TableProperties, createTableProperties} from "../model/properties/table-properties";

export class TablePropertiesBuilder {

  alignment: TableAlignment | undefined;

  build(): TableProperties {
    return createTableProperties(this.alignment);
  }

}
