import {assert} from "chai";
import {buildAllPropertyValueSets} from "../../src/variant-listing";

describe('buildAllPropertyValueSets', () => {

  it('should print a must be 1', () => {
    const sets = buildAllPropertyValueSets(null, null, null);
    assert.equal(sets.length, 200);
  });

});
