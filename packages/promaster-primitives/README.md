# Introduction

This is the main implementation of Promaster Primitives. There are other ports and clones but the goal is 
to keep this single repo well maintained, documented, and tested.

This implementaiton uses a functional approach with pure data-records and functions that operates on those data-records.
If desired, other approches such as class-based can be built on top by combining the data-records and functions into classes. 

# Run-time requirements

This libarary is compiled to ES5 and does not require any polyfills. Specifically it does not use
ES6 specific API:s like ´Map´ or ´Set´.

# Libraries
## Measure

* [Amount](./doc/measure/amount.md)
* [Unit](./doc/measure/unit.md)
* [Units](./doc/measure/units.md)

# Scripts

To publish do npm run publish:patch
TODO: Document all npm scripts
