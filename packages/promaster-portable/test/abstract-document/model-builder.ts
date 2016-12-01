import {assert} from "chai";
import {DocumentBuilder} from "../../src/abstract-document/index";

describe('model builder', () => {

  it("should build correctly", () => {
    const builder = new DocumentBuilder();
    const doc = builder.build();
    assert.equal(doc, "sadfdf");
  });

});
