/*
 part of eligo_primitives.property_filtering;

class PropertyRenamer {

  Expr renameProperty(Expr expr, String oldName, String newName) {

    if (expr is AndExpr) {
      AndExpr e = expr;
      var children = new List<Expr>();
      for (var child in e.children)
        children.add(renameProperty(child, oldName, newName));
      return new AndExpr(children);
    }
    else if (expr is ComparisonExpr) {
      ComparisonExpr e = expr;
      var left = renameProperty(e.leftValue, oldName, newName);
      var right = renameProperty(e.rightValue, oldName, newName);
      return new ComparisonExpr(left, e.operationType, right);
    }
    else if (expr is EmptyExpr) {
        return expr;
      }
      else if (expr is EqualsExpr) {
          EqualsExpr e = expr;
          var left = renameProperty(e.leftValue, oldName, newName);
          var rightValues = new List<Expr>();
          for (var range in e.rightValueRanges)
            rightValues.add(renameProperty(range, oldName, newName));
          return new EqualsExpr(left, e.operationType, rightValues);
        }
        else if (expr is IdentifierExpr) {
            IdentifierExpr e = expr;
            if (e.name != oldName)
              return e;
            return new IdentifierExpr(newName);
          }
          else if (expr is OrExpr) {
              OrExpr e = expr;
              var children = new List<Expr>();
              for (var child in e.children)
                children.add(renameProperty(child, oldName, newName));
              return new OrExpr(children);
            }
            else if (expr is ValueExpr) {
                return expr;
              }
              else if (expr is ValueRangeExpr) {
                  ValueRangeExpr e = expr;
                  var min = renameProperty(e.min, oldName, newName);
                  var max = renameProperty(e.max, oldName, newName);
                  return new ValueRangeExpr(min, max);
                }
                else if (expr is NullExpr) {
                    return expr;
                  }
    return null;
  }

}

 */
