import * as DocxConstants from "./docx-constants";
import {XMLContainer} from "./xml-container";

export class RefContainer extends XMLContainer {

  _references: Array<string> = [];

  constructor() {
    super();
    this.XMLWriter.WriteStartDocument(true);
    this.XMLWriter.WriteStartElement("Relationships", DocxConstants.RelationNamespace);
  }

  AddReference(refId: string, filePath: string, type: string): void {

    if (filePath.startsWith("/") == false)
      filePath = "/" + filePath;
    this.AddReference2(refId, filePath, type);
  }

  AddReference2(refId: string, filePath: string, type: string): void {
    if (this._references.indexOf(refId) !== -1)
      return;
    this.XMLWriter.WriteStartElement("Relationship");
    this.XMLWriter.WriteAttributeString("Type", type);
    filePath = filePath.replace("\\", "/");
    this.XMLWriter.WriteAttributeString("Target", filePath);
    this.XMLWriter.WriteAttributeString("Id", refId);
    this.XMLWriter.WriteEndElement();
    this._references.push(refId);
  }

  get count(): number {
    return this._references.length;
  }

  finish(): void {
    this.XMLWriter.WriteEndElement();
    super.finish();
  }

  close(): void {
    super.close();
    // this._references.clear();
    this._references = [];
  }

}
