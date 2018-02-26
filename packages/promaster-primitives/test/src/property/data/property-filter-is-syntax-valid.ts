export const tests = [
  {
    name: "empty_filter_is_valid",
    f: "",
    result: true
  },
  {
    name: "should_accept_filter_containing_only_whitespaces",
    f: "   ",
    result: true
  },
  {
    name: "atomic_value_filter_is_valid",
    f: "a=1",
    result: true
  },
  {
    name: "atomic_value_range_filter_is_valid",
    f: "a=1~5",
    result: true
  },
  {
    name: "atomic_mixed_value_filter_is_valid",
    f: "a=1~5,10",
    result: true
  },
  {
    name: "atomic_mixed_value_filter_with_negative_value_is_valid",
    f: "a=1~5,-10",
    result: true
  },
  {
    name: "atomic_value_filter_with_negative_value_is_valid",
    f: "ccc=-20",
    result: true
  },
  {
    name: "and_value_filter_is_valid",
    f: "ccc=20&a=1",
    result: true
  },
  {
    name: "and_with_mixed_value_filter_is_valid",
    f: "ccc=20&a=1,2,3~10&d=-50",
    result: true
  },
  {
    name: "or_value_filter_is_valid",
    f: "ccc=20|a=1,2",
    result: true
  },
  {
    name: "and_or_mixed_value_filter_is_valid",
    f: "ccc=20|a=1,2&d=5|z=50",
    result: true
  },
  {
    name: "and_or_mixed_value_filter_with_parenthesis_is_valid",
    f: "(ccc=20|a=1,2)&d=5|z=50",
    result: true
  },
  {
    name: "greater_value_filter_syntax_is_valid",
    f: "a>1",
    result: true
  },
  {
    name: "comparison_value_filter_syntax_is_invalid_for_range",
    f: "a>1,2",
    result: false
  },
  {
    name: "any_string_is_invalid",
    f: "szdxgdfhfgh",
    result: false
  },
  {
    name: "should_reject_nonfilter_containing_semicolon",
    f: "func;",
    result: false
  },
  {
    name: "should_reject_nonfilter_containing_semicolon_and_parenthesis",
    f: "func=(;",
    result: false
  },
  {
    name:
      "should_reject_nonfilter_containing_confusing_mix_of_valid_filter_symbols",
    f: "func=();",
    result: false
  },
  {
    name:
      "should_accept_properties_when_filter_contains_one_matching_property_with_single_range_value2",
    f: "unitsize=4060&filteraccess=5&filtertype=2~4,6~9,11-13",
    result: false
  },
  {
    name: "should_accept_whitespace",
    f: 'a = 2&b="test"',
    result: true
  },
  {
    name: "amount_value_is_supported",
    f: "a>=20:Celsius&b=20:Meter~30:Meter",
    result: true
  },
  {
    name: "not_equals_is_supported",
    f: "a!=20",
    result: true
  },
  {
    name: "supports_null",
    f: "a=null",
    result: true
  }
];
