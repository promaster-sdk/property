# External module "product-properties/property-value-set"
## Index### Interfaces* [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)### Variables* [Empty](_product_properties_property_value_set_.html#empty)### Functions* [_stringToEntriesOrUndefinedIfInvalidString](_product_properties_property_value_set_.html#_stringtoentriesorundefinedifinvalidstring)* [addPrefixToValues](_product_properties_property_value_set_.html#addprefixtovalues)* [amend](_product_properties_property_value_set_.html#amend)* [amendProperty](_product_properties_property_value_set_.html#amendproperty)* [count](_product_properties_property_value_set_.html#count)* [equals](_product_properties_property_value_set_.html#equals)* [extend](_product_properties_property_value_set_.html#extend)* [fromProperty](_product_properties_property_value_set_.html#fromproperty)* [fromString](_product_properties_property_value_set_.html#fromstring)* [fromStringOrError](_product_properties_property_value_set_.html#fromstringorerror)* [get](_product_properties_property_value_set_.html#get)* [getAmount](_product_properties_property_value_set_.html#getamount)* [getInteger](_product_properties_property_value_set_.html#getinteger)* [getProperties](_product_properties_property_value_set_.html#getproperties)* [getPropertyNames](_product_properties_property_value_set_.html#getpropertynames)* [getText](_product_properties_property_value_set_.html#gettext)* [getValue](_product_properties_property_value_set_.html#getvalue)* [getValuesOfType](_product_properties_property_value_set_.html#getvaluesoftype)* [getValuesWithPrefix](_product_properties_property_value_set_.html#getvalueswithprefix)* [getValuesWithoutPrefix](_product_properties_property_value_set_.html#getvalueswithoutprefix)* [hasProperty](_product_properties_property_value_set_.html#hasproperty)* [isNullOrEmpty](_product_properties_property_value_set_.html#isnullorempty)* [keepProperties](_product_properties_property_value_set_.html#keepproperties)* [merge](_product_properties_property_value_set_.html#merge)* [removeProperties](_product_properties_property_value_set_.html#removeproperties)* [removeProperty](_product_properties_property_value_set_.html#removeproperty)* [set](_product_properties_property_value_set_.html#set)* [setAmount](_product_properties_property_value_set_.html#setamount)* [setInteger](_product_properties_property_value_set_.html#setinteger)* [setText](_product_properties_property_value_set_.html#settext)* [setValues](_product_properties_property_value_set_.html#setvalues)* [toString](_product_properties_property_value_set_.html#tostring)* [toStringInSpecifiedOrder](_product_properties_property_value_set_.html#tostringinspecifiedorder)## Variables### Empty: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)
* Defined in product-properties/property-value-set.ts:13## Functions### _stringToEntriesOrUndefinedIfInvalidString(encodedValueSet: string): [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html) | undefined  * Defined in product-properties/property-value-set.ts:216#### Parameters| Name | Type | Description || ---- | ---- | ---- || encodedValueSet | string|  |#### Returns: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html) | undefined### addPrefixToValues(prefix: string, set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)  * Defined in product-properties/property-value-set.ts:145#### Parameters| Name | Type | Description || ---- | ---- | ---- || prefix | string|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)### amend<PropertyValueSet, T2>(obj1: PropertyValueSet, obj2: T2): PropertyValueSet  * Defined in product-properties/property-value-set.ts:286#### Type parameters* #### PropertyValueSet* #### T2#### Parameters| Name | Type | Description || ---- | ---- | ---- || obj1 | PropertyValueSet|  || obj2 | T2|  |#### Returns: PropertyValueSet### amendProperty<PropertyValueSet, T2>(set: PropertyValueSet, name: string, value: T2): PropertyValueSet  * Defined in product-properties/property-value-set.ts:291#### Type parameters* #### PropertyValueSet* #### T2#### Parameters| Name | Type | Description || ---- | ---- | ---- || set | PropertyValueSet|  || name | string|  || value | T2|  |#### Returns: PropertyValueSet### count(set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): number  * Defined in product-properties/property-value-set.ts:48#### Parameters| Name | Type | Description || ---- | ---- | ---- || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: number### equals(other: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html), set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): boolean  * Defined in product-properties/property-value-set.ts:196#### Parameters| Name | Type | Description || ---- | ---- | ---- || other | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: boolean### extend<TOrigin, TAdd>(origin: TOrigin, add: TAdd): TOrigin & TAdd  * Defined in product-properties/property-value-set.ts:295#### Type parameters* #### TOrigin* #### TAdd#### Parameters| Name | Type | Description || ---- | ---- | ---- || origin | TOrigin|  || add | TAdd|  |#### Returns: TOrigin & TAdd### fromProperty(propertyName: string, propertyValue: PropertyValue.PropertyValue): \{__computed: [AmountPropertyValue](../interfaces/_product_properties_property_value_.amountpropertyvalue.html) | [TextPropertyValue](../interfaces/_product_properties_property_value_.textpropertyvalue.html) | [IntegerPropertyValue](../interfaces/_product_properties_property_value_.integerpropertyvalue.html)\}  * Defined in product-properties/property-value-set.ts:38#### Parameters| Name | Type | Description || ---- | ---- | ---- || propertyName | string|  || propertyValue | PropertyValue.PropertyValue|  |#### Returns: \{__computed: [AmountPropertyValue](../interfaces/_product_properties_property_value_.amountpropertyvalue.html) | [TextPropertyValue](../interfaces/_product_properties_property_value_.textpropertyvalue.html) | [IntegerPropertyValue](../interfaces/_product_properties_property_value_.integerpropertyvalue.html)\}### fromString(encodedValueSet: string): [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)  * Defined in product-properties/property-value-set.ts:17#### Parameters| Name | Type | Description || ---- | ---- | ---- || encodedValueSet | string|  |#### Returns: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)### fromStringOrError(onError: (encodedValueSet: string)=> [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html), encodedValueSet: string): [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)  * Defined in product-properties/property-value-set.ts:24#### Parameters| Name | Type | Description || ---- | ---- | ---- || onError | (encodedValueSet: string)=> [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  || encodedValueSet | string|  |#### Returns: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)### get(propertyName: string, set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): PropertyValue.PropertyValue | undefined  * Defined in product-properties/property-value-set.ts:52#### Parameters| Name | Type | Description || ---- | ---- | ---- || propertyName | string|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: PropertyValue.PropertyValue | undefined### getAmount<T>(propertyName: string, set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): [Amount](../interfaces/_measure_amount_.amount.html)<T> | undefined  * Defined in product-properties/property-value-set.ts:123#### Type parameters* #### T [Quantity](_measure_quantity_.html#quantity)#### Parameters| Name | Type | Description || ---- | ---- | ---- || propertyName | string|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: [Amount](../interfaces/_measure_amount_.amount.html)<T> | undefined### getInteger(propertyName: string, set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): number | undefined  * Defined in product-properties/property-value-set.ts:139#### Parameters| Name | Type | Description || ---- | ---- | ---- || propertyName | string|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: number | undefined### getProperties(propertiesToGet: Array<string>, set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)  * Defined in product-properties/property-value-set.ts:184#### Parameters| Name | Type | Description || ---- | ---- | ---- || propertiesToGet | Array<string>|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)### getPropertyNames(set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): Array<string>  * Defined in product-properties/property-value-set.ts:62#### Parameters| Name | Type | Description || ---- | ---- | ---- || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: Array<string>### getText(propertyName: string, set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): string | undefined  * Defined in product-properties/property-value-set.ts:131#### Parameters| Name | Type | Description || ---- | ---- | ---- || propertyName | string|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: string | undefined### getValue(propertyName: string, set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): PropertyValue.PropertyValue  * Defined in product-properties/property-value-set.ts:115#### Parameters| Name | Type | Description || ---- | ---- | ---- || propertyName | string|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: PropertyValue.PropertyValue### getValuesOfType(type: [PropertyType](_product_properties_property_value_.html#propertytype), set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)  * Defined in product-properties/property-value-set.ts:173#### Parameters| Name | Type | Description || ---- | ---- | ---- || type | [PropertyType](_product_properties_property_value_.html#propertytype)|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)### getValuesWithPrefix(prefix: string, removePrefix: boolean, set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)  * Defined in product-properties/property-value-set.ts:153#### Parameters| Name | Type | Description || ---- | ---- | ---- || prefix | string|  || removePrefix | boolean|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)### getValuesWithoutPrefix(prefix: string, removePrefix: boolean, set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)  * Defined in product-properties/property-value-set.ts:163#### Parameters| Name | Type | Description || ---- | ---- | ---- || prefix | string|  || removePrefix | boolean|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)### hasProperty(propertyName: string, set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): boolean  * Defined in product-properties/property-value-set.ts:58#### Parameters| Name | Type | Description || ---- | ---- | ---- || propertyName | string|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: boolean### isNullOrEmpty(propertyValueSet: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html) | null): boolean  * Defined in product-properties/property-value-set.ts:44#### Parameters| Name | Type | Description || ---- | ---- | ---- || propertyValueSet | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html) | null|  |#### Returns: boolean### keepProperties(propertyNames: Array<string>, set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)  * Defined in product-properties/property-value-set.ts:92#### Parameters| Name | Type | Description || ---- | ---- | ---- || propertyNames | Array<string>|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)### merge(mergeWith: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html), set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)  * Defined in product-properties/property-value-set.ts:66#### Parameters| Name | Type | Description || ---- | ---- | ---- || mergeWith | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)### removeProperties(propertyNames: Array<string>, set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)  * Defined in product-properties/property-value-set.ts:100#### Parameters| Name | Type | Description || ---- | ---- | ---- || propertyNames | Array<string>|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)### removeProperty(propertyName: string, set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)  * Defined in product-properties/property-value-set.ts:109#### Parameters| Name | Type | Description || ---- | ---- | ---- || propertyName | string|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)### set(propertyName: string, propertyValue: PropertyValue.PropertyValue, set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)  * Defined in product-properties/property-value-set.ts:76#### Parameters| Name | Type | Description || ---- | ---- | ---- || propertyName | string|  || propertyValue | PropertyValue.PropertyValue|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)### setAmount<T>(propertyName: string, amountValue: [Amount](../interfaces/_measure_amount_.amount.html)<T>, set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)  * Defined in product-properties/property-value-set.ts:80#### Type parameters* #### T [Quantity](_measure_quantity_.html#quantity)#### Parameters| Name | Type | Description || ---- | ---- | ---- || propertyName | string|  || amountValue | [Amount](../interfaces/_measure_amount_.amount.html)<T>|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)### setInteger(propertyName: string, integerValue: number, set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)  * Defined in product-properties/property-value-set.ts:84#### Parameters| Name | Type | Description || ---- | ---- | ---- || propertyName | string|  || integerValue | number|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)### setText(propertyName: string, textValue: string, set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)  * Defined in product-properties/property-value-set.ts:88#### Parameters| Name | Type | Description || ---- | ---- | ---- || propertyName | string|  || textValue | string|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)### setValues(replacementSet: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html), set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)  * Defined in product-properties/property-value-set.ts:72#### Parameters| Name | Type | Description || ---- | ---- | ---- || replacementSet | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)### toString(set: [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)): string  * Defined in product-properties/property-value-set.ts:188#### Parameters| Name | Type | Description || ---- | ---- | ---- || set | [PropertyValueSet](../interfaces/_product_properties_property_value_set_.propertyvalueset.html)|  |#### Returns: string### toStringInSpecifiedOrder(order: Array<string>): string  * Defined in product-properties/property-value-set.ts:192#### Parameters| Name | Type | Description || ---- | ---- | ---- || order | Array<string>|  |#### Returns: string
																		Generated using [TypeDoc](http://typedoc.io)