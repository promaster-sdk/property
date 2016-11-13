#  promaster-primitives
# Introduction
This is the main implementation of Promaster Primitives. There are other ports and clones but the goal is
to keep this single repo well maintained, documented, and tested.
This implementaiton uses a functional approach with pure data-records and functions that operates on those data-records.
If desired, other approches such as class-based can be built on top by combining the data-records and functions into classes.
# Run-time requirements
This libarary is compiled to ES5 and does not require any polyfills. Specifically it does not use
ES6 specific API:s like ´Map´ or ´Set´.
# Libraries
## Measure
* [Amount](./doc/measure/amount.md)
* [Unit](./doc/measure/unit.md)
* [Units](./doc/measure/units.md)
# Scripts
To publish do npm run publish:patch
TODO: Document all npm scripts
# Index
* *[Globals](globals.html)** ["index"](modules/_index_.html)* ["measure/amount"](modules/_measure_amount_.html)* ["measure/quantity"](modules/_measure_quantity_.html)* ["measure/unit"](modules/_measure_unit_.html)* ["measure/unit-divide"](modules/_measure_unit_divide_.html)* ["measure/unit-info"](modules/_measure_unit_info_.html)* ["measure/unit-name"](modules/_measure_unit_name_.html)* ["measure/unit-times"](modules/_measure_unit_times_.html)* ["measure/units"](modules/_measure_units_.html)* ["product-properties/property-value"](modules/_product_properties_property_value_.html)* ["product-properties/property-value-set"](modules/_product_properties_property_value_set_.html)* ["property-filtering/pegjs/parser_esm"](modules/_property_filtering_pegjs_parser_esm_.html)* ["property-filtering/pegjs/property-filter-parser"](modules/_property_filtering_pegjs_property_filter_parser_.html)* ["property-filtering/property-filter"](modules/_property_filtering_property_filter_.html)* ["property-filtering/property-filter-ast"](modules/_property_filtering_property_filter_ast_.html)* ["utils/compare_utils"](modules/_utils_compare_utils_.html)
Generated using [TypeDoc](http://typedoc.io)