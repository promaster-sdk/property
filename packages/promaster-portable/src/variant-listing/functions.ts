import {PropertyValue, PropertyValueSet, PropertyFilter, Units} from "@promaster/promaster-primitives";
import {ProductProperty} from "./types";

export function buildAllPropertyValueSets(explicitPropertyValueSet: PropertyValueSet.PropertyValueSet, variableProperties: ProductProperty[], allProperties: ProductProperty[]) {
  // Error check.
  if (variableProperties.find(property => Units.getStringFromQuantityType(property.quantity).toLocaleLowerCase() !== "discrete")) {
    throw new Error("Can\'t build variants from non-discrete properties.");
  }

  // // Makes variant generation less wasteful.
  // properties = sortByDependencyDepth(properties);

  // One explicit PVS to start with.
  let propertyValueSets = new Array<PropertyValueSet.PropertyValueSet>(explicitPropertyValueSet);
  variableProperties.forEach(property => {
    // TODO: Fix this properly.
    // Temp fix, because generating all might be too slow, and useless anyway.
    // When the propertyValueSets array grows too large, discard some.
    const limit = 30;
    if (propertyValueSets.length > limit) {
      console.warn(`Discarded ${propertyValueSets.length - limit} propertyValueSets, since there are too many combinations.`);
      propertyValueSets = propertyValueSets.slice(0, limit);
    }

    // Replace the PVSs with concatenated copies of itself, using each of the valueItems.
    let propertyValueSets1 = propertyValueSets
      .map((partialPropertyValueSet) => {
        // Reuse the builder for each of `valueItems`, since the property name doesn't change.
        // const builder = PropertyValueSetBuilder.fromPropertyValueSet(partialPropertyValueSet);
        let builder = partialPropertyValueSet;

        return !property.value
          ? []
          : property.value
          .map(propertyValueItem => {

            // All valueItems should have a set value. Ignore broken data.
            const integerValue = PropertyValue.getInteger(propertyValueItem.value);
            if (integerValue === undefined) {
              console.warn("Invalid data in valueItem:", propertyValueItem);
              return undefined;
            }

            // const propertyValue = new PropertyValue(PropertyType.Integer, integerValue);
            const propertyValue = PropertyValue.create("integer", integerValue);

            // builder.addOrUpdate(property.name, propertyValue);
            builder = PropertyValueSet.set(property.name, propertyValue, builder);

            // let propertyValueSet = builder.build();
            let propertyValueSet = builder;

            // Check validity, so invalid ones can be filtered out.
            // This will not catch PVSes that get invalidated by a later added property.
            // (They get filtered out in a separate step below.)
            return PropertyFilter.isValidMatchMissing(propertyValueSet, propertyValueItem.property_filter)
              ? propertyValueSet
              : undefined;
          })
          // Filtering out invalid combos after each property prevents the array size from exploding too bad.
          .filter((possiblyUndefined) => !!possiblyUndefined);
      })
      // Flatten.
      .reduce((soFar, next) => soFar.concat(next), []);

    // if(propertyValueSets1 === undefined)
    //   throw new Error("propertyValueSets1 is undefined");
    propertyValueSets = propertyValueSets1 as PropertyValueSet.PropertyValueSet[];

  });

  // Complete the PVS'es with default values.
  // const defaults = PropertyValueSet.fromMap(new Map(allProperties
  //   .filter(property => !!property.def_value && !!property.def_value.length)
  //   .map(property => <[string, PropertyValueUnionType]> [
  //     property.name,
  //     property.def_value[0].value.value
  //   ])
  // ));
  const defaults1 = allProperties
    .filter((property) => !!property.def_value && !!property.def_value.length)
    .map((property) => ({
      [property.name]: property.def_value[0].value
    }));
  const defaults = defaults1.reduce((soFar, next) => PropertyValueSet.merge(soFar, next), PropertyValueSet.Empty);

  // const firstOptions = PropertyValueSet.fromMap(new Map(allProperties
  //   .filter(property => !!property.value && !!property.value.length)
  //   .map(property => <[string, PropertyValueUnionType]> [
  //     property.name,
  //     property.value[0].value.value
  //   ])
  // ));
  const firstOptions1 = allProperties
    .filter((property) => !!property.value && !!property.value.length)
    .map((property) => ({
      [property.name]: property.value[0].value
    }));
  const firstOptions = firstOptions1.reduce((soFar, next) => PropertyValueSet.merge(soFar, next), PropertyValueSet.Empty);

  // const fallbacks = firstOptions.setValues(defaults);
  const fallbacks = PropertyValueSet.setValues(defaults, firstOptions);
  // propertyValueSets = propertyValueSets.map((propertyValueSet) => fallbacks.setValues(propertyValueSet));
  propertyValueSets = propertyValueSets.map((propertyValueSet) => PropertyValueSet.setValues(propertyValueSet, fallbacks));

  // The filtering above won't catch properties that get invalidated by following properties.
  const before = propertyValueSets.length;
  propertyValueSets = propertyValueSets
  // PropertyValueSets needs to have...
    .filter(propertyValueSet => allProperties
      // ...their every (discrete) propertyValue...
        .filter((property) => !!property.value && !!property.value.length)
        .every((property) => {
          //  ...set to a valid value.

          const valueItem = property.value
          // .find(v => v.value.equals(propertyValueSet.getValue(property.name)));
            .find(v => PropertyValue.equals(PropertyValueSet.getValue(property.name, propertyValueSet), v.value));

          if (!valueItem) {
            console.warn(`Property is set to non-existing value (bad default?): ${property.name}`);
            throw new Error("Property is set to non-existing value (bad default?)");
          }

          return valueItem && PropertyFilter.isValid(propertyValueSet, valueItem.property_filter);
        })
    );
  const loss = propertyValueSets.length - before;
  if (loss > 0) {
    console.warn(`Discarded ${loss} variants because they are invalid. Implement recursive search with backtracking over default values to find valid combos.`);
  }

  // TODO: Instead of just filtering out bad combos, fiddle with the default values until they pass.

  return propertyValueSets;
}

