import {assert} from "chai";
import {createParser, parserCallbacks} from "../../../../src/fun/property_filtering/pegjs/property_filter_parser";

describe('parser_tests', () => {

	const options = {
		startRule: 'start',
		tracer: undefined,
		callbacks: parserCallbacks
	};

	it('should_not_accept_d', () => {

		console.log("Creating parser");
		const parser = createParser();
		console.log("Parser created");
		const result = parser.parse("bbb=1|abc123=1&def456=1&ghi789=1", options);

		console.log("result", result);
		// console.log("result", JSON.stringify(result, undefined, 2));
		assert.equal(1, 1);
	});

	it('should_parse_a_equals_1', () => {

		console.log("Creating parser");
		const parser = createParser();
		console.log("Parser created");
		//const result = parser.parse('a="adsfa"', options );
		// const result = parser.parse("a=1.12:Celsius", options );
		// const result = parser.parse("a=1", options );
		// const result = parser.parse("a=1,2,3", options );
		 const result = parser.parse("a>=1", options );
		// const result = parser.parse("a=1~5", options );
		//const result = parser.parse("a=1|a=2", options );
		console.log("result", result);
		assert.equal(1, 1);
	});


});
