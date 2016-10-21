/*

NOTE:
We have to manually make the commonjs module produced by PEG a ESM module by removing the IIFE and
replace this:
 return {
   SyntaxError: peg$SyntaxError,
   parse: peg$parse
 };
with this:
 export const SyntaxError = (message, expected, found, location) => peg$SyntaxError(message, expected, found, location);
 export const parse = (input) => peg$parse(input);

See: https://github.com/pegjs/pegjs/issues/423

*/

{
  const callbacks = options.callbacks;

  // Helpers
  function stringToComparisonOperationType(str) {
    if (str == ">") return "greater"; //ComparisonOperationType.Greater;
    if (str == "<") return "less"; //ComparisonOperationType.Less;
    if (str == ">=") return "greaterOrEqual"; //ComparisonOperationType.GreaterOrEqual;
    return "lessOrEqual"; //ComparisonOperationType.LessOrEqual;
  }

  function stringToEqualsOperationType(str) {
    if (str == "=") return "equals"; //EqualsOperationType.Equals;
    return "notEquals"; //EqualsOperationType.NotEquals;
  }

}

start
  = PropertyFilter

// ---- CHARACTERS ----

letter
  = [a-z]i
digit
	 = [0-9]
any
	= [a-z0-9]i
identletter
  = letter / "." / "_"

// ----TOKENS ----

ident
  = $(identletter (identletter / digit)*)
propval
  = $('"' any* '"')
  / $("-"? digit+ ("." digit+)? (":" letter+)?)

// --- PRODUCTIONS ----

//-------------------------------------------------------------
PropertyFilter
  = root:OrExpr { return root; }

//-------------------------------------------------------------
OrExpr
  = e:AndExpr e2:("|" i:AndExpr {return i;})*
  {
    e2.unshift(e);
    //console.log("OrExpr", e2);
    return e2.length == 1 ? e2[0] : callbacks.createOrExpr(e2);
  }

//-------------------------------------------------------------
AndExpr
  = e:Expr e2:("&" i:Expr {return i;})*
  {
    e2.unshift(e);
    //console.log("AndExpr", e2);
    return e2.length == 1 ? e2[0] : callbacks.createAndExpr(e2);
  }

//-------------------------------------------------------------
Expr
  = ("(" e1:OrExpr ")") {return e1;}
  /
	e2:ComparisonExpr
	{
	  //console.log("Expr", e2);
	  return e2;
	}

//-------------------------------------------------------------
ComparisonExpr
  = comp:(
      lh:ValueExpr
      (
        (c:(">=" / "<=" / ">" / "<") rh:ValueExpr)
        {
          //console.log("ComparisonExpr", lh, c, rh);
          const opType = stringToComparisonOperationType(c);
          return callbacks.createComparisonExpr(lh, opType, rh);
        }
        /
        (c:("=" / "!=") r1:ValueRangeExpr r2:("," r:ValueRangeExpr {return r;})*)
        {
          const opType = stringToEqualsOperationType(c);
          r2.unshift(r1);
          //console.log("ComparisonExpr:", r2);
          const a= callbacks.createEqualsExpr(lh, opType, r2);
          //console.log("ComparisonExpr", a);
          return a;
        }
      )
    ) { return comp[1]; }


//-------------------------------------------------------------
ValueRangeExpr
  = v1:ValueExpr v2:("~" v:ValueExpr {return v;})?
  {
    //console.log("ValueRangeExpr", v1, v2);
    if(v2) return callbacks.createValueRangeExpr(v1, v2);
    else return callbacks.createValueRangeExpr(v1, v1);
  }


// TODO: Fix AddExpr?

//-------------------------------------------------------------
/*
AddExpr<out Expr e>											{ AddOperator op; Expr e2; }
=	MultiplyExpr<out e>
	{
		(
		"+"                                 { op = AddOperator.Plus; }
		| "-"                               { op = AddOperator.Minus; }
		)
		MultiplyExpr<out e2>                { e = new AddExpr(e, op, e2); }
	}

//-------------------------------------------------------------
MultiplyExpr<out Expr e>	            	{ MultiplyOperator op; Expr e2; }
=	UnaryExpr<out e>
	{
		(
	  "*"                                 { op = MultiplyOperator.Times; }
	  | "/"                               { op = MultiplyOperator.Divide; }
		| "%"																{ op = MultiplyOperator.Modulo; }
	  )
		UnaryExpr<out e2>					          { e = new MultiplyExpr(e, op, e2); }
	}
.

//-------------------------------------------------------------
UnaryExpr<out Expr e>                    { e = null; }
= (                                      { UnaryOperator op; }
  (
  "-"                                    { op = UnaryOperator.Minus; }
	)
	 ValueExpr<out e>                      { e = new UnaryExpr(op, e); }
	)
	| ValueExpr<out e>

*/

//-------------------------------------------------------------
ValueExpr
  = "null" {return callbacks.createNullExpr();}
  / i1:ident i2:(":" i:ident {return i;})?
  {
    //console.log("ValueExpr", i1, i2)
    if(i2) return callbacks.createIdentifierAsExpr(i2, i1);
    else return callbacks.createIdentifierExpr(i1);
  }
  / val:propval { return callbacks.createValueExpr(val); }
