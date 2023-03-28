{
  var callbacks = options.callbacks;

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

  function stringToAddSubOperationType(str) {
    if (str == "+") return "add";
    return "subtract";
  }

  function stringToMulDivOperationType(str) {
    if (str == "*") return "multiply";
    return "divide";
  }

}

start
  = PropertyFilter

// ---- CHARACTERS ----

letter
  = [a-z]i
digit
	 = [0-9]
unescaped
  = [^\0-\x1F\x22\x5C]
identletter
  = letter / "." / "_"

// ----TOKENS ----

ident
  = $(identletter (identletter / digit)*)
propval
  = $('"' unescaped* '"')
  / $("-"? digit+ ("." digit+)? (":" letter+)?)

// optional whitespace
_  = [ ]*

// --- PRODUCTIONS ----

//-------------------------------------------------------------
PropertyFilter
  = root:OrExpr { return root; }

//-------------------------------------------------------------
OrExpr
  = e:AndExpr e2:(_ "|" _ i:AndExpr {return i;})*
  {
    e2.unshift(e);
    return e2.length == 1 ? e2[0] : callbacks.createOrExpr(e2);
  }

//-------------------------------------------------------------
AndExpr
  = e:Expr e2:(_ "&" _ i:Expr {return i;})*
  {
    e2.unshift(e);
    return e2.length == 1 ? e2[0] : callbacks.createAndExpr(e2);
  }

//-------------------------------------------------------------
Expr
  = ("(" e1:OrExpr ")") {return e1;}
  /
	e2:ComparisonExpr
	{
	  return e2;
	}

//-------------------------------------------------------------
ComparisonExpr
  = comp:(
      lh:AddExpr
      (
        (_ c:(">=" / "<=" / ">" / "<") _ rh:AddExpr)
        {
          var opType = stringToComparisonOperationType(c);
          return callbacks.createComparisonExpr(lh, opType, rh);
        }
        /
        (_ c:("=" / "!=") _ r1:ValueRangeExpr r2:("," r:ValueRangeExpr {return r;})*)
        {
          var opType = stringToEqualsOperationType(c);
          r2.unshift(r1);
          return callbacks.createEqualsExpr(lh, opType, r2);
        }
      )
    ) { return comp[1]; }


//-------------------------------------------------------------
ValueRangeExpr
  = v1:AddExpr v2:(_ "~" _ v:AddExpr {return v;})?
  {
    if(v2) return callbacks.createValueRangeExpr(v1, v2);
    else return callbacks.createValueRangeExpr(v1, v1);
  }


// TODO: Fix AddExpr?

//-------------------------------------------------------------
AddExpr
  =	(
      (lh:MultiplyExpr _ o:("+" / "-") _ rh:AddExpr)
      {
        var opType = stringToAddSubOperationType(o);
        return callbacks.createAddExpr(lh, opType, rh);
      }
    ) / MultiplyExpr


//-------------------------------------------------------------
MultiplyExpr
  =	(
      (lh:UnaryExpr _ o:("*" / "/") _ rh:MultiplyExpr)
      {
        var opType = stringToMulDivOperationType(o);
        return callbacks.createMulExpr(lh, opType, rh);
      }
    ) / UnaryExpr

//-------------------------------------------------------------
UnaryExpr
  = (
      ("-" val:ValueExpr)
      {
        return callbacks.createUnaryExpr("negative", val);
      }
    ) / ValueExpr;

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
