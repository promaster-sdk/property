import * as React from "react";
import * as AD from "../../src/abstract-document";
import {AbstractDoc, Section, Paragraph, TextRun, render} from "../../src/abstract-document-jsx";

export function AbstractDocumentExample() {
  const page = AD.MasterPage.create();
  const doc = render(
    <AbstractDoc>
      <Section page={page}>
        <Paragraph>
          <TextRun text="Test" />
        </Paragraph>
        {["a", "b", "c"].map((c) => (
          <Paragraph>
            <TextRun text={c} />
          </Paragraph>))}
        <Paragraph />
      </Section>
    </AbstractDoc>
  );

  return (
    <div>
      <h1>Pdf</h1>
      <pre>
        {JSON.stringify(doc, undefined, 2)}
      </pre>
    </div>);
}