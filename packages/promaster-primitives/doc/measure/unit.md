## Members

<dl>
<dt><a href="#One">One</a></dt>
<dd><p>Holds the dimensionless unit ONE</p>
</dd>
<dt><a href="#identityConverter">identityConverter</a></dt>
<dd><p>Holds the identity converter (unique). This converter does nothing (ONE.convert(x) == x).</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#createBase">createBase(quantity, symbol)</a></dt>
<dd><p>Creates a base unit having the specified symbol.</p>
</dd>
<dt><a href="#createAlternate">createAlternate(symbol, parent)</a></dt>
<dd><p>Creates an alternate unit for the specified unit identified by the
specified symbol.</p>
</dd>
<dt><a href="#times">times(quantity, left, right)</a> ⇒</dt>
<dd><p>Returns the product of the specified units.</p>
</dd>
<dt><a href="#divide">divide(quantity, left, right)</a> ⇒</dt>
<dd><p>Returns the quotient of the specified units.</p>
</dd>
<dt><a href="#convert">convert(value, fromUnit, toUnit)</a> ⇒</dt>
<dd><p>Converts numeric values from a unit to another unit.</p>
</dd>
<dt><a href="#transform">transform(operation, unit)</a> ⇒</dt>
<dd><p>Returns the unit derived from the specified unit using the specified converter.
The converter does not need to be linear.</p>
</dd>
<dt><a href="#fromProduct">fromProduct(quantity, leftElems, rightElems)</a></dt>
<dd><p>Creates the unit defined from the product of the specifed elements.</p>
</dd>
<dt><a href="#createCompoundConverter">createCompoundConverter(first, second)</a></dt>
<dd><p>Creates a compound converter resulting from the combined
transformation of the specified converters.</p>
</dd>
<dt><a href="#inverseConverter">inverseConverter()</a></dt>
<dd><p>Returns the inverse of this converter. If x is a valid
value, then x == inverse().convert(convert(x)) to within
the accuracy of computer arithmetic.</p>
</dd>
<dt><a href="#concatenateConverters">concatenateConverters(concatConverter, converter)</a> ⇒</dt>
<dd><p>Concatenates this converter with another converter. The resulting
converter is equivalent to first converting by the specified converter,
and then converting by this converter.</p>
<p>Note: Implementations must ensure that the IDENTITY instance
      is returned if the resulting converter is an identity
      converter.</p>
</dd>
<dt><a href="#createOne">createOne()</a></dt>
<dd><p>Used solely to create ONE instance.</p>
</dd>
</dl>

<a name="One"></a>

## One
Holds the dimensionless unit ONE

**Kind**: global variable  
<a name="identityConverter"></a>

## identityConverter
Holds the identity converter (unique). This converter does nothing (ONE.convert(x) == x).

**Kind**: global variable  
<a name="createBase"></a>

## createBase(quantity, symbol)
Creates a base unit having the specified symbol.

**Kind**: global function  

| Param | Description |
| --- | --- |
| quantity | The quantity of the resulting unit. |
| symbol | The symbol of this base unit. |

<a name="createAlternate"></a>

## createAlternate(symbol, parent)
Creates an alternate unit for the specified unit identified by the
specified symbol.

**Kind**: global function  

| Param | Description |
| --- | --- |
| symbol | The symbol for this alternate unit. |
| parent | Parent the system unit from which this alternate unit is derived. |

<a name="times"></a>

## times(quantity, left, right) ⇒
Returns the product of the specified units.

**Kind**: global function  
**Returns**: left * right  

| Param | Description |
| --- | --- |
| quantity | The quantity of the resulting unit. |
| left | The left unit operand. |
| right | The right unit operand.</param> |

<a name="divide"></a>

## divide(quantity, left, right) ⇒
Returns the quotient of the specified units.

**Kind**: global function  
**Returns**: left / right  

| Param | Description |
| --- | --- |
| quantity | The quantity of the resulting unit. |
| left | The dividend unit operand. |
| right | The divisor unit operand. |

<a name="convert"></a>

## convert(value, fromUnit, toUnit) ⇒
Converts numeric values from a unit to another unit.

**Kind**: global function  
**Returns**: The converted numeric value.  

| Param | Description |
| --- | --- |
| value | The numeric value to convert. |
| fromUnit | The unit from which to convert the numeric value. |
| toUnit | The unit to which to convert the numeric value. |

<a name="transform"></a>

## transform(operation, unit) ⇒
Returns the unit derived from the specified unit using the specified converter.
The converter does not need to be linear.

**Kind**: global function  
**Returns**: The unit after the specified transformation.  

| Param | Description |
| --- | --- |
| operation | The converter from the transformed unit to this unit. |
| unit | The unit. |

<a name="fromProduct"></a>

## fromProduct(quantity, leftElems, rightElems)
Creates the unit defined from the product of the specifed elements.

**Kind**: global function  

| Param | Description |
| --- | --- |
| quantity | Quantity of the resulting unit. |
| leftElems | Left multiplicand elements. |
| rightElems | Right multiplicand elements. |

<a name="createCompoundConverter"></a>

## createCompoundConverter(first, second)
Creates a compound converter resulting from the combined
transformation of the specified converters.

**Kind**: global function  

| Param | Description |
| --- | --- |
| first | The first converter. |
| second | Second the second converter. |

<a name="inverseConverter"></a>

## inverseConverter()
Returns the inverse of this converter. If x is a valid
value, then x == inverse().convert(convert(x)) to within
the accuracy of computer arithmetic.

**Kind**: global function  
<a name="concatenateConverters"></a>

## concatenateConverters(concatConverter, converter) ⇒
Concatenates this converter with another converter. The resulting
converter is equivalent to first converting by the specified converter,
and then converting by this converter.

Note: Implementations must ensure that the IDENTITY instance
      is returned if the resulting converter is an identity
      converter.

**Kind**: global function  
**Returns**: The concatenation of this converter with the other converter.  

| Param | Description |
| --- | --- |
| concatConverter | This converter. |
| converter | The other converter. |

<a name="createOne"></a>

## createOne()
Used solely to create ONE instance.

**Kind**: global function  
