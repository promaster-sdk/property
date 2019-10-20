import { Amount } from "uom";
import * as PropertyValue from "../../property-value";
import { compareNumbers } from "../../utils/compare-utils";

export const tests = [
  {
    name: "should_not_short_circuit_evaluation_when_using_comma",
    pvs: "a=0;b=3",
    f: "a=0,1&b=4",
    result: false
  },
  {
    name: "equals_integer_true",
    pvs: "a=1",
    f: "a=1",
    result: true
  },
  {
    name: "equals_integer_false",
    pvs: "a=1",
    f: "a=2",
    result: false
  },
  {
    name: "greater_than_integer_true",
    pvs: "a=1",
    f: "a>0",
    result: true
  },
  {
    name: "greater_than_integer_false",
    pvs: "a=1",
    f: "a>1",
    result: false
  },
  {
    name: "greater_than_integer_name_to_integer_name",
    pvs: "a=1;b=2",
    f: "b>a",
    result: true
  },
  {
    name: "greater_than_amount_name_to_amount_name",
    pvs: "a=1:Meter;b=2:Meter",
    f: "b>a",
    result: true
  },
  {
    name: "equals_amount_name_to_amount_name_false",
    pvs: "a=1:Meter;b=1:CentiMeter",
    f: "b=a",
    result: false
  },
  {
    name: "equals_amount_name_to_amount_name_true",
    pvs: "a=1:Meter;b=1:Meter",
    f: "b=a",
    result: true
  },
  {
    name: "should_not_match_missing_property",
    pvs: "firstprop=2",
    f: "secondprop=2",
    result: false
  },
  {
    name: "should_not_match_null",
    pvs: "firstprop=2",
    f: "firstprop=null",
    result: false
  },
  {
    name:
      "should_accept_properties_when_filter_contains_several_matching_properties_with_single_value",
    pvs: "a=1;b=2;c=3;d=4;e=5;f=6;",
    f: "a=1&c=3&f=6",
    result: true
  },
  {
    name:
      "should_accept_properties_when_filter_contains_one_matching_property_with_single_value",
    pvs: "a=1;b=2;c=3;d=4;e=5;f=6;",
    f: "a=1",
    result: true
  },
  {
    name:
      "should_accept_properties_when_filter_contains_one_matching_property_with_single_range_value",
    pvs: "a=1;b=2;c=3;d=4;e=5;f=6;",
    f: "a=-1~10",
    result: true
  },
  {
    name: "should_evaluate_to_false_if_matching_against_non_existent_property",
    pvs: "property1=1",
    f: "property1=nonexistentproperty",
    result: false
  },

  //olle
  {
    name:
      "should_accept_properties_when_filter_contains_one_matching_property_with_set_of_values",
    pvs: "a=1;b=2;c=3;d=4;e=5;f=6;",
    f: "b=1,2,5",
    result: true
  },
  {
    name:
      "should_accept_properties_when_filter_contains_one_matching_property_with_mixed_values",
    pvs: "a=1;b=2;c=3;d=4;e=5;f=6;",
    f: "b=-1,1,2,5,10~15",
    result: true
  },
  {
    name: "should_support_properties_on_right_hand",
    pvs: "a=10;b=2;",
    f: "a>=b",
    result: true
  },
  {
    name: "should_support_not_present_properties",
    pvs: "a=10;b=2;",
    f: "a>=c",
    result: false
  },
  {
    name: "not_equals_works_as_expected1",
    pvs: "a=5",
    f: "a!=20",
    result: true
  },
  {
    name: "not_equals_works_as_expected2",
    pvs: "a=5",
    f: "a!=5",
    result: false
  },
  {
    name: "greather_than_amount",
    pvs: "a=5:Celsius",
    f: "a>2:Celsius",
    result: true
  },
  {
    name: "less_than_amount",
    pvs: "a=5:Celsius",
    f: "a<2:Celsius",
    result: false
  },
  {
    name: "supports_null_validation",
    pvs: "b=5",
    f: "a=null",
    result: true
  },
  {
    name: "supports_null_validation2",
    pvs: "a=2",
    f: "a=null",
    result: false
  },
  {
    name: "supports_string",
    pvs: 'a="test"',
    f: 'a="test"',
    result: true
  },
  {
    name: "supports_dot_in_propertynames",
    pvs: "a.b=1",
    f: "a.b>0",
    result: true
  },
  {
    name: "supports_dot_in_propertynames_inverse",
    pvs: "a.b=1",
    f: "a.b>2",
    result: false
  },
  {
    name: "should not assert 5.2:Meter as valid for 1 to 5 Meter range",
    pvs: "a=5.2:Meter",
    f: "a=1:Meter~5.0:Meter",
    result: false
  },
  {
    name: "should not assert 0 m3/s as valid for 36 m3/h to 163 m3/h range",
    pvs: "a=0:CubicMeterPerSecond",
    f: "a=36:CubicMeterPerHour~163:CubicMeterPerHour",
    result: false
  },
  {
    name:
      "should not assert systemarrangement=1 as valid for systemarrangement!=1~2",
    pvs: "systemarrangement=1",
    f: "systemarrangement!=1~2",
    result: false
  },
  {
    name: "supports not equal multiple",
    pvs: "size=80",
    f: "size!=80,100",
    result: false
  },
  {
    name: "respects parenthesis",
    pvs: "",
    f: "(1=1|1=1)&1=2",
    result: false
  },
  {
    name: "adding integers",
    pvs: "",
    f: "3=1+2",
    result: true
  },
  {
    name: "adding integers multiple times",
    pvs: "",
    f: "1+2+3=6",
    result: true
  },
  {
    name: "multiply integers",
    pvs: "",
    f: "2*3=6",
    result: true
  },
  {
    name: "higher priority for multiplication integers",
    pvs: "",
    f: "4+2*3=10",
    result: true
  },
  {
    name: "multiply amount",
    pvs: "",
    f: "4*8:Millimeter=32:Millimeter",
    result: true
  },
  {
    name: "unary amount",
    pvs: "a=2:Meter",
    f: "-a=-2:Meter",
    result: true
  },
  {
    name: "expression interval",
    pvs:
      "a=18000:StandardCubicFeetPerMinute;b=20000:StandardCubicFeetPerMinute",
    f: "b=0.5*a~1.5*a",
    result: true
  },

  // Custom compare
  {
    name: "custom compare",
    pvs: "a=100;b=200;c=10:Watt;d=12:Watt",
    f: "a=b&c>d",
    result: true,
    comparer: (
      left: PropertyValue.PropertyValue,
      right: PropertyValue.PropertyValue
    ) => {
      switch (left.type) {
        case "text":
          return PropertyValue.defaultComparer(left, right);
        case "integer": {
          if (right.type !== left.type) {
            throw new Error("Must compare same types");
          }
          const alteredLeft = left.value * 2;
          return compareNumbers(alteredLeft, right.value, 0, 0);
        }
        case "amount": {
          if (right.type !== left.type) {
            throw new Error("Must compare same types");
          }
          const alteredLeft = Amount.times(left.value, 2);
          return Amount.compareTo(alteredLeft, right.value);
        }
        default:
          throw new Error("Unsupported type");
      }
    }
  }
];
