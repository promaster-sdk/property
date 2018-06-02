# @promaster/property

## Introduction

This is the main implementation of `@promaster/property`. There are other ports and clones but the goal is to keep this single repo well maintained, documented, and tested.

This implementaiton uses a functional approach with data-records and pure functions that uses those data-records. If desired, other approches such as class-based can be built on top by combining the data-records and functions into classes.

## Run-time requirements

This libarary is compiled to ES5 and does not require any polyfills. It does not use any ES6 specific API:s like `Map` or `Set`.

## How to install

Once you have the [promaster npm registry](#npm-registry) setup and working, you can install the package using this command:

`npm install --save @promaster/property`
