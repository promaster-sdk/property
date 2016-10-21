/*
 part of eligo_primitives.property_filtering;

class PropertyRemover {

  Expr removeProperty(Expr expr, String propertyName) {

    if (expr is AndExpr) {
      AndExpr e = expr;
      var children = new List<Expr>();
      for (var child in e.children) {
        var newChild = removeProperty(child, propertyName);
        if (newChild != null)
          children.add(newChild);
      }
      if (children.length == 0)
        return null;
      return new AndExpr(children);
    }
    else if (expr is ComparisonExpr) {
      ComparisonExpr e = expr;
      var left = removeProperty(e.leftValue, propertyName);
      var right = removeProperty(e.rightValue, propertyName);
      if (left == null || right == null)
        return null;
      return new ComparisonExpr(left, e.operationType, right);
    }
    else if (expr is EmptyExpr) {
        return expr;
      }
      else if (expr is EqualsExpr) {
          EqualsExpr e = expr;
          var left = removeProperty(e.leftValue, propertyName);
          if (left == null)
            return null;
          var rightValues = new List<Expr>();
          for (var range in e.rightValueRanges) {
            var newRange = removeProperty(range, propertyName);
            if (newRange != null)
              rightValues.add(newRange);
          }
          if (rightValues.length == 0)
            return null;
          return new EqualsExpr(left, e.operationType, rightValues);
        }
        else if (expr is IdentifierExpr) {
            IdentifierExpr e = expr;
            if (e.name == propertyName)
              return null;
            return e;
          }
          else if (expr is OrExpr) {
              OrExpr e = expr;
              var children = new List<Expr>();
              for (var child in e.children) {
                var newChild = removeProperty(child, propertyName);
                if (newChild != null)
                  children.add(newChild);
              }
              if (children.length == 0)
                return null;
              return new OrExpr(children);
            }
            else if (expr is ValueExpr) {
                return expr;
              }
              else if (expr is ValueRangeExpr) {
                  ValueRangeExpr e = expr;
                  var min = removeProperty(e.min, propertyName);
                  var max = removeProperty(e.max, propertyName);
                  if (min == null || max == null)
                    return null;
                  return new ValueRangeExpr(min, max);
                }
                else if (expr is NullExpr) {
                    return expr;
                  }
    return null;
  }

}

 */
//# sourceMappingURL=property_remover.js.map