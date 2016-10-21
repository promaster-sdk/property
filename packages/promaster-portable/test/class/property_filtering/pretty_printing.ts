import { assert } from 'chai';
import {PropertyFilter} from "promaster-primitives";
import {filterPrettyPrintSimple, filterPrettyPrintIndented} from "../../../src/class/property_filtering/index";
import {FilterPrettyPrintMessagesEnglish} from "../../../src/class/property_filtering/pretty_printing/filter_pretty_print_messages_english";

describe('filterPrettyPrintSimple', () => {

	it('should print a must be 1', () => {
		const pretty = filterPrettyPrintSimple(PropertyFilter.fromString('a=1'));
		assert.equal(pretty, "a must be 1");
	});

	it('should print a must be 1 and b must be 2', () => {
		const pretty = filterPrettyPrintSimple(PropertyFilter.fromString('a=1&b=2'));
		assert.equal(pretty, "a must be 1 and b must be 2");
	});

});

describe('filterPrettyPrintIndented', () => {

	const messages = new FilterPrettyPrintMessagesEnglish();
	const appliedPrint = filterPrettyPrintIndented(messages, 2, "*");

	it('should print a must be 1', () => {
		const pretty = appliedPrint(PropertyFilter.fromString('a=1'));
		assert.equal(pretty, "a must be 1");
	});

	it('should print b must be 2\\n**and\\na must be 1', () => {
		const pretty = appliedPrint(PropertyFilter.fromString('a=1&b=2'));
		assert.equal(pretty, "b must be 2\n**and\na must be 1");
	});

});

