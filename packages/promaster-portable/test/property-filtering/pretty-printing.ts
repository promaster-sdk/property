import {assert} from "chai";
import {PropertyFilter} from "@promaster/promaster-primitives";
import * as PrettyPrinting from "../../src/property-filtering/index";
import {FilterPrettyPrintMessagesEnglish} from "../../src/property-filtering/index";

describe('filterPrettyPrintSimple', () => {

  it('should print a must be 1', () => {
    const pretty = PrettyPrinting.filterPrettyPrintSimple(PropertyFilter.fromString('a=1'));
    assert.equal(pretty, "a must be 1");
  });

  it('should print a must be 1 and b must be 2', () => {
    const pretty = PrettyPrinting.filterPrettyPrintSimple(PropertyFilter.fromString('a=1&b=2'));
    assert.equal(pretty, "a must be 1 and b must be 2");
  });

});

describe('filterPrettyPrintIndented', () => {

  const messages = FilterPrettyPrintMessagesEnglish;

  it('should print a must be 1', () => {
    const pretty = PrettyPrinting.filterPrettyPrintIndented(messages, 0, "*", PropertyFilter.fromString('a=1'));
    assert.equal(pretty, "a must be a_1");
  });

  it('should for min<max print min must be less than max', () => {
    const pretty = PrettyPrinting.filterPrettyPrintIndented(messages, 0, "*", PropertyFilter.fromString('min<max'));
    assert.equal(pretty, "min must be less than max");
  });

  it('should print b must be 2\\n**and\\na must be 1', () => {
    const pretty = PrettyPrinting.filterPrettyPrintIndented(messages, 0, "**", PropertyFilter.fromString('a=1&b=2'));
    assert.equal(pretty, "a must be a_1\n**and\nb must be b_2");
  });

});

