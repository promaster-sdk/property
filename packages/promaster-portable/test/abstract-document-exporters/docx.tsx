import {assert} from "chai";
import {XmlWriter} from "../../src/abstract-document-exporters/docx/xml-writer";

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
    assert.equal(`<localName p1:localName="value" xmlns:p1="ns" xmlns="ns">Some content</localName>`, writer.getXml());
  });

});
