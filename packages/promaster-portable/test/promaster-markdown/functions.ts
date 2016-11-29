import {assert} from "chai";
import {makeHtml} from "../../src/promaster-markdown/index";

describe('makeHtml', () => {

  it.skip("should convert correctly", () => {
    const text = `sadfdf`;
    const markdown = makeHtml(text);
    assert.equal(markdown, "sadfdf");
  });

});
