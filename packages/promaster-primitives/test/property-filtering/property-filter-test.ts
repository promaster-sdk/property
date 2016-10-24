import {assert} from 'chai';
import * as PropertyFilter from "../../src/property-filtering/property-filter";
import * as PropertyValueSet from "../../src/product-properties/property-value-set";
// import * as FilterEvaluator from "../../src/property-filtering/evaluation/filter-evaluator";
import * as Ast from "../../src/property-filtering/property-filter-ast";
import {parse} from "../../src/property-filtering/pegjs/property-filter-parser";

describe('main', () => {

    describe('parsing', () => {

        it('should_parse_a_equals_1', () => {
            const ast = parse("a=1");
            assert.deepEqual(ast, Ast.newEqualsExpr(
                Ast.newIdentifierExpr("a"),
                "equals",
                [Ast.newValueRangeExpr(Ast.newValueExpr("1"), Ast.newValueExpr("1"))]
            ));
        });

        it('should_parse_a_greater_than_1', () => {
            const ast = parse("a>1");
            assert.deepEqual(ast, Ast.newComparisonExpr(
                Ast.newIdentifierExpr("a"),
                "greater",
                Ast.newValueExpr("1")
            ));
        });

        it('should_parse_a_greater_or_equal_to_1', () => {
            const ast = parse("a>=1");
            assert.deepEqual(ast, Ast.newComparisonExpr(
                Ast.newIdentifierExpr("a"),
                "greaterOrEqual",
                Ast.newValueExpr("1")
            ));
        });

        it('should_parse_a_dot_b_equals_1', () => {
            const ast = parse("a.b=1");
            assert.deepEqual(ast, Ast.newEqualsExpr(
                Ast.newIdentifierExpr("a.b"),
                "equals",
                [Ast.newValueRangeExpr(Ast.newValueExpr("1"), Ast.newValueExpr("1"))]
            ));
        });

        it('should_parse_a_equals_20_Celsius', () => {
            const ast = parse("a=20:Celsius");
            assert.deepEqual(ast, Ast.newEqualsExpr(
                Ast.newIdentifierExpr("a"),
                "equals",
                [Ast.newValueRangeExpr(Ast.newValueExpr("20:Celsius"), Ast.newValueExpr("20:Celsius"))]
            ));
        });

        it('should_parse_a_equals_20_Celsius_range_30_Celsius', () => {
            const ast = parse("a=20:Celsius~30:Celsius");
            assert.deepEqual(ast, Ast.newEqualsExpr(
                Ast.newIdentifierExpr("a"),
                "equals",
                [Ast.newValueRangeExpr(Ast.newValueExpr("20:Celsius"), Ast.newValueExpr("30:Celsius"))]
            ));
        });

    });


    describe('is_syntax_valid', () => {

        it('empty_filter_is_valid', () => {
            assert.equal(PropertyFilter.isSyntaxValid(""), true);
        });

        it('should_accept_filter_containing_only_whitespaces', () => {
            assert.equal(PropertyFilter.isSyntaxValid("   "), true);
        });

        it('atomic_value_filter_is_valid', () => {
            assert.equal(PropertyFilter.isSyntaxValid("a=1"), true);
        });

        it('atomic_value_range_filter_is_valid', () => {
            assert.equal(PropertyFilter.isSyntaxValid("a=1~5"), true);
        });

        it('atomic_mixed_value_filter_is_valid', () => {
            assert.equal(PropertyFilter.isSyntaxValid("a=1~5,10"), true);
        });

        it('atomic_mixed_value_filter_with_negative_value_is_valid', () => {
            assert.equal(PropertyFilter.isSyntaxValid("a=1~5,-10"), true);
        });

        it('atomic_value_filter_with_negative_value_is_valid', () => {
            assert.equal(PropertyFilter.isSyntaxValid("ccc=-20"), true);
        });

        it('and_value_filter_is_valid', () => {
            assert.equal(PropertyFilter.isSyntaxValid("ccc=20&a=1"), true);
        });

        it('and_with_mixed_value_filter_is_valid', () => {
            assert.equal(PropertyFilter.isSyntaxValid("ccc=20&a=1,2,3~10&d=-50"), true);
        });

        it('or_value_filter_is_valid', () => {
            assert.equal(PropertyFilter.isSyntaxValid("ccc=20|a=1,2"), true);
        });

        it('and_or_mixed_value_filter_is_valid', () => {
            assert.equal(PropertyFilter.isSyntaxValid("ccc=20|a=1,2&d=5|z=50"), true);
        });

        it('and_or_mixed_value_filter_with_parenthesis_is_valid', () => {
            assert.equal(PropertyFilter.isSyntaxValid("(ccc=20|a=1,2)&d=5|z=50"), true);
        });

        it('greater_value_filter_syntax_is_valid', () => {
            assert.equal(PropertyFilter.isSyntaxValid("a>1"), true);
        });

        it('comparison_value_filter_syntax_is_invalid_for_range', () => {
            assert.equal(PropertyFilter.isSyntaxValid("a>1,2"), false);
        });

        it('any_string_is_invalid', () => {
            assert.equal(PropertyFilter.isSyntaxValid("szdxgdfhfgh"), false);
        });

        it('should_reject_nonfilter_containing_semicolon', () => {
            assert.equal(PropertyFilter.isSyntaxValid("func;"), false);
        });

        it('should_reject_nonfilter_containing_semicolon_and_parenthesis', () => {
            assert.equal(PropertyFilter.isSyntaxValid("func=(;"), false);
        });

        it('should_reject_nonfilter_containing_confusing_mix_of_valid_filter_symbols', () => {
            assert.equal(PropertyFilter.isSyntaxValid("func=();"), false);
        });

        it('should_accept_properties_when_filter_contains_one_matching_property_with_single_range_value2', () => {
            assert.equal(PropertyFilter.isSyntaxValid("unitsize=4060&filteraccess=5&filtertype=2~4,6~9,11-13"), false);
        });

        it('should_accept_whitespace', () => {
            assert.equal(PropertyFilter.isSyntaxValid("a = 2&b=\"test\""), true);
        });

    });

    describe('Match_PVS', () => {

        it('should_not_match_missing_property', () => {
            const pvs = PropertyValueSet.fromString("firstprop=2");
            const f = PropertyFilter.fromString("secondprop=2");
            assert.equal(PropertyFilter.isValid(pvs, f), false);
        });

        it('should_not_match_null', () => {
            const pvs = PropertyValueSet.fromString("firstprop=2");
            const f = PropertyFilter.fromString("firstprop=null");
            assert.equal(PropertyFilter.isValid(pvs, f), false);
        });

        it('should_accept_properties_when_filter_contains_several_matching_properties_with_single_value', () => {
            const pvs = PropertyValueSet.fromString("a=1;b=2;c=3;d=4;e=5;f=6;");
            const f = PropertyFilter.fromString("a=1&c=3&f=6");
            assert.equal(PropertyFilter.isValid(pvs, f), true);
        });

        it('should_accept_properties_when_filter_contains_one_matching_property_with_single_value', () => {
            const pvs = PropertyValueSet.fromString("a=1;b=2;c=3;d=4;e=5;f=6;");
            const f = PropertyFilter.fromString("a=1");
            assert.equal(PropertyFilter.isValid(pvs, f), true);
        });

        it('should_accept_properties_when_filter_contains_one_matching_property_with_single_range_value', () => {
            const pvs = PropertyValueSet.fromString("a=1;b=2;c=3;d=4;e=5;f=6;");
            const f = PropertyFilter.fromString("a=-1~10");
            assert.equal(PropertyFilter.isValid(pvs, f), true);
        });

        it('should_evaluate_to_false_if_matching_against_non_existent_property', () => {
            const pvs = PropertyValueSet.fromString("property1=1");
            const f = PropertyFilter.fromString("property1=nonexistentproperty");
            assert.equal(PropertyFilter.isValid(pvs, f), false);
        });

        it('should_accept_properties_when_filter_contains_one_matching_property_with_set_of_values', () => {
            const pvs = PropertyValueSet.fromString("a=1;b=2;c=3;d=4;e=5;f=6;");
            const f = PropertyFilter.fromString("b=1,2,5");
            assert.equal(PropertyFilter.isValid(pvs, f), true);
        });

        it('should_accept_properties_when_filter_contains_one_matching_property_with_mixed_values', () => {
            const pvs = PropertyValueSet.fromString("a=1;b=2;c=3;d=4;e=5;f=6;");
            const f = PropertyFilter.fromString("b=-1,1,2,5,10~15");
            assert.equal(PropertyFilter.isValid(pvs, f), true);
        });

        it('should_support_properties_on_right_hand', () => {
            const pvs = PropertyValueSet.fromString("a=10;b=2;");
            const f = PropertyFilter.fromString("a>=b");
            assert.equal(PropertyFilter.isValid(pvs, f), true);
        });

        it('should_support_not_present_properties', () => {
            const pvs = PropertyValueSet.fromString("a=10;b=2;");
            const f = PropertyFilter.fromString("a>=c");
            assert.equal(PropertyFilter.isValid(pvs, f), false);
        });

        it('amount_value_is_supported', () => {
            assert.equal(PropertyFilter.isSyntaxValid("a>=20:Celsius&b=20:Meter~30:Meter"), true);
        });

        it('not_equals_is_supported', () => {
            assert.equal(PropertyFilter.isSyntaxValid("a!=20"), true);
        });

        it('not_equals_works_as_expected1', () => {
            const pvs = PropertyValueSet.fromString("a=5");
            const f = PropertyFilter.fromString("a!=20");
            assert.equal(PropertyFilter.isValid(pvs, f), true);
        });

        it('not_equals_works_as_expected2', () => {
            const pvs = PropertyValueSet.fromString("a=5");
            const f = PropertyFilter.fromString("a!=5");
            assert.equal(PropertyFilter.isValid(pvs, f), false);
        });

        it('supports_settings1', () => {
            const pvs = PropertyValueSet.fromString("a=5:Celsius");
            const f = PropertyFilter.fromString("a>2:Celsius");
            assert.equal(PropertyFilter.isValid(pvs, f), true);
        });

        it('supports_settings2', () => {
            const pvs = PropertyValueSet.fromString("a=5:Celsius");
            const f = PropertyFilter.fromString("a<2:Celsius");
            assert.equal(PropertyFilter.isValid(pvs, f), false);
        });

        it('supports_null', () => {
            assert.equal(PropertyFilter.isSyntaxValid("a=null"), true);
        });

        it('supports_null_validation', () => {
            const pvs = PropertyValueSet.fromString("b=5");
            const filter = PropertyFilter.fromString("a=null");
            assert.equal(PropertyFilter.isValid(pvs, filter), true);
        });

        // it('supports_null_validation_using_evaluator', () => {
        //     const pvs = PropertyValueSet.fromString("b=5");
        //     const filter = PropertyFilter.fromString("a=null");
        //     const evaluator = new FilterEvaluator();
        //     const result = evaluator._evaluate(filter.ast, pvs, false);
        //     assert.equal(result, true);
        // });

        it('supports_null_validation2', () => {
            const pvs = PropertyValueSet.fromString("a=2");
            const filter = PropertyFilter.fromString("a=null");
            assert.equal(PropertyFilter.isValid(pvs, filter), false);
        });

        it('supports_string', () => {
            const pvs = PropertyValueSet.fromString('a="test"');
            const filter = PropertyFilter.fromString('a="test"');
            assert.equal(PropertyFilter.isValid(pvs, filter), true);
        });

        it('supports_dot_in_propertynames', () => {
            const pvs = PropertyValueSet.fromString("a.b=1");
            const filter = PropertyFilter.fromString("a.b>0");

            assert.equal(PropertyFilter.isValid(pvs, filter), true);
        });

        it('supports_dot_in_propertynames_inverse', () => {
            const pvs = PropertyValueSet.fromString("a.b=1");
            const f = PropertyFilter.fromString("a.b>2");
            assert.equal(PropertyFilter.isValid(pvs, f), true);
        });

        it('should not assert 5.2:Meter as valid for 1 to 5 Meter range', () => {
            const pvs = PropertyValueSet.fromString("a=5.2:Meter");
            const f = PropertyFilter.fromString("a=1:Meter~5.0:Meter");
            assert.equal(PropertyFilter.isValid(pvs, f), false);
        });

    });

    describe('getReferencedProperties', () => {

        it('should return referenced properties', () => {
            const filter = PropertyFilter.fromString("a>b&c=1|d<2");
            const references = PropertyFilter.getReferencedProperties(filter);
            assert.equal(references.size, 4);
        });

    });

    describe('equals', () => {

        it('should see two PropertyFilters with same values as equal', () => {
            const filter1 = PropertyFilter.fromString("a>b&c=1|d<2");
            const filter2 = PropertyFilter.fromString("a>b&c=1|d<2");
            assert.equal(PropertyFilter.equals(filter2, filter1), true);
        });

    });

});
