import {XMLContainer} from "./xml-container";
import {RefContainer} from "./ref-container";

export class DocumentContainer extends XMLContainer {
  filePath: string;
  fileName: string;
  refId: string;
  contentType: string;
  readonly references: RefContainer = new RefContainer();
}
