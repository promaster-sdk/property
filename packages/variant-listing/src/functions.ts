import * as R from "ramda";
import { PropertyValue, PropertyValueSet, PropertyFilter } from "@promaster-sdk/property";
import { ExtendedVariants, ProductProperty, VariantUrlList } from "./types";

export function buildAllPropertyValueSets(
  explicitPropertyValueSet: PropertyValueSet.PropertyValueSet,
  variableProperties: Array<ProductProperty>,
  allProperties: Array<ProductProperty>
): ReadonlyArray<VariantUrlList> {
  return buildAllPropertyValueSetsExtended(explicitPropertyValueSet, variableProperties, allProperties, 100).variants;
}

export function buildAllPropertyValueSetsExtended(
  explicitPropertyValueSet: PropertyValueSet.PropertyValueSet,
  variableProperties: Array<ProductProperty>,
  allProperties: Array<ProductProperty>,
  limit: number,
  comparer: PropertyValue.Comparer = PropertyValue.defaultComparer
): ExtendedVariants {
  // filter out non-discrete properties and keep a list of them so we can filter other property-values that depend on them
  const blackListedProperties: Array<ProductProperty> = [];
  let blacklistedPropertyFilters: Array<PropertyFilter.PropertyFilter> = [];
  const newVariableProperties = variableProperties
    .filter((property) => {
      // remove all no discrete properties
      if (property.quantity.toLocaleLowerCase() !== "discrete") {
        blackListedProperties.push(property);
        if (property.validation_filter.text !== "") {
          blacklistedPropertyFilters.push(property.validation_filter);
        }
        if (property.visibility_filter.text !== "") {
          blacklistedPropertyFilters.push(property.visibility_filter);
        }
        return false;
      } else {
        return true;
      }
    })
    // If the current valid (all properties are valid when we get this far) property has a filter
    // that uses a blacklisted propertyfilter value we should remove it from the blacklist.
    .map((property) => {
      if (property.visibility_filter.text !== "") {
        blacklistedPropertyFilters = blacklistedPropertyFilters.filter(
          (bpf) =>
            !property.visibility_filter.text.split("&").reduce(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (acc: any, filterPart: any) => acc || filterPart.toLowerCase() === bpf.text.toLowerCase(),
              false
            )
        );
      }
      return property;
    })

    //
    // TODO in between: Remove all properties who only are legal of a non-discrete property is set.
    // ----
    //

    .map((property) => {
      // remove all propertyValues that are blacklisted
      const newPV = property.value.filter((value) =>
        blacklistedPropertyFilters.reduce(
          (acc, bpf) => acc && !PropertyFilter.isValid({ [property.name]: value.value }, bpf, comparer),
          true
        )
      );
      return { ...property, value: newPV };
    });

  // Error check.
  if (newVariableProperties.find((property) => property.quantity.toLocaleLowerCase() !== "discrete")) {
    throw new Error("Can't build variants from non-discrete properties.");
  }

  let prunedValues = false;
  // // Makes variant generation less wasteful.
  // properties = sortByDependencyDepth(properties);

  // One explicit PVS to start with.
  let propertyValueSets = new Array<PropertyValueSet.PropertyValueSet>(explicitPropertyValueSet);

  newVariableProperties.forEach((property) => {
    // TODO: Fix this properly.
    // Temp fix, because generating all might be too slow, and useless anyway.
    // When the propertyValueSets array grows too large, discard some.
    if (limit > 0 && propertyValueSets.length > limit) {
      console.warn(
        `Discarded ${propertyValueSets.length - limit} of ${propertyValueSets.length} propertyValueSets for ${
          property.name
        }, since there are too many combinations.`
      );
      prunedValues = true;
      propertyValueSets = propertyValueSets.slice(0, limit);
    }

    // Replace the PVSs with concatenated copies of itself, using each of the valueItems.
    const propertyValueSets1 = propertyValueSets
      .map((partialPropertyValueSet) => {
        return !property.value
          ? []
          : property.value
              .map((propertyValueItem) => {
                // All valueItems should have a set value. Ignore broken data.
                if (propertyValueItem.value.type !== "integer") {
                  console.warn("Invalid data in valueItem:", propertyValueItem);
                  return undefined;
                }

                // Add new variant to propertyValueSet
                const propertyValueSet = R.mergeWith(R.merge, partialPropertyValueSet, {
                  [property.name]: {
                    type: "integer",
                    value: propertyValueItem.value.value as number,
                  },
                });

                // Check validity, so invalid ones can be filtered out.
                // This will not catch PVSes that get invalidated by a later added property.
                // (They get filtered out in a separate step below.)
                return PropertyFilter.isValidMatchMissing(propertyValueSet, propertyValueItem.property_filter)
                  ? propertyValueSet
                  : undefined;
              })
              // Filtering out invalid combos after each property prevents the array size from exploding too bad.
              .filter((possiblyUndefined) => possiblyUndefined !== undefined);
      })
      // Flatten.
      .reduce((soFar, next) => soFar.concat(next), []);

    propertyValueSets = propertyValueSets1 as Array<PropertyValueSet.PropertyValueSet>;
  });

  // Complete the PVS'es with default values.
  const defaults1 = allProperties
    .filter((property) => !!property.def_value && !!property.def_value.length)
    .map((property) => ({
      [property.name]: property.def_value[0].value,
    }));
  const defaults = defaults1.reduce((soFar, next) => PropertyValueSet.merge(soFar, next), PropertyValueSet.Empty);

  const firstOptions1 = allProperties
    .filter((property) => !!property.value && !!property.value.length)
    .map((property) => ({
      [property.name]: property.value[0].value,
    }));
  const firstOptions = firstOptions1.reduce(
    (soFar, next) => PropertyValueSet.merge(soFar, next),
    PropertyValueSet.Empty
  );

  const fallbacks = PropertyValueSet.setValues(defaults, firstOptions);
  propertyValueSets = propertyValueSets.map((propertyValueSet) =>
    PropertyValueSet.setValues(propertyValueSet, fallbacks)
  );

  // The filtering above won't catch properties that get invalidated by following properties.
  const before = propertyValueSets.length;
  propertyValueSets = propertyValueSets.filter((propertyValueSet) =>
    allProperties // PropertyValueSets needs to have...
      .filter((property) => !!property.value && !!property.value.length) // ...their every (discrete) propertyValue...
      .every((property) => {
        // ...set to a valid value.
        const valueItem = property.value.find((v) =>
          PropertyValue.equals(PropertyValueSet.getValue(property.name, propertyValueSet), v.value, comparer)
        );

        if (!valueItem) {
          console.warn(`Property is set to non-existing value (bad default?): ${property.name}`);
          throw new Error("Property is set to non-existing value (bad default?)");
        }

        return valueItem && PropertyFilter.isValid(propertyValueSet, valueItem.property_filter, comparer);
      })
  );

  const loss = propertyValueSets.length - before;
  if (loss > 0) {
    console.warn(
      `Discarded ${loss} variants because they are invalid. Implement recursive search with backtracking over default values to find valid combos.`
    );
  }

  // TODO: Instead of just filtering out bad combos, fiddle with the default values until they pass.

  const extendedVariants: Array<VariantUrlList> = propertyValueSets.map(
    (variant) => ({
      variants: variant,
      url: Object.keys(variant)
        .map((property) => `${property}=${variant[property].value}`)
        .join("&"),
    }),
    {}
  );

  return {
    variants: extendedVariants,
    pruned: prunedValues,
  };
}
