## Functions

<dl>
<dt><a href="#create">create(value, unit, decimalCount)</a> ⇒ <code>Amount.&lt;T&gt;</code></dt>
<dd><p>Creates an amount that represents the an exact/absolute value in the specified
unit. For example if you create an exact amount of 2 degrees Fahrenheit that
will represent -16.6666667 degrees Celsius.</p>
</dd>
<dt><a href="#neg">neg()</a></dt>
<dd><p>Simulate negation unary operator.</p>
</dd>
<dt><a href="#plus">plus(left, right)</a> ⇒</dt>
<dd><p>Adds two amounts together.
The two amounts amounts must have the same quantity.
The resulting amount will be of the same quantity as the two amounts.</p>
</dd>
<dt><a href="#abs">abs(amount)</a></dt>
<dd><p>Gets the absolute amount (equivalent of Math.Abs())</p>
</dd>
<dt><a href="#valueAs">valueAs(toUnit, amount)</a></dt>
<dd><p>Gets the value of the amount as a number in the specified unit</p>
</dd>
</dl>

<a name="create"></a>

## create(value, unit, decimalCount) ⇒ <code>Amount.&lt;T&gt;</code>
Creates an amount that represents the an exact/absolute value in the specified
unit. For example if you create an exact amount of 2 degrees Fahrenheit that
will represent -16.6666667 degrees Celsius.

**Kind**: global function  
**Returns**: <code>Amount.&lt;T&gt;</code> - The created amount.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | The numeric value of the amount. |
| unit | <code>Unit.&lt;T&gt;</code> | The unit of the amount. |
| decimalCount | <code>number</code> &#124; <code>undefined</code> | The decimalCount of the amount. |

<a name="neg"></a>

## neg()
Simulate negation unary operator.

**Kind**: global function  
<a name="plus"></a>

## plus(left, right) ⇒
Adds two amounts together.
The two amounts amounts must have the same quantity.
The resulting amount will be of the same quantity as the two amounts.

**Kind**: global function  
**Returns**: left + right  

| Param | Description |
| --- | --- |
| left | The left-hand amount. |
| right | The right-hand |

<a name="abs"></a>

## abs(amount)
Gets the absolute amount (equivalent of Math.Abs())

**Kind**: global function  

| Param | Description |
| --- | --- |
| amount | The amount to get the aboslute amount from. |

<a name="valueAs"></a>

## valueAs(toUnit, amount)
Gets the value of the amount as a number in the specified unit

**Kind**: global function  

| Param | Description |
| --- | --- |
| toUnit | The unit to get the amount in. |
| amount | The amount to get the value from. |

