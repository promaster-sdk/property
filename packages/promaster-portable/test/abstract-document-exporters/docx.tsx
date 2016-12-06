import {assert} from "chai";
import {XmlWriter} from "../../src/abstract-document-exporters/docx/xml-writer";
import {DocxDocumentRenderer} from "../../src/abstract-document-exporters/docx/docx-document-renderer";
import {helloWorldDoc} from "../abstract-document/hello-word-doc";

describe('XmlWriter', () => {

  it("should write with namespace and prefix", () => {
    const writer = new XmlWriter();
    writer.WriteStartElement("localName", "ns", "prefix");
    writer.WriteAttributeString("localName", "value", "ns", "prefix");
    writer.WriteString("Some content");
    writer.WriteEndElement();
    assert.equal(`<prefix:localName prefix:localName="value" xmlns:prefix="ns">Some content</prefix:localName>`, writer.getXml());
  });

  it("should write with namespace without prefix", () => {
    const writer = new XmlWriter();
    writer.WriteStartElement("localName", "ns");
    writer.WriteAttributeString("localName", "value", "ns");
    writer.WriteString("Some content");
    writer.WriteEndElement();
    assert.equal(`<localName p1:localName="value" xmlns="ns" xmlns:p1="ns">Some content</localName>`, writer.getXml());
  });

  it("should write without namespace", () => {
    const writer = new XmlWriter();
    writer.WriteStartElement("localName");
    writer.WriteAttributeString("localName", "value");
    writer.WriteString("Some content");
    writer.WriteEndElement();
    assert.equal(`<localName localName="value">Some content</localName>`, writer.getXml());
  });

});

describe('DocxDocumentRenderer', () => {

  it("should write hello world document", () => {
    const exporter = new DocxDocumentRenderer(null, null);
    const doc = helloWorldDoc;
    exporter.WriteResultToZipDictionary(doc);
  });


});
