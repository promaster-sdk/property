import {assert} from "chai";
import {PropertyFilter} from "promaster-primitives";
import * as PrettyPrinting from "../../src/property_filtering/index";
import {FilterPrettyPrintMessagesEnglish} from "../../src/property_filtering/index";

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
        const pretty = PrettyPrinting.filterPrettyPrintIndented(messages, 2, "*", PropertyFilter.fromString('a=1'));
        assert.equal(pretty, "a must be 1");
    });

    it('should print b must be 2\\n**and\\na must be 1', () => {
        const pretty = PrettyPrinting.filterPrettyPrintIndented(messages, 2, "*", PropertyFilter.fromString('a=1&b=2'));
        assert.equal(pretty, "b must be 2\n**and\na must be 1");
    });

});
