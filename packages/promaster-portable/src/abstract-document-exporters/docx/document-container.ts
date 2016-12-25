import {RefContainer} from "./ref-container";
import {XmlWriter} from "./xml-writer";

export class DocumentContainer {
  filePath: string;
  fileName: string;
  refId: string;
  contentType: string;
  readonly references: RefContainer = new RefContainer();

  private readonly _xmlWriter: XmlWriter = new XmlWriter();

  get XMLWriter(): XmlWriter {
    return this._xmlWriter;
  }

}
