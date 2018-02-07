import { assert } from "chai";
import { makeHtml } from "../../../src/promaster-markdown/index";

describe("makeHtml", () => {
  it("should convert correctly", () => {
    const text = `sadfdf`;
    const markdown = makeHtml(text);
    assert.equal(markdown, "<p>sadfdf</p>");
  });

  // it("should support sub and sup", () => {
  //   const text = `sadfdf^1^~2~`;
  //   const markdown = makeHtml(text);
  //   assert.equal(markdown, "<p>sadfdf<sup>1</sup><sub>2</sub></p>");
  // });
});
