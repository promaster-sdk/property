import {assert} from "chai";
import {DocumentBuilder} from "../../src/abstract-document/index";

describe('model builder', () => {

  it("should build", () => {
    const builder = new DocumentBuilder();
    const doc = builder.build();
    assert.isOk(doc);
  });

});
