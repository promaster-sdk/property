import {assert} from "chai";
import {makeHtml} from "../../src/promaster-markdown/index";

describe('filterPrettyPrintSimple', () => {

  it('should print a must be 1', () => {
    const text = `sadfdf`;
    const markdown = makeHtml(text);
    assert.equal(markdown, "sadfdf");
  });

});
