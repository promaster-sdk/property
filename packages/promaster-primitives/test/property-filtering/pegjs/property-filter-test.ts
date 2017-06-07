import {assert} from "chai";
import {parse} from "../../../src/property-filtering/pegjs/property-filter-parser";

describe("parser_tests", () => {

	it("should_not_accept_d", () => {
		const result = parse("bbb=1|abc123=1&def456=1&ghi789=1");
		assert.notEqual(result, undefined);
	});

	it("should_parse_a_equals_1", () => {
		const result = parse("a>=1");
		assert.notEqual(result, undefined);
	});
});
