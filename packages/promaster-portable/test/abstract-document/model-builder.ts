import {assert} from "chai";
import {DocumentBuilder} from "../../src/abstract-document/index";
import {createPageStyle} from "../../src/abstract-document/model/styles/page-style";
import {createHeaderStyle} from "../../src/abstract-document/model/styles/header-style";
import {createMasterPage} from "../../src/abstract-document/model/page/master-page";
import {helloWorldDoc} from "./hello-word-doc";

describe('model builder', () => {

  it("should build", () => {
    const builder = new DocumentBuilder();
    const doc = builder.build();
    assert.isOk(doc);
  });

  it("should build hello world", () => {

    const pageStyle = createPageStyle("A4", "Portrait", createHeaderStyle(undefined, 5.0 * 595.0 / 210.0));
    const page = createMasterPage(pageStyle, []);
    const builder = new DocumentBuilder();
    builder.beginSection(page);
    builder.beginParagraph();
    builder.insertTextRun("HELLO WORLD!");
    builder.endParagraph();
    builder.endSection();
    const doc = builder.build();
    // Get rid of keys that have undefined value before doing comparision
    // assert.deepEqual(stripUndefinedKeys(doc), helloWorldDoc);
    assert.deepEqual(doc, helloWorldDoc);
  });

});
