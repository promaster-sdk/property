# promaster-primitives
## Introduction

This is the main implementation of `promaster-primitives`. There are other ports and clones but the goal is 
to keep this single repo well maintained, documented, and tested.

This implementaiton uses a functional approach with data-records and pure functions that uses those data-records.
If desired, other approches such as class-based can be built on top by combining the data-records and functions into classes. 

## Run-time requirements

This libarary is compiled to ES5 and does not require any polyfills. It does not use any
ES6 specific API:s like `Map` or `Set`.

## Libraries
### Measure

* [Amount](./doc/measure/amount.md)
* [Unit](./doc/measure/unit.md)
* [Units](./doc/measure/units.md)

## How to test

Run `npm test`.

## How to publish

To publish patch (`0.0.x`), minor (`0.x.0`), or major (`x.0.0`) run the corresponding script:
```
  npm run publish:patch
  npm run publish:minor
  npm run publish:major
```

