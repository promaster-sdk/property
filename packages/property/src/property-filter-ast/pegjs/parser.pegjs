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
    return e2.length == 1 ? e2[0] : callbacks.createOrExpr(e2);
  }

//-------------------------------------------------------------
AndExpr
  = e:Expr e2:("&" i:Expr {return i;})*
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
        (c:(">=" / "<=" / ">" / "<") rh:AddExpr)
        {
          const opType = stringToComparisonOperationType(c);
          return callbacks.createComparisonExpr(lh, opType, rh);
        }
        /
        (c:("=" / "!=") r1:ValueRangeExpr r2:("," r:ValueRangeExpr {return r;})*)
        {
          const opType = stringToEqualsOperationType(c);
          r2.unshift(r1);
          return callbacks.createEqualsExpr(lh, opType, r2);
        }
      )
    ) { return comp[1]; }


//-------------------------------------------------------------
ValueRangeExpr
  = v1:AddExpr v2:("~" v:AddExpr {return v;})?
  {
    if(v2) return callbacks.createValueRangeExpr(v1, v2);
    else return callbacks.createValueRangeExpr(v1, v1);
  }


// TODO: Fix AddExpr?

//-------------------------------------------------------------
AddExpr
  =	(
      (lh:MultiplyExpr o:("+" / "-") rh:AddExpr)
      {
        const opType = stringToAddSubOperationType(o);
        return callbacks.createAddExpr(lh, opType, rh);
      }
    ) / MultiplyExpr


//-------------------------------------------------------------
MultiplyExpr
  =	(
      (lh:UnaryExpr o:("*" / "/") rh:MultiplyExpr)
      {
        const opType = stringToMulDivOperationType(o);
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
